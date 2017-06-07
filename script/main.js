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
	var camera, scene, renderer, controls, light, light_1, shadowMapViewer;
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
			scene.add(this.obj_data);
		}

		if(this.obj_data.children){
			// console.log('child')
			this.removePrevData()
		}

		var self = this;
		this.num_load_text = 0;
		this.allBoxObj = [];
		entries.forEach(function(entry){
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
							self.loadObjScane(obj);
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

	this.loadObjScane = function(info){
		var loader = new THREE.OBJLoader();
		var mtlLoader = new THREE.MTLLoader();
		var self = this;

		var materials = mtlLoader.parse( info.mtl);
		materials.preload();
		loader.setMaterials( materials );

		var object = loader.parse( info.obj);
		// console.log(object.position)

		var box = new THREE.Box3().setFromObject(object);
		// console.log('box', box);
		this.allBoxObj.push(box)
		object.castShadow = true;
		// this.obj_data.castShadow = true;
		object.castShadow = true;
		this.obj_data.add( object );
		this.preloadClose();
		this.updateCenterObj()
	};
	this.updateCenterObj = function(){
		var arr = this.allBoxObj
		// console.log(arr)
		
		var min = arr[0].min;
		var max = arr[0].max;

		if(arr.length > 1){
			for(var i = 1; i < arr.length; i++){
				min.x = Math.min(min.x,  arr[i].min.x);
				min.y = Math.min(min.y,  arr[i].min.y);
				min.z = Math.min(min.z,  arr[i].min.z);

				max.x = Math.max(max.x,  arr[i].max.x);
				max.y = Math.max(max.y,  arr[i].max.y);
				max.z = Math.max(max.z,  arr[i].max.z);
			}
		}
		this.obj_data.position.y = -(max.y - min.y)/2;

		// console.log(min, max)
		var dis_x = (min.x + max.x)/2;
		var dis_z = (min.z + max.z)/2;
		this.obj_plane.position.y = min.y + this.obj_data.position.y;
		this.obj_plane.position.x = -dis_x;
		this.obj_plane.position.z = -dis_z;
		console.log(this.obj_plane.position)
	};
	this.removePrevData = function(){
		var group = this.obj_data;
		for (var i = group.children.length - 1; i >= 0; i--) {
			// scene.remove(group.children[i]);
			group.remove(group.children[i]);
		}
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
		// renderer.shadowMap = true;
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFShadowMap;
		container.appendChild( renderer.domElement );
		renderer.domElement.id = 'canvas';

		stats = new Stats();
		container.appendChild( stats.dom );

		camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
		camera.position.z = 100;

		scene = new THREE.Scene();
		// scene.add(new THREE.AmbientLight( 0xffffff, 0));//0.5
		light = new THREE.DirectionalLight( 0xffffff, 1 ); //0.5


		light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 10, 2500 ) );
		light.shadow.bias = 0.0001;
		light.shadow.mapSize.width = 2048;
		light.shadow.mapSize.height = 1024;
		// light.target.position.set(0.3, -0.7, 0.2);
		light.position.set(0, 100, 0);
		// light_1.position.set(300, 300, 300);
		// light_1.castShadow = true;
		// light_1.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 10, 2500 ) );
		// light_1.shadow.bias = 0.0001;
		// light_1.shadow.mapSize.width = 2048;
		// light_1.shadow.mapSize.height = 1024;


// 		shadowMapViewer = new THREE.ShadowMapViewer( light );  
// shadowMapViewer.position.x = 10;
// shadowMapViewer.position.y = 10;
// shadowMapViewer.size.width = 2048 / 4;
// shadowMapViewer.size.height = 1024 / 4;
// shadowMapViewer.update();

//Note: this goes inside render loop
// shadowMapViewer.render(renderer);

		// scene.add(light);
		scene.add(light);

		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.addEventListener( 'change', this.render.bind(this) ); // remove when using animation loop
		// controls.maxPolarAngle = Math.PI/2 // - Math.PI/20;
		controls.noPan = true;

		window.addEventListener('resize', self.onWindowResize.bind(self));

		this.createEnvironment();
		this.preloadClose()

		this.animate();
	};

	this.createEnvironment = function(){
		console.log("createEnvironment")
		var obj = new THREE.Object3D();
		scene.add(obj);
		obj.receiveShadow = true;
		// this.obj_plane = obj;
		var size = 500,
		segments = 60;

		var geometry = new THREE.PlaneGeometry( size, size, segments, segments );
		var materials = [
			new THREE.MeshLambertMaterial( { opacity:0.6,
				color: 0x44ff44,transparent:true } ),
			new THREE.MeshBasicMaterial( { color: 0x808080,
				wireframe: true } )
		];
		var plane = THREE.SceneUtils.createMultiMaterialObject(geometry,materials);

		plane.rotation.x = -Math.PI/2;
		plane.receiveShadow = true

		// obj.add( plane );
		// this.obj_data = new THREE.Object3D();
		this.obj_plane = plane//obj;
		scene.add( plane );
		this.obj_data = new THREE.Object3D();
		// this.obj_data.castShadow = true
		plane.receiveShadow = true;
		this.obj_data.castShadow = true;
		scene.add(this.obj_data);
	};
	this.createBtn = function(){
		var par = this.parent;
		var cont_btn = createElem('div', par, 'navigation');

		var cont_top = createElem('div', cont_btn, 'cont_btn_top');
		var cont_bottom = createElem('div', cont_btn, 'cont_btn_bottom'); 

		var btn_top = createElem('div', cont_top, 'nav top');

		var btn_left = createElem('div', cont_bottom, 'nav left');
		var btn_bottom = createElem('div', cont_bottom, 'nav bottom');
		var btn_right = createElem('div', cont_bottom, 'nav right');
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
		stats.update();
		controls.update();

		self.render();
		requestAnimationFrame( self.animate );
	};
	this.render = function() {
		renderer.clear();
		renderer.render(scene, camera)
	};

	this.init(parent);
}