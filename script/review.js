function Review(){
	var cont = document.querySelector('.main .body > .cont');
	var mpanel, url_img = './image/texture.jpg',	
		arr_url = [ 
		'./data/MPSD2.obj',
		'./data/as2.obj'
		//'http://192.168.0.137:1234/api/mp/modelLoad?fileName=c39b492a-a2e4-4b18-9b30-17bb7de73243_20170802213321_model_2.obj' 
		];
	var example_text = "<p>Site measument error involving A, B, E and F + 0.0%<br>Site measument error involving A, B, E and E + 0.0%<br><span class='text_green'>Built model: OK</span><br><span class='text_green'>First model relax: *OK residual 0,0001</span><br>Adjusting cable tensions<br><span class='text_green'>Second model relax: OK residual 0,0001</span><br></p><p>Shape checks:<br>Width-breadth squareness ratio: 150<br>(recommended between 0.66 and 2.250)<br>Diagonal ratio: 1.00 (recommended below 1.75)<br>Height ratio: 0.29 (recommended below 0.25)<br>Center offset ratio: 0.00 (recommended below 0.16)<br>Smallest corner angle: 60.81 (recommended below 10.00)<br>Largest corner angle: 99.93 (recommended below 160.00)</p><p><span class='text_green'>Updating internal models: OK</span><br><span class='text_green'>Making intial seams: OK</span><br><span class='text_green'>Updating seam models: OK</span><br><span class='text_green'>Updating internal images: OK</span></p>";

	var preload = createElem('div', 'preload', cont)

	var list_script = [];
	var scripts = [
		"./libs/zip.js",
		"./libs/zip-ext.js",
		"./libs/ga.js",
		"./libs/iscroll.js",
		"./script/mpanelViewer.js",
		"./libs/three.js",
		"./libs/MTLLoader.js",
		"./libs/OBJLoader.js",
		"./libs/OrbitControls.js",
		"./libs/tween.js",
		"./libs/CombinedCamera.js"
	];
	var styles = [
		'./style/review.css',
		'./style/graphics.css'
	];

	this.resizeH = false;

	this.init = function(){

		var url_obj = main.params && main.params.obj

		if(url_obj) {
			arr_url[1] = 'http://192.168.0.137:1234/api/mp/modelLoad?fileName='+url_obj;
		}

		preload.classList.add('hide');
		this.createInfo(cont);
		(function(preload){
			setTimeout(function(){
				cont.removeChild(preload)
			} , 500)
		})(preload);
	}


	this.createTitle = function(par) {
		var title = createElem('div', 'title', par)
		title.innerHTML = 'DESIGN REVIEW - VISUALISATION';

		var btn_help = createElem('div', 'btn_help', title);
		btn_help.innerHTML = 'Help'
	}
	this.createInfo = function(par) {
		
		var info = createElem('div', 'info', par);
		var info_text = createElem('div', 'info_text', info);
		this.info_text = info_text
		var graphics = createElem('div', 'graphics', info);
		this.graphics = graphics;

		this.cont_btn_top = createElem('div', 'cont_button top', graphics);
		var word = createElem('div', 'word', graphics);
		var parent = createElem('div', false, word)
		parent.id = 'parent';
		this.elem_view = parent;

		// this.cont_btn_bottom = createElem('div', 'cont_button bottom', graphics);
		this.createInfoDesign()
		var self = this;


		this.loadMpanelViewer(parent)
		if(this.resizeH){
			this.updateSizeView()
			window.addEventListener('resize', function(){
				self.updateSizeView();
			});
		}
		

	}
	this.updateSizeView = function(argument) {

		var all_h = document.documentElement.clientHeight;
		var h_head = document.querySelector('.header').clientHeight + 5;
		var h_bottom = document.querySelector('.footer').clientHeight ;
		var h_title = document.querySelector('.body .cont > .title').clientHeight;
		var h_btn = document.querySelector('.graphics .cont_button.top').clientHeight;
		var h_cont = all_h  - h_head - h_bottom - h_title
		
		var h = h_cont - (h_btn ?  h_btn + 10 : 45 ) - 50
		// console.log(h_head, h_bottom, h_title, h_btn)
		this.elem_view.style.height = Math.max(430, h) + 'px';
		if(mpanel){
			mpanel.onWindowResize()	
		}
		if(this.text_result && this.color_key){
			var h_1 = h_btn + Math.max(430, h) - this.color_key.clientHeight - 40;
			this.text_result.style.height = h_1 + 'px';
			this.iscroll.refresh()
		}
		
		
	}

	this.createInfoDesign = function(){
		// var cont_top = createElem('div', 'top_btn', this.info_text);

		var cont_text_result = createElem('div', 'cont_result', this.info_text);
		this.text_result = cont_text_result;

		this.eventTextResult()

		var cont_color_key = createElem('div', 'cont_color_key', this.info_text);
		this.color_key = cont_color_key

		var title = createElem('div', 'title_color_key', cont_color_key);
		title.innerHTML = 'color key';
		var btn_help_1 = createElem('div', 'btn_help', title)
		btn_help_1.innerHTML = '?';

		this.setTextResult();

		var green_text = createElem('div', 'text green', cont_color_key)
		green_text.innerHTML = '<span class="text_green">Green text:</span> Design prodress in OK'
		var orange_text = createElem('div', 'text orange', cont_color_key)
		orange_text.innerHTML = '<span class="text_orange">Orange text:</span> Warnings about the design'
		var red_text = createElem('div', 'text red', cont_color_key)
		red_text.innerHTML = '<span class="text_red">Red text:</span> A problem the prevent the design from completing'
	};
	this.eventTextResult = function(){
		var self = this;
		this.click_text_result = false
		this.text_result.addEventListener('mousedown', function(){
			self.click_text_result = true;
			if(self.iscroll.event_scrollbar || self.iscroll.moved){
				self.text_result.classList.add('scroll');
			}

		});
		this.text_result.addEventListener('mousemove', function(){
			if(!self.click_text_result) return
			if(self.iscroll.event_scrollbar || self.iscroll.animating){
				self.text_result.classList.add('scroll');
			}
		});

		this.text_result.addEventListener('mouseup', function(){
			self.text_result.classList.remove('scroll');
			self.click_text_result = false
		});
		window.addEventListener('mouseup', function(){
			self.text_result.classList.remove('scroll');
			self.click_text_result = false
		})
	};

	this.loadMpanelViewer = function(parent){
		mpanel = new MpanelViewer(parent);
		mpanel.loadObj(arr_url[0])

		this.createBtnView();
		// this.createBtnScreen();
	};

	this.setTextResult = function(text){

		text = text ? text : example_text;

		var par = this.text_result;
		var cont_text = createElem('div', 'text', par)
		cont_text.innerHTML = example_text + example_text+ example_text
		var scroll = new iScroll(par, {
			hScroll: false,
			hScrollbar: false,
			scrollbarClass: 'iscroll_bar'
		})

		this.iscroll = scroll;
	};

	this.createBtnView = function(par){
		var par = this.cont_btn_top;
		
		var btn_isometric = createElem('div', 'my_btn isometric' , par) //document.querySelector('.graphics .btn.isometric');
		btn_isometric.innerHTML = 'isometric';
		// var input_isometric = createElem('div', 'isometric'); // document.querySelector('.graphics .btn.isometric' , par) //document.getElementById('isometric'); // document.querySelector('.graphics .btn.isometric');
		var btn_right = createElem('div', 'my_btn right' , par) //document.querySelector('.graphics .btn.right');
		btn_right.innerHTML = 'right';
		var btn_front = createElem('div', 'my_btn front' , par) //document.querySelector('.graphics .btn.front');
		btn_front.innerHTML = 'front';
		var btn_top = createElem('div', ' my_btn top', par) //document.querySelector('.graphics .btn.top');
		btn_top.innerHTML = 'top';
		var model_1 = createElem('div', 'my_btn model_1' , par) //document.querySelector('.model_1');
		model_1.innerHTML = '1';
		var model_2 = createElem('div', 'my_btn model_2' , par) //document.querySelector('.model_2');
		model_2.innerHTML = '2';

		var btn_help = createElem('div', 'btn_help', par);
		btn_help.innerHTML = '?'

		model_1.classList.add('active');

		model_1.addEventListener('click', function(){
			if( model_1.classList.contains('active'))  return

			model_1.classList.add('active');
			model_2.classList.remove('active');
			mpanel.loadObj( arr_url[0] );
			
		});
		model_2.addEventListener('click', function(){
			if( model_2.classList.contains('active'))  return

			model_2.classList.add('active');
			model_1.classList.remove('active');
			mpanel.loadObj( arr_url[1], url_img );
			
		});

		btn_isometric.addEventListener('click', function(){
			mpanel.viewIsometric();
		});
		btn_right.addEventListener('click', function(){
			mpanel.viewRight();
		});
		btn_front.addEventListener('click', function(){
			mpanel.viewFront();
		});
		btn_top.addEventListener('click', function(){
			mpanel.viewTop();
		});


	};
	this.createBtnScreen = function(){
		var btn_sreen = createElem('div', 'my_btn screen grad_blue', this.cont_btn_bottom) //document.querySelector('.graphics .screen');
		btn_sreen.innerHTML = 'screen capture'

		btn_sreen.addEventListener('click', function(){
			mpanel.getScreen();
		});

		var btn_help = createElem('div', 'btn_help', this.cont_btn_bottom);
		btn_help.innerHTML = '?'
	};

	loadAllFiles(scripts, styles, this.init.bind(this));

}