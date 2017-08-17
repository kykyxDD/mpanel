function Review(){
	var cont = document.querySelector('.main .body > .cont');
	var mpanel, url_img = './image/texture.jpg',	
		arr_url = [ 
		'./data/MPSD2.obj'
		,
		'./data/as2.obj'
		// './data/test2model.obj'
		//'http://192.168.0.137:1234/api/mp/modelLoad?fileName=c39b492a-a2e4-4b18-9b30-17bb7de73243_20170802213321_model_2.obj' 
		];
	var example_text = "<p>Site measument error involving A, B, E and F + 0.0%<br>Site measument error involving A, B, E and E + 0.0%<br><span class='text_green'>Built model: OK</span><br><span class='text_green'>First model relax: *OK residual 0,0001</span><br>Adjusting cable tensions<br><span class='text_green'>Second model relax: OK residual 0,0001</span><br></p><p>Shape checks:<br>Width-breadth squareness ratio: 150<br>(recommended between 0.66 and 2.250)<br>Diagonal ratio: 1.00 (recommended below 1.75)<br>Height ratio: 0.29 (recommended below 0.25)<br>Center offset ratio: 0.00 (recommended below 0.16)<br>Smallest corner angle: 60.81 (recommended below 10.00)<br>Largest corner angle: 99.93 (recommended below 160.00)</p><p><span class='text_green'>Updating internal models: OK</span><br><span class='text_green'>Making intial seams: OK</span><br><span class='text_green'>Updating seam models: OK</span><br><span class='text_green'>Updating internal images: OK</span></p>";

	this.text_hint = 'Orange comments are design advice and indicate that some elements of the design may be less than optimal - it does not prevent you progressing with the design.<br> Red warnings on the other hand, prevent progress and require that dimensions be checed in order to correct.'

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
		"./libs/CombinedCamera.js",
		"./libs/jquery_mCustomScrollbar.js"
	];
	var styles = [
		'./style/libs/jquery.mCustomScrollbar.css',
		'./style/review.css',
		'./style/graphics.css'
	];

	this.resizeH = false;

	this.init = function(){

		this.folder = 'api/mp/modelLoad?fileName=';
		//this.preload = createElem('div', 'preload', cont)
		main.createPreload();
		main.showPreload();

		var id = main.getDataId();
		var url = main.host + dataUrl.calculate.post+id;
		
		var self = this;

		$.ajax({
			url: url,
			type: "POST",
			contentType: 'application/json',
			dataType: 'json',
			success: function(data){
				/*if(!data.error) {
					self.readyData(data.data)
				} else {
					main.errorTextPreload(data.error)
				}*/
				self.readyData(data)
			}, 
			error: function(e){
				main.errorTextPreload('Problem loading data!', e)
			}
		});
	}
	this.readyData = function(data){
		if(!data.error){
			this.data_obj = data.data;
			// console.log(data)
			arr_url[0] =  main.host + this.folder + this.data_obj.objModelName;

			window.localStorage.setItem('mpanel_obj', arr_url[0]);	
		} else {
			this.error_data = data.error
			arr_url = []
		}
		

		//this.preload.classList.add('hide');
		main.hidePreload()
		this.createInfo(cont);
		/*(function(pre){
			setTimeout(function(){
				cont.removeChild(pre)
			} , 500)
		})(this.preload);*/
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
		
		var h = h_cont - (h_btn ?  h_btn + 10 : 45 ) - 50;
		// console.log(h_head, h_bottom, h_title, h_btn)
		this.elem_view.style.height = Math.max(430, h) + 'px';
		if(mpanel){
			mpanel.onWindowResize()	
		}
		if(this.text_result && this.color_key){
			var h_1 = h_btn + Math.max(430, h) - this.color_key.clientHeight - 40;
			this.text_result.style.height = h_1 + 'px';
			if(this.iscroll){
				this.iscroll.refresh();
			}
		}
	}

	this.createInfoDesign = function(){
		// var cont_top = createElem('div', 'top_btn', this.info_text);

		var cont_text_result = dom.div('cont_result', this.info_text);
		this.text_result = cont_text_result;
		cont_text_result.id = 'content-3dtd';

		// this.eventTextResult()

		var cont_color_key = dom.div('cont_color_key', this.info_text);
		this.color_key = cont_color_key

		var title = dom.div('title_color_key', cont_color_key);
		title.innerHTML = 'color key';
		/*var btn_help_1 = createElem('div', 'btn_help', title)
		btn_help_1.innerHTML = '?';*/
		var btn_help_1 = main.createBtnHelp(title);

		var popup = main.hintHelp(btn_help_1, this.text_hint)

		this.setTextResult();

		var green_text = dom.div('text green', cont_color_key)
		green_text.innerHTML = '<span class="text_green">Green text:</span> Design prodress in OK'
		var orange_text = dom.div('text orange', cont_color_key)
		orange_text.innerHTML = '<span class="text_orange">Orange text:</span> Warnings about the design'
		var red_text = dom.div('text red', cont_color_key)
		red_text.innerHTML = '<span class="text_red">Red text:</span> A problem the prevent the design from completing'
	};
	this.eventTextResult = function(){
		var self = this;
		this.click_text_result = false
		this.text_result.addEventListener('mousedown', function(){
			self.click_text_result = true;
			if(self.iscroll){
				if(self.iscroll.event_scrollbar || !self.iscroll.moved){
					self.text_result.classList.add('scroll');
				}
			}

		});
		this.text_result.addEventListener('mousemove', function(){
			if(!self.click_text_result || !self.iscroll) return

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

		if(!this.error_data){
			mpanel.loadObj(arr_url[0]);
		}

		this.createBtnView();
		// this.createBtnScreen();
	};

	this.setTextResult = function(text){

		text = text ? text : example_text;

		var par = this.text_result;
		var cont_text = createElem('div', 'text', par)
		//cont_text.innerHTML = example_text + example_text+ example_text
		if(!this.error_data){

			var arr_text = this.data_obj.messages
			var arr_type = this.data_obj.messageTypes

			for(var i = 0; i < arr_text.length; i++){

				var class_name = ''
				if(arr_type[i] == 0){
					class_name = 'text_green'
				} else if(arr_type[i] == 1){
					class_name = 'text_orange'
				} else if(arr_type[i] == 2) {
					class_name = 'text_red'
				}
				var span = dom.elem('span', class_name, cont_text)
				dom.text(span, arr_text[i])
			}
		
			/*for(var i = 0; i < arr_text.length; i++){

				var class_name = ''
				if(arr_type[i] == 0){
					class_name = 'text_green'
				} else if(arr_type[i] == 1){
					class_name = 'text_orange'
				} else if(arr_type[i] == 2) {
					class_name = 'text_red'
				}
				var span = dom.elem('span', class_name, cont_text)
				dom.text(span, arr_text[i])
			}*/

			$.mCustomScrollbar.defaults.scrollButtons.enable=true; //enable scrolling buttons by default
			$.mCustomScrollbar.defaults.axis="y"; //enable 2 axis scrollbars by default
			$.mCustomScrollbar.defaults.scrollEasing = "easeInOut"
			$.mCustomScrollbar.defaults.scrollInertia = 300

			$("#content-3dtd").mCustomScrollbar({theme:"3d-thick-dark"});
					
			$(".all-themes-switch a").click(function(e){
				e.preventDefault();
				var $this=$(this),
					rel=$this.attr("rel"),
					el=$(".content");
				switch(rel){
					case "toggle-content":
						el.toggleClass("expanded-content");
						break;
				}
			});
		} else {
			var span = dom.elem('span', 'text_red error_data', cont_text)
			dom.text(span, this.error_data);
		}

		/*var scroll = new iScroll(par, {
			hScroll: false,
			hScrollbar: false,
			scrollbarClass: 'iscroll_bar'
		})

		this.iscroll = scroll;*/
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


		if(arr_url.length && arr_url.length > 1){

			var model_1 = createElem('div', 'my_btn model_1' , par) //document.querySelector('.model_1');
			model_1.innerHTML = '1';
			var model_2 = createElem('div', 'my_btn model_2' , par) //document.querySelector('.model_2');
			model_2.innerHTML = '2';

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
		}

		// var btn_help = createElem('div', 'btn_help', par);
		// btn_help.innerHTML = '?';



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