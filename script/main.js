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
	var camera, scene, renderer, controls, light, light_1;
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
		this.preloadOpen()
		container.classList.add('threejs');
		this.createCanvas();
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
			console.log('child')
			this.removePrevData()
		}

		var self = this;
		this.num_load_text = 0;
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

		var box = new THREE.Box3().setFromObject(object);
		console.log('box', box)
		object.castShadow = true;
		this.obj_data.add( object );
		this.preloadClose();
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
		
		 aspect = this.width/this.height
		
		renderer = new THREE.WebGLRenderer({antialias: true  });// antialias: true , preserveDrawingBuffer: true,, logarithmicDepthBuffer : true 
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setClearColor(new THREE.Color(0xffffff));
		renderer.setSize( this.width, this.height );
		renderer.autoClear = false;
		renderer.shadowMapEnabled = true;
		container.appendChild( renderer.domElement );
		renderer.domElement.id = 'canvas';

		stats = new Stats();
		container.appendChild( stats.dom );

		camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
		camera.position.z = 100;

		scene = new THREE.Scene();
		// light = new THREE.AmbientLight( 0xffffff, 0.5 );
		light_1 = new THREE.DirectionalLight( 0xffffff, 1 ); //0.5
		light_1.target.position.set(0.3, -0.7, 0.2);
		light_1.castShadow = true;
		// scene.add(light);
		scene.add(light_1);

		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.addEventListener( 'change', this.render.bind(this) ); // remove when using animation loop

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

		var geometry = new THREE.PlaneGeometry( 200, 200, 30, 30 );
		var materials = [
			new THREE.MeshLambertMaterial( { opacity:0.6,
				color: 0x44ff44,transparent:true } ),
			new THREE.MeshBasicMaterial( { color: 0x000000,
				wireframe: true } )
		];
		var plane = THREE.SceneUtils.createMultiMaterialObject(geometry,materials);

		plane.rotation.x = -Math.PI/2;

		obj.add( plane );
		this.obj_data = new THREE.Object3D();
		scene.add(this.obj_data);
	};

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