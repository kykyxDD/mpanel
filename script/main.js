function MpanelViewer(parent){
	
	var container;
	var preload;

	this.parent = parent;
	this.width = parent.offsetWidth,
	this.height = parent.offsetHeight
	var fov = 50, 
	 aspect = this.width/this.height, 
		orthoNear = -500,
		orthoFar = 1000,
	   near = 1,
		far = 1000;
	var camera, camera_1, scene, scene_1, renderer, controls, light, light_1, shadowMapViewer;
	var stats;
	var self = this;


	this.init = function(div){
		// this.preloadOpen();
		
		if(div) {
			container = div;
			preload = container.querySelector('.preload');
			if(!preload) {
				preload = document.createElement('div');
				preload.className = 'preload show';
				container.appendChild(preload);
			}
		}
		// this.preloadOpen();

		container.classList.add('threejs');
		this.createCanvas();
		this.createBtn()
	};

	this.createCanvas = function(){
		
		this.width = this.parent.offsetWidth,
		this.height = this.parent.offsetHeight
		
		aspect = this.width/this.height;
		
		renderer = new THREE.WebGLRenderer({antialias: true  });// antialias: true , preserveDrawingBuffer: true,, logarithmicDepthBuffer : true 
		renderer.domElement.style.backgroundColor = '#fff';
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

		camera = new THREE.CombinedCamera(this.width, this.height, fov, near, far, orthoNear, orthoFar )// ( fov, aspect, near, far );
		camera.position.z = 30;
		camera.zoom = 20

		camera_1 = new THREE.CombinedCamera(this.width, this.height, fov, near, far, orthoNear, orthoFar )// ( fov, aspect, near, far );
		camera_1.position.z = 30;

		scene = new THREE.Scene();
		scene_1 = new THREE.Scene();
		var light_0 = new THREE.AmbientLight( 0xffffff, 0.5);
		light_0.position.set(0, 1, 0)
		scene.add(light_0)
		// scene.add(new THREE.AmbientLight( 0xffffff, 0));//0.5
		


		// light.helper = new THREE.CameraHelper(light.shadow.camera)
		// light.helper.material.side = THREE.DoubleSide
		// scene.add(light.helper)


		

		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.addEventListener( 'change', this.render.bind(this) ); // remove when using animation loop
		controls.maxPolarAngle = Math.PI/2 // - Math.PI/20;
		controls.noPan = true;


		window.addEventListener('resize', self.onWindowResize.bind(self));

		this.createEnvironment();
		

		this.animate();

		light = new THREE.DirectionalLight( 0xffffff, 1); //0.5
		scene.add(light);
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

	/*this.loadObj = function(url, fabricexture){
		this.preloadOpen()
		var self = this;

		this.fabricexture = fabricexture ? fabricexture : false;

		var arr = [];
		var files = [];
		
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
	};*/
	this.loadObj = function(url_obj, url_img ){

		//this.preloadOpen();
		var self = this
		var loader_obj = new THREE.OBJLoader();

		if(url_img){
			var textureLoader = new THREE.TextureLoader();
			textureLoader.load(url_img, function(texture){
				// self.map_texture = texture;
				load_file_obj(texture)
			});
		} else {
			var mtlLoader = new THREE.MTLLoader();
			// mtlLoader.setPath('obj/male02/');
			var path = url_obj.split('/');
			var url_path = path.slice(0, path.length-1).join('/');
			// console.log('url_path', url_path)
			var file_name_obj = path[path.length-1];
			var name = file_name_obj.split('.');
			var file_name_mtl = name.slice(0, path.length-2).join('.') + '.mtl';
			var url_mtl = [url_path, file_name_mtl].join('/');


			mtlLoader.load(url_mtl, function(materials) {
				materials.preload();
				loader_obj.setMaterials(materials);
				load_file_obj()
			});
		}

		function load_file_obj(texture){
			loader_obj.load(url_obj, function(object){
				// console.log('obj:',object)
				self.createObj(object, texture);
			})
		}
		

	};


	this.createObj = function(object, texture){
		this.render()
		this.removePrevData();

		var box = new THREE.Box3().setFromObject(object);

		object.castShadow = true; 
		object.receiveShadow = true;
		object.traverse( function(child){
			if(child instanceof THREE.Mesh){

				if(texture && (child.name == 'membrane_top' || child.name == 'membrane_bottom') ){

					child.material.map = texture;
					child.material.map.wrapS = child.material.map.wrapT = THREE.RepeatWrapping; 
					child.material.map.repeat.set( 5, 4 );
					child.material.map.needsUpdate = true;
					child.material.needsUpdate = true;

				}
				child.castShadow = true;
				child.reciveShadow = true;
			}
		});
		this.obj_data.add( object );
		this.preloadClose();
		this.updateCenterObj(box, object)
	}
	/*this.getObjMtl = function(entries){
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
		this.arr_img_obj = [];
		self.res_obj = false
		entries.forEach(function(entry){
			// if(self.res_obj) return
			if(entry.filename.indexOf('.obj') > -1 ){
				var path = entry.filename.split('/');
				var name = path[path.length-1].split('.');
				var mtl = getMtl(name[0]);
				if(mtl){
					
					self.num_load_text++;
					entry.getData(new zip.TextWriter(), function(text_entry){
						mtl.getData(new zip.TextWriter(), function(text_mtl){

							var obj = {
								obj: text_entry,
								mtl: text_mtl,
								id: name[0]
							};
							if(!self.res_obj){
								self.item_obj = obj;
								self.loadObjScene(obj);
								
							}
							self.arr_obj.push(obj)
							
							self.res_obj = true
						});
					})

				}
			} else if(entry.filename.indexOf('.jpg') > -1 || entry.filename.indexOf('.png') > -1){

				entry.getData(new zip.BlobWriter(), function(blob){
					//var url = entry.filename
					var url = URL.createObjectURL(blob);
					console.log('url',url)
					var image = new Image();
					image.src = url;

					var obj_img = {
						img: image,
						file_name: entry.filename
					}
					self.arr_img_obj.push(obj_img)
					// console.log(self.arr_img_obj)
				})
				
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
	};*/

	this.switchObj = function(index){
		var obj = this.arr_obj[index];
		if(obj){
			this.clearObj(obj);
		}
	};
	
	this.clearObj = function(obj){
		// if(this.item_obj != obj){
			// this.preloadOpen()
			this.removePrevData();
			// this.loadObjScene(obj)
			// this.item_obj = obj;
		// }
	}

	this.loadObjScene = function(info){
		this.viewFront()
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
				// console.log('child',child)
				/*if(child.name == 'membrane_top'){
					console.log('membrane_top')
				} else if(child.name == 'membrane_bottom'){
					console.log('membrane_bottom')
				}*/
//self.fabricexture &&
				if(self.fabricexture && child.name == 'membrane_top' ){// || child.name == 'membrane_bottom'
					/*child.material.map = new THREE.TextureLoader.load( "./image/ShadeDesigner_Logo.jpg" ); 
					child.material.map.needsUpdate = true;*/
					/*var textureLoader = new THREE.TextureLoader();

        			textureLoader.load( "./image/ShadeDesigner_Logo.jpg" , function(texture){
        				child.material.map = texture;//new THREE.TextureLoader.load( "./image/ShadeDesigner_Logo.jpg" ); 
						child.material.map.needsUpdate = true;
        			})*/
					var texture = THREE.ImageUtils.loadTexture("./image/texture.jpg");
					child.material.color.setRGB(1,1,1)
					// console.log(child.material.transparent)

					child.material.map = texture;
					child.material.map.needsUpdate = true;
					child.material.needsUpdate = true;

				}
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
		root.position.x = -center.x;
		root.position.z = -center.z;

		//this.cube.position.x = box.width //center.x;
		//this.cube.position.z = box.height//center.z;

	};
	this.removePrevData = function(){
		var group = this.obj_data;
		for (var i = group.children.length - 1; i >= 0; i--) {
			// scene.remove(group.children[i]);
			group.remove(group.children[i]);
		}
	};



	this.skyBox = function(){
		var self = this
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
				self.preloadClose()
			};
			var mat = new THREE.MeshBasicMaterial({map: tex , side : THREE.BackSide});
			materials.push(mat);
		}
		var cubeGeo = new THREE.CubeGeometry(400,400,400,1,1,1);
		var cube = new THREE.Mesh(cubeGeo, new THREE.MeshFaceMaterial(materials));
		this.cube = cube

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
	var step_up = Math.PI/6;
	var step_left = Math.PI/4;

	this.rotateUp = function(index){
		scaleTween.stop();
		var top = index*step_up;
		scaleTween.target.up += top
		scaleTween.start()
	}
	this.rotateLeft = function(index){
		scaleTween.stop();
		var left = index*step_left;
		scaleTween.target.left += left
		scaleTween.start()
	}
	function valUpFrontObj(){
		var phi = controls.spherical.phi;
		var diff = Math.floor((  phi - controls.maxPolarAngle)/step_up);
		// console.log('diff',diff)
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
		var diff = Math.floor((phi - controls.minPolarAngle)/step_up);
		// console.log('diff',diff)
		return diff 

	}

	function valPerspectiveUpObj(){
		var phi = controls.spherical.phi;
		var diff = ((phi - (Math.PI/4) - controls.minPolarAngle)/step_up);
		return diff
	}
	function valPerspectiveLeftObj(){
		var theta = controls.spherical.theta;
		var delta = theta - Math.PI/4;		
		var diff = checkDelta(delta)/step_left;
		// console.log('diff',diff)
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


		/*if(camera_perspective){
			camera.toPerspective();
			camera_1.toPerspective();
		} else { 
			camera.toOrthographic();
			camera_1.toOrthographic();
		}*/

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

		var diff_up = valUpFrontObj()
		this.rotateUp(diff_up)
	};
	this.viewTop = function(){

		var diff = valUpTopObj()
		this.rotateUp(diff)

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
		
		var dist_up = scaleTween.source.up - self.rotate.up;
		var dist_left = scaleTween.source.left - self.rotate.left;
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
		this.width = parent.offsetWidth;
		this.height = parent.offsetHeight;

		camera.setSize(this.width, this.height);
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

		if(camera.inPerspectiveMode){
			camera_1.rotation.copy(camera.rotation);
			renderer.render(scene_1, camera_1)	
		}

		
		renderer.clearDepth();
		renderer.render(scene, camera)
	};

	this.init(parent);
}