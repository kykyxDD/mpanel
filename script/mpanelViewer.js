function MpanelViewer(parent){
	
	this.container;
	var preload;

	this.parent = parent;
	this.width = parent.offsetWidth,
	this.height = parent.offsetHeight
	var fov = 50, 
	 aspect = this.width/this.height, 
		orthoNear = -1000,
		orthoFar = 1000,
	   near = 1,
		far = 1000;
	var camera, camera_1, scene, scene_1, renderer, controls, light, light_1, shadowMapViewer;
	var stats;
	var self = this;
	var view_orthog = true;
	var start_zoom = 20;
	var maxPolarAngle = Math.PI/2;
	var material


	this.init = function(div){
		if(div) {
			this.container = document.createElement('div');
			div.appendChild(this.container);
			preload = this.container.querySelector('.preload');
			if(!preload) {
				preload = document.createElement('div');
				preload.className = 'preload show';
				this.container.appendChild(preload);
			}
			this.preload = preload;

		}

		this.container.classList.add('threejs');
		this.createCanvas();
		this.createBtn()
	};

	this.createCanvas = function(){

		this.size_plane = 50; 
		
		this.width = this.parent.offsetWidth;
		this.height = this.parent.offsetHeight;
		
		aspect = this.width/this.height;
		
		renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true });// antialias: true , preserveDrawingBuffer: true,, logarithmicDepthBuffer : true 
		renderer.domElement.style.backgroundColor = '#fff';
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setClearColor(new THREE.Color(0xffffff));
		renderer.setSize( this.width, this.height );
		renderer.autoClear = false;
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.container.appendChild( renderer.domElement );
		renderer.domElement.id = 'canvas';

		camera = new THREE.CombinedCamera(this.width, this.height, fov, near, far, orthoNear, orthoFar, view_orthog, start_zoom );// ( fov, aspect, near, far );
		camera.position.z = 30;

		camera_1 = new THREE.CombinedCamera(this.width, this.height, fov, near, far, orthoNear, orthoFar, view_orthog, start_zoom );// ( fov, aspect, near, far );
		camera_1.position.z = 30;

		scene = new THREE.Scene();
		scene_1 = new THREE.Scene();
		var light_0 = new THREE.AmbientLight( 0xffffff, 0.5);
		light_0.position.set(0, 1, 0);
		scene.add(light_0);

		// light.helper = new THREE.CameraHelper(light_0.shadow.camera)
		// light.helper.material.side = THREE.DoubleSide
		// scene.add(light.helper)

		controls = new THREE.OrbitControls( camera, renderer.domElement );

		controls.addEventListener( 'change', this.render.bind(this));

		controls.maxPolarAngle = maxPolarAngle; // - Math.PI/20;
		controls.minZoom = 3;
		controls.noPan = true;

		this.createEnvironment();

		this.animate();

		light = new THREE.DirectionalLight( 0xffffff, 1); //0.5
		scene.add(light);
		light.castShadow = true;
		light.position.set(50,200,50);
		light.shadow.bias = 0.006;
		light.target.position.set(0, 0, 0);

		light.shadow.mapSize.width = 512; 
		light.shadow.mapSize.height = 512; 
		this.light_indent = 30;

		light.shadow.camera.top = this.light_indent;
		light.shadow.camera.bottom = -this.light_indent;
		light.shadow.camera.left = -this.light_indent;
		light.shadow.camera.right = this.light_indent;

		light.shadow.camera.near = 180;
		light.shadow.camera.far = 230;
		light.shadow.darkness = 1;

		light.shadow.radius = 1.5;

		// light.helper = new THREE.CameraHelper(light.shadow.camera)
		// light.helper.material.side = THREE.DoubleSide
		// scene.add(light.helper)
	};

	this.createBtn = function(){
		var self = this;
		var par = this.container //this.parent;
		var cont_btn = createElem('div', par, 'navigation');

		var cont_top = createElem('div', cont_btn, 'cont_btn_top');
		var cont_bottom = createElem('div', cont_btn, 'cont_btn_bottom'); 

		var btn_top = createElem('div', cont_top, 'nav top');
		btn_top.addEventListener('click', function(){
			self.rotateUp(-1);
		});

		var btn_left = createElem('div', cont_bottom, 'nav left');
		btn_left.addEventListener('click', function(){
			self.rotateLeft(-1);
		});
		var btn_bottom = createElem('div', cont_bottom, 'nav bottom');
		btn_bottom.addEventListener('click', function(){
			self.rotateUp(1);
		});
		var btn_right = createElem('div', cont_bottom, 'nav right');
		btn_right.addEventListener('click', function(){
			self.rotateLeft(1);
		});

		var cont_div_color = createElem('div', par, 'elem_color');
		var cont_input = createElem('div', cont_div_color, 'elem_cont_color')
		var input = createElem('input', cont_input, 'set_color');
		input.setAttribute('type', 'color');
		this.input_color = false;

		if(input.type == "color"){
			input.addEventListener('input', function(){
				self.setValColor(input.value)
			});
			this.input_color = input;
		};
		var text_color = createElem('div', cont_div_color, 'text');
		text_color.innerHTML = 'Colour <br>of Poles';
		
	};

	this.loadObj = function(url_obj, url_img, basic ){

		this.url_obj = url_obj;

		this.basicMaterial = basic;

		this.preloadOpen();
		var self = this
		var loader_obj = new THREE.OBJLoader();

		if(url_img){
			var textureLoader = new THREE.TextureLoader();
			textureLoader.load(url_img, function(texture){
				load_file_obj(texture)
			});
		} else {
			load_file_obj();
		};

		function load_file_obj(texture){
			loader_obj.load(url_obj, function(object){
				self.createObj(object, texture);
			});
		};
	};

	this.checkNameMembrane = function(name){
		return name == 'membrane_top' || name == 'membrane_bottom' || 
				name == 'membrane top' || name == 'membrane bottom'
	}

	this.createObj = function(object, texture){
		var self = this;

		this.removePrevData();
		this.pole_color = false;

		var box = new THREE.Box3().setFromObject(object);

		object.castShadow = true; 
		object.receiveShadow = true;
		object.traverse( function(child){
			if(child instanceof THREE.Mesh){
				if(self.checkNameMembrane(child.name)){
					var color = child.material.color.getHexString();
					if(texture){
						child.material.map = texture;
						child.material.map.wrapS = child.material.map.wrapT = THREE.RepeatWrapping; 
						child.material.map.repeat.set( 15, 20 );
						child.material.map.needsUpdate = true;
						child.material.needsUpdate = true;
					//} else {
					//	child.material.color.setRGB(1,1,1) //(color.r, color.g, color.b)
					}
				} else {
					child.receiveShadow = true;
				}

				if(!self.pole_color && child.name.indexOf('pole') >= 0){
					self.pole_color = {
						r : child.material.color.r,
						g : child.material.color.g,
						b : child.material.color.b
					}
				}
				child.castShadow = true;
			}
		});
		this.item_object = object;
		this.obj_data.add( object );
		this.updateCenterObj(object)
		// this.setValColor(self.pole_color);
		if(this.input_color){
			this.setInputColor();
		}
		if(this.basicMaterial){
			this.createMeshMaterial();
		}

		this.viewTop(true);
	};
	this.setInputColor = function(){
		var r = (this.pole_color.r*255).toString(16);
		r = r.length == 1 ? '0'+r : r;

		var b = (this.pole_color.b*255).toString(16);
		b = b.length == 1 ? '0'+b : b;

		var g = (this.pole_color.g*255).toString(16);
		g = g.length == 1 ? '0'+g : g;
		
		this.input_color.value = ['#', r, g, b].join('');
	};
	this.getInputColor = function(val){
		val = val ? val : this.input_color.value;
		var color = val.substr(1);
		return {
			r: +('0x'+color.substring(0,2))/255,
			g: +('0x'+color.substring(2,4))/255,
			b: +('0x'+color.substring(4,6))/255
		}
	};

	this.setValColor = function(val_color){
		
		var color = this.getInputColor(val_color);
		this.item_object.traverse(function(child){
			if(child instanceof THREE.Mesh){
				if(!self.checkNameMembrane(child.name)){
					child.material.color.setRGB(color.r, color.g, color.b);
				}
			}
		});
	};

	this.updateZoom = function(){
		var zoom = controls.object.zoom;
		var box = this.item_object_box;

		var real_size = {
			w: box.w*zoom,
			h: box.h*zoom
		};

		if(real_size.w > this.width || real_size.h > this.height){
			var z_1 = (this.width - 50)/box.w;
			var z_2 = (this.height - 50)/box.h;
			var max_z = Math.max(0.1, Math.min(z_1, z_2))
			var diff = max_z/zoom;

			controls.dollyIn(diff)
		}
	}

	this.updateCenterObj = function(object){
		var box = new THREE.Box3().setFromObject(object);
		var min = box.min;
		var max = box.max;
		var dis_x = (min.x + max.x)/2;
		var dis_z = (min.z + max.z)/2;
		var w = max.x - min.x;
		var h = max.z - min.z;
		this.item_object_box = box;
		this.item_object_box.w = w;
		this.item_object_box.h = h;
		if(w > this.obj_plane.geometry.parameters.width || 
			h > this.obj_plane.geometry.parameters.height){
			this.updateSize(Math.max(w,h));
		} else if(this.obj_plane.geometry.parameters.width > this.size_plane) {

			controls.minZoom = 3;

			this.updateSizePlane(this.size_plane);

			this.updateSizeLight(this.light_indent);
		}

		var box = new THREE.Box3
		object.traverse(function(object) {
			if(!object.geometry) return

			if(!object.geometry.boundingBox) {
				object.geometry.computeBoundingBox();
			}

			box.union(object.geometry.boundingBox);
		})

		var center = box.getCenter();

		this.render();

		controls.target.y = center.y;
		object.position.x = -center.x;
		object.position.z = -center.z;

		this.updateZoom();
		this.preloadClose();

	};
	this.removePrevData = function(){
		camera.zoom = start_zoom;
		controls.spherical.radius = start_zoom
		camera.updateProjectionMatrix();
		var group = this.obj_data;
		for (var i = group.children.length - 1; i >= 0; i--) {
			// scene.remove(group.children[i]);
			group.remove(group.children[i]);
		}
	};



	this.skyBox = function(){
		var self = this
		var materials = [];

		var url_img = './image/' + 'sky_2.jpg';//"sky_1.png";
		var geometry = new THREE.SphereGeometry(53, 50, 50 );

		var textureLoader = new THREE.TextureLoader();
		textureLoader.load(url_img, function(texture){
			var material = new THREE.MeshBasicMaterial( {color: 0xffffff, map: texture,side : THREE.BackSide} );
			var sphere = new THREE.Mesh( geometry, material );
			sphere.overdraw = true;
			scene_1.add( sphere );
			self.sky = sphere;
//			self.preloadClose();
		});
	};

	this.createEnvironment = function(){
		// console.log("createEnvironment")

		var size = this.size_plane,
		segments = 30;

		var sphereGeometry = new THREE.SphereBufferGeometry( 5, 32, 32 );
		var sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
		var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
		sphere.castShadow = true; 
		sphere.receiveShadow = false; 

		// var texture = this.createRoundTexture()

		var planeGeometry = new THREE.PlaneBufferGeometry( size, size, 32, 32 );
		var planeMaterial = new THREE.MeshStandardMaterial( { color: 0x8EADC9, transparent: true, opacity: 0.3 } );
		planeMaterial.metalness = 0;

		var plane = new THREE.Mesh( planeGeometry, planeMaterial );
		plane.receiveShadow = true;
		scene.add( plane );

		plane.rotation.x = -Math.PI/2;
		plane.receiveShadow = true;
		this.obj_plane = plane;
		scene.add( plane );

		this.obj_data = new THREE.Object3D();
		this.obj_data.castShadow = true;
		scene.add(this.obj_data);

		this.skyBox()
	};

	this.updateSize = function(size){
		size = Math.floor(size) + 20;
		var n = size + 20;

		var s = this.size_plane/size;
		controls.minZoom = Math.max(0,3*s);

		this.updateSizePlane(size);
		this.updateSizeLight(n);

		// console.log('plane',plane)
	};
	this.updateSizePlane = function(){
		var plane = this.obj_plane;
		plane.geometry = new THREE.PlaneBufferGeometry( size, size, 32, 32 );
		plane.needsUpdate = true;
	};
	this.updateSizeLight = function(l){
		light.shadow.camera.top = l;
		light.shadow.camera.bottom = -l;
		light.shadow.camera.left = -l;
		light.shadow.camera.right = l;

		light.shadow.camera.updateProjectionMatrix();
	}

	this.getScreen = function(){

		var canvas = renderer.getContext().canvas;
		var format_image = "image/jpeg";
		var format = "jpg";

		var a = document.createElement('a');
		a.href = canvas.toDataURL(format_image);//.replace("image/png", "image/octet-stream");
		a.download = 'screen_mpanel.' + format;
		a.click();
	};

	var step_up = maxPolarAngle/3; //Math.PI/6;
	var step_left = Math.PI/4;

	this.rotateUp = function(index, no_duration){
		scaleTween.stop();
		var top = index*step_up;
		scaleTween.durationTime = no_duration ? 0 : 300;
		scaleTween.target.up += top
		scaleTween.start()
	}
	this.rotateLeft = function(index, no_duration){
		scaleTween.stop();
		var left = index*step_left;
		scaleTween.durationTime = no_duration ? 0 : 300;
		scaleTween.target.left += left
		scaleTween.start()
	}
	function valUpFrontObj(){
		var phi = controls.spherical.phi;
		var diff = (phi - controls.maxPolarAngle)/step_up;
		return diff 
	}

	function valLeftFrontObj(){
		var theta = controls.spherical.theta;
		var diff = theta%(Math.PI*2);
		var delta;

		if(diff < Math.PI) {
			delta = diff;
		} else {
			delta = diff - Math.PI*2;
		}
		var diff = delta/step_left;

		return diff
	}

	function valUpTopObj(){
		var phi = controls.spherical.phi;
		var diff = phi/step_up;

		return diff 
	}

	function valLeftIsomObj(){
		var theta = controls.spherical.theta;
		var delta = theta - Math.PI/4;
		var diff = checkDelta(delta)/step_left;
		return diff
	}
	function valUpIsomObj(){
		var phi = controls.spherical.phi;
		var diff = ((phi - (Math.PI/4) - controls.minPolarAngle)/step_up);
		return diff
	}

	function valRightObj(){

		var theta = controls.spherical.theta;
		var delta = theta - Math.PI/2;
		var diff = checkDelta(delta)/step_left;

		return diff
	}
	function checkDelta(delta){
		return Math.abs(delta) > Math.PI ? delta - 2*Math.PI*(delta / Math.abs(delta)) : delta;
	}
	this.perspective = function(camera_perspective){

		if(camera_perspective){
			camera.toOrthographic();
			camera_1.toOrthographic();
		} else { 
			camera.toPerspective();
			camera_1.toPerspective();
		}

	};

	this.viewIsometric = function(){
		var diff_left = valLeftIsomObj()
		this.rotateLeft(diff_left)

		var diff_up = valUpIsomObj()
		this.rotateUp(diff_up)
	};
	this.viewRight = function(){

		var diff = valRightObj()
		this.rotateLeft(diff)

		var diff_up = valUpFrontObj()
		this.rotateUp(diff_up)
	};
	this.viewFront = function(){

		if(controls.spherical.theta != 0){
			var diff_left = valLeftFrontObj()
			this.rotateLeft(diff_left)
		}

		var diff_up = valUpFrontObj();
		this.rotateUp(diff_up);
	};
	this.updateMaterial = function(basic){
		if(!this.item_object) return
		this.basicMaterial = basic;
		this.createMeshMaterial()
	}

	this.createMeshMaterial = function(){
		var basic = this.basicMaterial;
		var obj = this.item_object;
		this.item_object.traverse(function(child){
			if(child instanceof THREE.Mesh){
				if(self.checkNameMembrane(child.name)){
					child.material.wireframe = basic
				}
			}
		});
	};
	this.viewTop = function(no_duration){
		if(controls.spherical.theta != 0){
			var diff_left = valLeftFrontObj()
			this.rotateLeft(diff_left, no_duration)
		}

		var diff = valUpTopObj();
		this.rotateUp(Math.ceil(diff), no_duration);

	};

/*   ----   ----  */

	var scaleTween = new TWEEN.Tween({ left: 0, up: 0 })
		.to({ left: 0, up: 0 }, 300)
		.easing(TWEEN.Easing.Cubic.Out)
		.onUpdate(scaleTweenUpdate)
		.onComplete(scaleTweenComplete)

	this.rotate = {
		left: 0, up: 0
	}

	function scaleTweenUpdate() {

		var dist_up = scaleTween.source.up - self.rotate.up;
		var dist_left = scaleTween.source.left - self.rotate.left;
		self.rotate.up = scaleTween.source.up;
		self.rotate.left = scaleTween.source.left;
		controls.rotateUp(dist_up);
		controls.rotateLeft(dist_left);
	}

	function scaleTweenComplete() {
		var dist_up = scaleTween.target.up - scaleTween.source.up;
		var dist_left = scaleTween.target.left - scaleTween.source.left; 

		self.rotate.up = scaleTween.target.up;
		self.rotate.left = scaleTween.target.left;
		controls.rotateUp(dist_up);
		controls.rotateLeft(dist_left);
	}

	function createElem(tag, par, class_name){
		var elem = document.createElement(tag);
		if(class_name){
			elem.className = class_name;
		}

		if(par){
			par.appendChild(elem);
		}

		return elem
	}

	this.preloadClose = function(){
		var self = this;

		clearTimeout(self.classRemove)
		this.classRemove = setTimeout(function(){
			self.preload.classList.remove('show');	
		}, 50);
		
	};
	this.preloadOpen = function(){
		clearTimeout(self.classRemove)
		preload.classList.add('show');
	};

	function onWindowResize() {
		this.width = this.parent.offsetWidth;
		this.height = this.parent.offsetHeight;

		camera.setSize(this.width, this.height);
		camera_1.setSize(this.width, this.height);

		renderer.setSize( this.width, this.height );
		camera.updateProjectionMatrix();
	};
	this.onWindowResize = onWindowResize;

	this.animate = function() {
		// stats.update();
		controls.update();

		self.render();
		requestAnimationFrame( self.animate );
	};
	this.render = function() {
		TWEEN.update();
		renderer.clear();

		camera_1.rotation.copy(camera.rotation);
		renderer.render(scene_1, camera_1);

		renderer.clearDepth();
		renderer.render(scene, camera)
	};

	this.init(parent);
}