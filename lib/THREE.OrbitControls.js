/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author erich666 / http://erichaines.com
 */
/*global THREE, console */

// This set of controls performs orbiting, dollying (zooming), and panning. It maintains
// the "up" direction as +Y, unlike the TrackballControls. Touch on tablet and phones is
// supported.
//
//    Orbit - left mouse / touch: one finger move
//    Zoom - middle mouse, or mousewheel / touch: two finger spread or squish
//    Pan - right mouse, or arrow keys / touch: three finter swipe
//
// This is a drop-in replacement for (most) TrackballControls used in examples.
// That is, include this js file and wherever you see:
//    	controls = new THREE.TrackballControls( camera );
//      controls.target.z = 150;
// Simple substitute "OrbitControls" and the control should work as-is.

THREE.OrbitControls = function ( object, domElement ) {

	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;
	this.tweenLeft = false;
	this.tweenForward = false;
	// API

	// Set to false to disable this control
	this.enabled = true;

	// "target" sets the location of focus, where the control orbits around
	// and where it pans with respect to.
	this.target = new THREE.Vector3();

	// center is old, deprecated; use "target" instead
	this.center = this.target;

	// This option actually enables dollying in and out; left as "zoom" for
	// backwards compatibility
	this.noZoom = false;
	this.zoomSpeed = 1.0;
	this.zoomScale = 0.95;
	this.plusRaduis = true
	this.minusRaduis = true

	// Limits to how far you can dolly in and out
	this.minDistance = 0;
	this.maxDistance = Infinity;

	// Set to true to disable this control
	this.noRotate = false;
	this.rotateSpeed = 1.0;

	// Set to true to disable this control
	this.noPan = false;
	this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

	// Set to true to automatically rotate around the target
	this.autoRotate = false;
	this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

	// How far you can orbit vertically, upper and lower limits.
	// Range is 0 to Math.PI radians.
	this.minPolarAngle = 0; // radians
	this.maxPolarAngle = Math.PI; // radians

	this.minRotate = -Math.PI * 2/3
	this.maxRotate =  Math.PI * 2/3

	this.borderBox = new THREE.Box3
	this.borderBox_tween = new THREE.Box3

	var min = this.borderBox.min
	,   max = this.borderBox.max
	min.x = min.y = min.z = -Infinity
	max.x = max.y = max.z =  Infinity

	var min_c = this.borderBox_tween.min
	,   max_c = this.borderBox_tween.max
	min_c.x = min_c.y = min_c.z = -Infinity
	max_c.x = max_c.y = max_c.z =  Infinity

	// Set to true to disable use of the keys
	this.noKeys = false;
	this.animation = false;
	this.animationScale = false;
	this.moment = new Momentum();
	// this.moment.speedThreshold = 1e-5

	// The four arrow keys
	this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

	////////////
	// internals

	var scope = this;

	var EPS = 0.000001;

	var rotateStart = new THREE.Vector2();
	var rotateEnd = new THREE.Vector2();
	var rotateDelta = new THREE.Vector2();

	var panStart = new THREE.Vector2();
	var panEnd = new THREE.Vector2();
	var panDelta = new THREE.Vector2();
	var panOffset = new THREE.Vector3();

	var offset = new THREE.Vector3();

	var dollyStart = new THREE.Vector2();
	var dollyEnd = new THREE.Vector2();
	var dollyDelta = new THREE.Vector2();
	var time_scale = 300;

	var phiDelta = 0;
	var thetaDelta = 0;
	var scale = 1;
	var pan = new THREE.Vector3();

	var lastPosition = new THREE.Vector3();
	var lastQuaternion = new THREE.Quaternion();

	var STATE = {
		NONE   : 0,
		ROTATE : 1,
		DOLLY  : 2,
		PAN    : 4,
		TOUCH_ROTATE : 8,
		TOUCH_DOLLY  : 16,
		TOUCH_PAN    : 32
	};

	var state = STATE.NONE;

	// for reset

	this.target0 = this.target.clone();
	this.position0 = this.object.position.clone();

	// so camera.up is the orbit axis

	var quat = new THREE.Quaternion().setFromUnitVectors( object.up, new THREE.Vector3( 0, 1, 0 ) );
	var quatInverse = quat.clone().inverse();

	// events

	var changeEvent = { type: 'change' };
	var startEvent = { type: 'start'};
	var endEvent = { type: 'end'};

	this.rotateLeft = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		thetaDelta -= angle;
	};

	this.rotateUp = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		phiDelta -= angle;
	};

	// pass in distance in world space to move left
	this.panLeft = function(distance){
		var te = this.object.matrix.elements;

		// get X column of matrix
		panOffset.set( te[ 0 ], te[ 1 ], te[ 2 ] );

		var length = panOffset.length();
		panOffset.y = 0;
		panOffset.setLength( length );
		panOffset.multiplyScalar(-distance);

		pan.add( panOffset );
		scope.update();
	};

	// pass in distance in world space to move up
	this.panUp = function ( distance ) {

		var te = this.object.matrix.elements;

		// get Y column of matrix
		panOffset.set( te[ 4 ], te[ 5 ], te[ 6 ] );

		var length = panOffset.length();
		panOffset.x = panOffset.z = 0;
		panOffset.setLength( length );
		panOffset.multiplyScalar( distance );

		pan.add( panOffset );

	};

	this.panForward = function(distance){
		var te = this.object.matrix.elements;

		// get Z column of matrix
		panOffset.set( te[ 8 ], te[ 9 ], te[ 10 ] );

		var length = panOffset.length();
		panOffset.y = 0;
		panOffset.setLength( length );
		panOffset.multiplyScalar( -distance );

		pan.add( panOffset );
		scope.update();
	}
	
	// pass in x,y of change desired in pixel space,
	// right and down are positive
	this.pan = function ( deltaX, deltaY ) {

		var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
		var width = element.clientWidth;
		var height = element.clientHeight;

		if ( scope.object.fov !== undefined ) {

			// perspective
			var position = scope.object.position;
			var offset = position.clone().sub( scope.target );
			var targetDistance = offset.length();

			// half of the fov is center to top of screen
			targetDistance *= Math.tan( ( scope.object.fov / 2 ) * Math.PI / 180.0 );

			// we actually don't use screenWidth, since perspective camera is fixed to screen height
			// scope.panLeft( 2 * deltaX * targetDistance / element.clientHeight );
			// scope.panUp( 2 * deltaY * targetDistance / element.clientHeight );

			scope.panLeft(2 * panDelta.x * targetDistance / width)
			scope.panForward(2 * panDelta.y * targetDistance / height)

		} else if ( scope.object.top !== undefined ) {

			// orthographic
			// scope.panLeft( deltaX * (scope.object.right - scope.object.left) / element.clientWidth );
			// scope.panUp( deltaY * (scope.object.top - scope.object.bottom) / element.clientHeight );

			scope.panLeft(panDelta.x * (scope.object.right - scope.object.left) / width)
			scope.panForward(panDelta.y * (scope.object.top - scope.object.bottom) / height)

		} else {

			// camera neither orthographic or perspective
			console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.' );

		}

	};


	this.dollyIn = function ( dollyScale, time ) {
		var resultScale = Math.pow(dollyScale || this.zoomScale, this.zoomSpeed)

		this.animeScale(1 / resultScale, time)
	};

	this.dollyOut = function ( dollyScale, time ) {
		var resultScale = Math.pow(dollyScale || this.zoomScale, this.zoomSpeed)

		this.animeScale(resultScale, time)
	};


	var scaleTween = new TWEEN.Tween({ radius: 1 })
		.setTarget({})
		.easing(TWEEN.Easing.Cubic.Out)
		.onUpdate(scaleTweenUpdate)

	function scaleTweenUpdate() {
		scale = scaleTween.source.radius / scope.radius
		scope.update()
	}

	function scaleTweenComplete() {
		scale = scaleTween.target.radius / scope.radius
		scope.update()
	}

	this.animeScale = function(scale, time) {
		scaleTween.durationTime = time || time_scale
		scaleTween.source.radius = scope.radius

		var target = scaleTween.target.radius
		if(isNaN(target)) {
			target = scaleTween.source.radius
		}

		target = target / scale

		if(!scope.disableBorders) {
			var clamped = Math.max(scope.minDistance, Math.min(scope.maxDistance, target))
			var delta = 1 - Math.abs(clamped - target) / target

			scaleTween.durationTime *= delta
			target = clamped
		}

		scaleTween.target.radius = target
		scaleTween.start()
	}


	this.updateMomentum = function(){

		scope.moment.update()

		if(scope.moment.active) {

			var delta = new THREE.Vector3().subVectors(scope.moment.point, scope.target)

			scope.object.position.add(delta)
			scope.target.add(delta)
			scope.update()

		} else if(state & (STATE.PAN | STATE.TOUCH_PAN)) {
			scope.moment.push(scope.target.x, scope.target.y, scope.target.z)
		}
	}

	this.update = function () {
		var position = this.object.position;

		offset.copy( position ).sub( this.target );

		// rotate offset to "y-axis-is-up" space
		offset.applyQuaternion( quat );

		// angle from z-axis around y-axis

		var theta = Math.atan2( offset.x, offset.z );

		// angle from y-axis

		var phi = Math.atan2( Math.sqrt( offset.x * offset.x + offset.z * offset.z ), offset.y );

		if ( this.autoRotate ) {

			this.rotateLeft( getAutoRotationAngle() );

		}

		theta += thetaDelta;
		phi += phiDelta;

		// restrict phi to be between desired limits
		if(!this.disableBorders) {
			phi = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, phi ) );
		}


		if(!this.disableBorders) {
			theta = Math.max( this.minRotate, Math.min( this.maxRotate, theta ) );
		}

		// restrict phi to be betwee EPS and PI-EPS
		phi = Math.max( EPS, Math.min( Math.PI - EPS, phi ) );

		this.radius = offset.length() * scale;

		// restrict radius to be between desired limits
		if(!this.disableBorders) {
			this.radius = Math.max( this.minDistance, Math.min( this.maxDistance, this.radius ) );
			if(Math.abs(this.radius - this.minDistance) < 5){
				this.plusRaduis = false;
			} else {
				this.plusRaduis = true;
			}

			if(Math.abs(this.maxDistance - this.radius) < 5){
				this.minusRaduis = false;
			} else {
				this.minusRaduis = true;
			}
		}
		// move target to panned location
		this.target.add( pan );

		if(!this.disableBorders && !this.borderBox.isEmpty()) {
			var obj = getLimit();

			scope.target.min(obj.max);
			scope.target.max(obj.min);
		}

		offset.x = this.radius * Math.sin( phi ) * Math.sin( theta );
		offset.y = this.radius * Math.cos( phi );
		offset.z = this.radius * Math.sin( phi ) * Math.cos( theta );

		// rotate offset back to "camera-up-vector-is-up" space
		offset.applyQuaternion( quatInverse );

		position.copy( this.target ).add( offset );
		var self = this;

		if(offset.lengthSq()) {
			this.object.lookAt( this.target );
		}

		thetaDelta = 0;
		phiDelta = 0;
		scale = 1;
		pan.set( 0, 0, 0 );

		// update condition is:
		// min(camera displacement, camera rotation in radians)^2 > EPS
		// using small-angle approximation cos(x/2) = 1 - x^2 / 8

		if ( lastPosition.distanceToSquared( this.object.position ) > EPS
		    || 8 * (1 - lastQuaternion.dot(this.object.quaternion)) > EPS ) {

			this.changed = true
			this.dispatchEvent( changeEvent );

			lastPosition.copy( this.object.position );
			lastQuaternion.copy (this.object.quaternion );

		}
	};


	this.reset = function () {

		state = STATE.NONE;

		this.target.copy( this.target0 );
		this.object.position.copy( this.position0 );

		this.update();

	};

	function getAutoRotationAngle() {

		return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

	}


	function onMouseDown( event ) {

		if ( scope.enabled === false ) return;
		event.preventDefault();

		scope.down = true;

		switch(event.button) {
			case 0:
				if ( scope.noRotate === true ) return;

				state |= STATE.ROTATE;

				rotateReverseTween.stop()
				rotateStart.set( event.clientX, event.clientY );
			break

			case 1:
				if ( true || scope.noZoom === true ) return;

				state |= STATE.DOLLY;

				dollyStart.set( event.clientX, event.clientY );
			break

			case 2:
				if ( scope.noPan === true ) return;

				state |= STATE.PAN;
				borderBoxTween.stop()

				scope.moment.stop()
				panStart.set( event.clientX, event.clientY );
			break
		}


		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'mouseup', onMouseUp, false );
		scope.dispatchEvent( startEvent );
	}

	function onMouseMove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();

		var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
		var width = element.clientWidth;
		var height = element.clientHeight;
		var position = scope.object.position;
		var offset = position.clone().sub( scope.target );
		var targetDistance = offset.length();

		targetDistance *= Math.tan( ( scope.object.fov / 2 ) * Math.PI / 180.0 );


		if ( state & STATE.PAN ) {

			if ( scope.noPan === true ) return;

			panEnd.set( event.clientX, event.clientY );
			panDelta.subVectors( panEnd, panStart );

			scope.panLeft(2 * panDelta.x * targetDistance / width)
			scope.panForward(2 * panDelta.y * targetDistance / height)

			panStart.copy( panEnd );

		} else if ( state & STATE.DOLLY ) {

			if ( scope.noZoom === true ) return;

			dollyEnd.set( event.clientX, event.clientY );
			dollyDelta.subVectors( dollyEnd, dollyStart );

			scope.panUp(2 * dollyDelta.y * targetDistance / height)

			dollyStart.copy( dollyEnd );

		} else if ( state & STATE.ROTATE ) {

			if ( scope.noRotate === true ) return;

			rotateEnd.set( event.clientX, event.clientY );
			rotateDelta.subVectors( rotateEnd, rotateStart );

			// rotating across whole screen goes 360 degrees around
			scope.rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );

			// rotating up and down along whole screen attempts to go 360, but limited to 180
			scope.rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

			rotateStart.copy( rotateEnd );

		}


		scope.update();
	}


	function onMouseUp( event ) {

		if ( scope.enabled === false ) return;

		scope.down = false;

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );

		scope.dispatchEvent( endEvent );

		if(state & STATE.ROTATE) {
			state &= ~STATE.ROTATE
			rotateReverse()
		}

		if(state & STATE.PAN) {
			scope.moment.push(scope.target.x, scope.target.y, scope.target.z)
			scope.moment.go()
			borderBox()
		}

		state = STATE.NONE
	}



	rotateReverseTween = new TWEEN.Tween({ theta: 0 })
		.to({ theta: 0 }, 750)
		.easing(TWEEN.Easing.Cubic.Out)
		.onUpdate(rotateReverseUpdate)
		.onComplete(rotateReverseComplete)

	function rotateReverse() {
		rotateReverseTween.source.theta = Math.atan2(offset.x, offset.z)
		rotateReverseTween.target.theta = 0
		rotateReverseTween.start()
	}

	function rotateReverseUpdate() {
		thetaDelta = rotateReverseTween.source.theta - Math.atan2(offset.x, offset.z)
		scope.update()
	}

	function rotateReverseComplete() {
		thetaDelta = -Math.atan2(offset.x, offset.z)
		scope.update()
	}


	borderBoxTween = new TWEEN.Tween({ max_x: 0, min_x: 0, max_z: 0, min_z: 0})
		.to({ max_x: 0, min_x: 0, max_z: 0, min_z: 0}, 750)
		.easing(TWEEN.Easing.Cubic.Out)
		.onUpdate(borderBoxUpdate)
		.onStop(borderBoxStop)
		.onComplete(borderBoxComplete)

	function borderBox() {
		setBorderBoxTween()

		borderBoxTween.source.min_x = scope.borderBox_tween.min.x;
		borderBoxTween.source.max_x = scope.borderBox_tween.max.x;
		borderBoxTween.source.min_z = scope.borderBox_tween.min.z;
		borderBoxTween.source.max_z = scope.borderBox_tween.max.z;

		borderBoxTween.target.min_x = scope.borderBox.min.x;
		borderBoxTween.target.max_x = scope.borderBox.max.x;
		borderBoxTween.target.min_z = scope.borderBox.min.z;
		borderBoxTween.target.max_z = scope.borderBox.max.z;

		scope.borderbox_anime = true;

		borderBoxTween.start();

	}

	function borderBoxUpdate() {

		scope.borderBox_tween.min.x = borderBoxTween.source.min_x;
		scope.borderBox_tween.max.x = borderBoxTween.source.max_x;

		scope.borderBox_tween.min.z = borderBoxTween.source.min_z;
		scope.borderBox_tween.max.z = borderBoxTween.source.max_z;

		scope.update()
	}
	function borderBoxStop(){
		setBorderBoxTween();
	}

	function borderBoxComplete() {
		var max = scope.borderBox.max;
		var min = scope.borderBox.min;

		scope.borderbox_anime = false;
		scope.update()
	}

	function setBorderBoxTween(){

		var max  = scope.borderBox.max;
		var min  = scope.borderBox.min;
		var size = scope.fun_parent.localSize;
		scope.borderBox_tween.min.x = min.x - size.w*0.75;
		scope.borderBox_tween.max.x = max.x + size.w*0.75;
		scope.borderBox_tween.min.z = min.z - size.h*0.75;
		scope.borderBox_tween.max.z = max.z + size.h*0.75;

	}
	this.setBorderBoxTween = setBorderBoxTween;

	function getLimit(){
		var min, max;
		if((state & (STATE.PAN | STATE.TOUCH_PAN)) || scope.borderbox_anime ){
			max = scope.borderBox_tween.max;
			min = scope.borderBox_tween.min;
		} else {
			max = scope.borderBox.max;
			min = scope.borderBox.min;
		}

		return {
			'min': min,
			'max': max
		}
	}



	function onMouseWheel( event ) {

		if ( scope.enabled === false || scope.noZoom === true ) return;

		event.preventDefault();
		event.stopPropagation();

		var delta = 0;

		if ( event.wheelDelta !== undefined ) { // WebKit / Opera / Explorer 9

			delta = event.wheelDelta;

		} else if ( event.deltaY !== undefined ) { // Firefox

			delta = - event.deltaY;

		} else if ( event.detail !== undefined ) { // WTF is that?

			delta = - event.detail;

		}

		if ( delta > 0 ) {

			scope.dollyIn();

		} else {

			scope.dollyOut();

		}

		scope.update();
		scope.dispatchEvent( startEvent );
		scope.dispatchEvent( endEvent );

	}

	function onKeyDown( event ) {
		if ( scope.enabled === false || scope.noKeys === true || scope.noPan === true ) return false;

		switch ( event.keyCode ) {

			case scope.keys.UP:
				scope.pan( 0, scope.keyPanSpeed );
				scope.update();
				break;

			case scope.keys.BOTTOM:
				scope.pan( 0, - scope.keyPanSpeed );
				scope.update();
				break;

			case scope.keys.LEFT:
				scope.pan( scope.keyPanSpeed, 0 );
				scope.update();
				break;

			case scope.keys.RIGHT:
				scope.pan( - scope.keyPanSpeed, 0 );
				scope.update();
				break;

			default: return false
		}

		return true
	}

	function touchstart( event ) {

		if ( scope.enabled === false ) return;

		switch ( event.touches.length ) {

			case 1:	// one-fingered touch: rotate

				if ( scope.noRotate === true ) return;

				state = STATE.TOUCH_ROTATE;

				rotateReverseTween.stop()
				rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
				break;

			case 2:	// two-fingered touch: dolly

				if ( scope.noZoom === true ) return;

				state = STATE.TOUCH_DOLLY;

				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				var distance = Math.sqrt( dx * dx + dy * dy );
				dollyStart.set( 0, distance );
				break;

			case 3: // three-fingered touch: pan

				if ( scope.noPan === true ) return;

				state |= STATE.TOUCH_PAN;

				scope.moment.stop()
				borderBoxTween.stop()
				panStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
				break;

			default:

				state = STATE.NONE;

		}

		scope.moment.stop()
		scope.dispatchEvent( startEvent );

	}

	function touchmove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
		var targetDistance = offset.length();

		targetDistance *= Math.tan( ( scope.object.fov / 2 ) * Math.PI / 180.0 );

		switch ( event.touches.length ) {

			case 3: // one-fingered touch: rotate

				if ( scope.noRotate === true ) return;
				if ( state !== STATE.TOUCH_ROTATE ) return;

				rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
				rotateDelta.subVectors( rotateEnd, rotateStart );

				// rotating across whole screen goes 360 degrees around
				scope.rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );
				// rotating up and down along whole screen attempts to go 360, but limited to 180
				scope.rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

				rotateStart.copy( rotateEnd );

				break;

			case 2: // two-fingered touch: dolly

				if ( scope.noZoom === true ) return;
				if ( state !== STATE.TOUCH_DOLLY ) return;

				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				var distance = Math.sqrt( dx * dx + dy * dy );

				dollyEnd.set( 0, distance );
				dollyDelta.subVectors( dollyEnd, dollyStart );

				if ( dollyDelta.y > 0 ) {

					scope.dollyIn();

				} else {

					scope.dollyOut();

				}

				dollyStart.copy( dollyEnd );

				break;

			case 1: // three-fingered touch: pan

				if ( scope.noPan === true ) return;
				if ( state !== STATE.TOUCH_PAN ) return;

				panEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
				panDelta.subVectors( panEnd, panStart );
				
				scope.pan( panDelta.x, panDelta.y );

				panStart.copy( panEnd );

				break;

			default:

				state = STATE.NONE;

		}
		scope.update();
	}

	function touchend( /* event */ ) {

		if ( scope.enabled === false ) return;

		scope.dispatchEvent( endEvent );

		switch(state) {
			case STATE.TOUCH_PAN:
				scope.moment.push(scope.target.x, scope.target.y, scope.target.z)
				scope.moment.go()
				borderBox()
			break

			case STATE.TOUCH_ROTATE:
				rotateReverse()
			break
		}

		state = STATE.NONE;
	}

	this.domElement.addEventListener( 'contextmenu', function ( event ) {
		if ( scope.enabled === false ) return;

		event.preventDefault();
	}, false );

	this.onKeyDown = onKeyDown

	this.domElement.addEventListener( 'mousedown', onMouseDown, false );
	this.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
	this.domElement.addEventListener( 'wheel', onMouseWheel, false );
	this.domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox

	this.domElement.addEventListener( 'touchstart', touchstart, false );
	this.domElement.addEventListener( 'touchend', touchend, false );
	this.domElement.addEventListener( 'touchmove', touchmove, false );

	// window.addEventListener( 'keydown', onKeyDown, false );

	// force an update at start
	this.update();

};

THREE.OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );
