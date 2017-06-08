function Main(parent){
	
	var container;
	var preload;

	this.parent = parent;
	this.width = parent.offsetWidth,
	this.height = parent.offsetHeight
	var fov = 50, 
	 aspect = this.width/this.height, 
	   near = 1,
		far = 1000;
	var camera, camera_1, scene, scene_1, renderer, controls, light, light_1, shadowMapViewer;
	var stats;
	var self = this;

	this.init = function(div){
		
		if(div) {
			container = div;
			preload = container.querySelector('.preload');
			if(!preload) {
				preload = document.createElement('div');
				preload.className = 'preload';
				container.appendChild(preload);
			}
		}
		this.preloadOpen();
		
		container.classList.add('threejs');
		this.createCanvas();
		this.createBtn()
	};

	this.createCanvas = function(){
		this.preloadOpen();
		this.width = this.parent.offsetWidth,
		this.height = this.parent.offsetHeight
		
		aspect = this.width/this.height;
		
		renderer = new THREE.WebGLRenderer({antialias: true  });// antialias: true , preserveDrawingBuffer: true,, logarithmicDepthBuffer : true 
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setClearColor(new THREE.Color(0xffffff));
		renderer.setSize( this.width, this.height );
		renderer.autoClear = false;
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		container.appendChild( renderer.domElement );
		renderer.domElement.id = 'canvas';

		stats = new Stats();
		// container.appendChild( stats.dom );

		camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
		camera.position.z = 30;

		camera_1 = new THREE.PerspectiveCamera( fov, aspect, near, far );
		camera_1.position.z = 30;

		scene = new THREE.Scene();
		scene_1 = new THREE.Scene();
		var light_0 = new THREE.AmbientLight( 0xffffff, 0.5);
		light_0.position.set(0, 1, 0)
		scene.add(light_0)
		// scene.add(new THREE.AmbientLight( 0xffffff, 0));//0.5
		light = new THREE.DirectionalLight( 0xffffff, 1); //0.5
		light.castShadow = true;
		light.position.set(50,200,50);
		light.shadow.bias = 0.006
		//light.target.position.set(1,1,1)
		light.target.position.set(0, 0, 0);

		light.shadow.mapSize.width = 512; 
		light.shadow.mapSize.height = 512; 
		// light.shadow.radius = 10

		light.shadow.camera.top = 30;
		light.shadow.camera.bottom = -30;
		light.shadow.camera.left = -30;
		light.shadow.camera.right = 30;


		light.shadow.camera.near = 180;
		light.shadow.camera.far = 230;
		light.shadow.darkness = 1;

		light.shadow.radius = 1.5;


		light.helper = new THREE.CameraHelper(light.shadow.camera)
		light.helper.material.side = THREE.DoubleSide
		// scene.add(light.helper)


		scene.add(light);

		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.addEventListener( 'change', this.render.bind(this) ); // remove when using animation loop
		controls.maxPolarAngle = Math.PI/2 // - Math.PI/20;
		controls.noPan = true;


		window.addEventListener('resize', self.onWindowResize.bind(self));

		this.createEnvironment();
		this.preloadClose()

		this.animate();
	};

	this.createBtn = function(){
		var self = this;
		var par = this.parent;
		var cont_btn = createElem('div', par, 'navigation');

		var cont_top = createElem('div', cont_btn, 'cont_btn_top');
		var cont_bottom = createElem('div', cont_btn, 'cont_btn_bottom'); 

		var btn_top = createElem('div', cont_top, 'nav top');
		btn_top.addEventListener('click', function(){
			self.rotateUp(-1);
		})

		var btn_left = createElem('div', cont_bottom, 'nav left');
		btn_left.addEventListener('click', function(){
			self.rotateLeft(-1);
		})
		var btn_bottom = createElem('div', cont_bottom, 'nav bottom');
		btn_bottom.addEventListener('click', function(){
			self.rotateUp(1);
		})
		var btn_right = createElem('div', cont_bottom, 'nav right');
		btn_right.addEventListener('click', function(){
			self.rotateLeft(1);
		})
	};

	this.loadData = function(url){
		this.preloadOpen()
		var self = this;

		var arr = [];
		var files = []
		
		var request = new XMLHttpRequest();
		request.open("GET", url, true);
		request.onload = function(){
			if (this.status == 200) {

				var blob = new Blob([this.response], {type: 'compress/zip'});

				zip.createReader(new zip.BlobReader(blob), function(zipReader) {
					zipReader.getEntries(function(entries){
						self.getObjMtl(entries);
					});
				}, onerror);
			}
		}
		request.responseType = 'arraybuffer';

		request.send();
	};
	this.getObjMtl = function(entries){
		if(!this.obj_data) {
			this.obj_data = new THREE.Object3D();
			// light.target = targetObject;
			scene.add(this.obj_data);
		}

		if(this.obj_data.children){
			this.removePrevData()
		}

		var self = this;
		this.num_load_text = 0;
		this.allBoxObj = [];
		this.arr_obj = [];
		self.res_obj = false
		entries.forEach(function(entry){
			// if(self.res_obj) return
			if(entry.filename.indexOf('.obj') > -1 ){
				var path = entry.filename.split('/');
				var name = path[path.length-1].split('.');
				var mtl = getMtl(name[0]);
				if(mtl){
					
					self.num_load_text++;
					entry.getData(new zip.TextWriter("text/html"), function(text_entry){
						mtl.getData(new zip.TextWriter("text/html"), function(text_mtl){

							var obj = {
								obj: text_entry,
								mtl: text_mtl
							};
							if(!self.res_obj){
								self.item_obj = obj;
								self.loadObjScane(obj);
								
							}
							self.arr_obj.push(obj)
							
							self.res_obj = true
						});
					})

				}
			}
		});
		this.preloadClose()

		function getMtl(path){
			var res = false;
			entries.forEach(function(entry){
				if(entry.filename.indexOf(path +'.mtl') > -1 ){
					res = entry
				}
			});
			return res
		}
	};

	this.switchObj = function(index){
		var obj = this.arr_obj[index];
		if(obj){
			this.clearObj(obj);
		}
	};
	
	this.clearObj = function(obj){
		if(this.item_obj != obj){
			this.preloadOpen()
			this.removePrevData();
			this.loadObjScane(obj)
			this.item_obj = obj;
		}
	}

	this.loadObjScane = function(info){
		var loader = new THREE.OBJLoader();
		var mtlLoader = new THREE.MTLLoader();
		var self = this;

		var materials = mtlLoader.parse( info.mtl);
		materials.preload();
		loader.setMaterials( materials );

		var object = loader.parse( info.obj);

		var box = new THREE.Box3().setFromObject(object);

		this.allBoxObj.push(box)

		object.castShadow = true; 
		object.receiveShadow = true;
		object.traverse( function(child){
			if(child instanceof THREE.Mesh){
				child.castShadow = true;
				child.reciveShadow = true;
			}
		});
		this.obj_data.add( object );
		this.preloadClose();
		this.updateCenterObj(box, object)
	};
	this.updateCenterObj = function(box, root){
		
		var min = box.min;
		var max = box.max;
		var dis_x = (min.x + max.x)/2;
		var dis_z = (min.z + max.z)/2;

		var box = new THREE.Box3
		root.traverse(function(object) {
			if(!object.geometry) return

			if(!object.geometry.boundingBox) {
				object.geometry.computeBoundingBox()
			}

			box.union(object.geometry.boundingBox)
		})

		var center = box.getCenter()

		this.render();

		controls.target.y = center.y;
		root.position.x = -center.x
		root.position.z = -center.z

	};
	this.removePrevData = function(){
		var group = this.obj_data;
		for (var i = group.children.length - 1; i >= 0; i--) {
			// scene.remove(group.children[i]);
			group.remove(group.children[i]);
		}
	};



	this.skyBox = function(){
		var materials = [];
		var path = './image/skybox/';
		var images =  ['nx', 'px', 'py', 'ny', 'pz', 'nz'];
		for (var i=0; i<6; i++) {
			var img = new Image();
			img.src = path + images[i] + '.jpg';
			var tex = new THREE.Texture(img);
			img.tex = tex;
			img.onload = function() {
				this.tex.needsUpdate = true;
			};
			var mat = new THREE.MeshBasicMaterial({map: tex , side : THREE.BackSide});
			materials.push(mat);
		}
		var cubeGeo = new THREE.CubeGeometry(400,400,400,1,1,1);
		var cube = new THREE.Mesh(cubeGeo, new THREE.MeshFaceMaterial(materials));

		scene_1.add(cube);
	}

	this.createRoundTexture = function() {
		var color = '#778eba'
		var r = 10000
		var s = 512

		var canvas = document.createElement('canvas')
		var context = canvas.getContext('2d')

		canvas.width = s
		canvas.height = s
		context.fillStyle = color
		context.fillRect(0, 0, s, s)

		var pix = context.getImageData(0, 0, s, s)
		var d = pix.data

		for(var y = 0; y < s; y++)
		for(var x = 0; x < s; x++) {
			var i = (y * s + x) * 4

			var cx = x - s/2
			var cy = y - s/2

			d[i+3] = 255 * Math.min(1, Math.max(0, r / (cx * cx + cy * cy)))
		}

		context.putImageData(pix, 0, 0)

		var texture = new THREE.Texture(canvas)
		texture.minFilter = THREE.LinearFilter
		texture.magFilter = THREE.LinearFilter
		texture.needsUpdate = true

		return texture
	}

	this.createEnvironment = function(){
		// console.log("createEnvironment")

		var size = 50,
		segments = 30;

		var sphereGeometry = new THREE.SphereBufferGeometry( 5, 32, 32 );
		var sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
		var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
		sphere.castShadow = true; 
		sphere.receiveShadow = false; 

		// var texture = this.createRoundTexture()

		var planeGeometry = new THREE.PlaneBufferGeometry( size, size, 32, 32 );
		var planeMaterial = new THREE.MeshStandardMaterial( { color: 0x8EADC9, transparent: true, opacity: 0.3 } )
		planeMaterial.metalness = 0


		var plane = new THREE.Mesh( planeGeometry, planeMaterial );
		plane.receiveShadow = true;
		// plane.material.transparent
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

	this.rotateUp = function(index){
		scaleTween.stop();
		var top = index*Math.PI/8;
		scaleTween.target.up += top
		scaleTween.start()
	}
	this.rotateLeft = function(index){
		scaleTween.stop();
		var left = index*Math.PI/4;
		scaleTween.target.left += left
		scaleTween.start()
	}
	this.orientationIsometric = function(){
		console.log('orientationIsometric', this)
	};
	this.orientationRight = function(){
		console.log('orientationRight', this)
	};
	this.orientationFront = function(){
		console.log('orientationFront', this)
	};
	this.orientationTop = function(){
		console.log('orientationTop', this)
	};

/*   ----   ----  */

	var scaleTween = new TWEEN.Tween({ left: 0, up: 0 })
		.to({ left: 0, up: 0 }, 300)
		.easing(TWEEN.Easing.Cubic.Out)
		.onUpdate(scaleTweenUpdate)

	this.rotate = {
		left: 0, up: 0
	}

	function scaleTweenUpdate() {
		
		var dist_up = scaleTween.source.up - self.rotate.up   //- scaleTween.target.left
		var dist_left = scaleTween.source.left - self.rotate.left   //- scaleTween.target.left
		self.rotate.up = scaleTween.source.up;
		self.rotate.left = scaleTween.source.left;
		controls.rotateUp(dist_up)
		controls.rotateLeft(dist_left)
	}

	function scaleTweenComplete() {

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
		preload.classList.remove('show');
	};
	this.preloadOpen = function(){
		preload.classList.add('show');
	};

	function onWindowResize() {
		this.width = parent.offsetWidth,
		this.height = parent.offsetHeight

		camera.aspect = this.width / this.height;
		camera.updateProjectionMatrix();

		renderer.setSize( this.width, this.height );
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
		renderer.render(scene_1, camera_1)
		renderer.clearDepth();
		renderer.render(scene, camera)
	};

	this.init(parent);
}