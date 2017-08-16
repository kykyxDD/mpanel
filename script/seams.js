function Seams (argument) {
	var par = document.querySelector('.body .cont');
	this.text_pan = 'Blue lines are guidelines representing the fabric width in the selected warp direction - right click on these allows movement'
	var example_text = "";//"<p>Site measument error involving A, B, E and F + 0.0%<br>Site measument error involving A, B, E and E + 0.0%<br><span class='text_green'>Built model: OK</span><br><span class='text_green'>First model relax: *OK residual 0,0001</span><br>Adjusting cable tensions<br><span class='text_green'>Second model relax: OK residual 0,0001</span><br></p><p>Shape checks:<br>Width-breadth squareness ratio: 150<br>(recommended between 0.66 and 2.250)<br>Diagonal ratio: 1.00 (recommended below 1.75)<br>Height ratio: 0.29 (recommended below 0.25)<br>Center offset ratio: 0.00 (recommended below 0.16)<br>Smallest corner angle: 60.81 (recommended below 10.00)<br>Largest corner angle: 99.93 (recommended below 160.00)</p><p><span class='text_green'>Updating internal models: OK</span><br><span class='text_green'>Making intial seams: OK</span><br><span class='text_green'>Updating seam models: OK</span><br><span class='text_green'>Updating internal images: OK</span></p>";
	var min_edge = 1;
	var max_edge = 12;
	var arr_url = [];
	var mpanel

	par.classList.add('page_seams');
	var scripts = [
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
		'./style/graphics.css',
		'./style/libs/jquery.mCustomScrollbar.css',
		'./style/seams.css'
	];
	this.item_num = 1
	var left_path, right_path;
	this.init = function(){
		var self = this;
		main.updateLinkBtnNext(this.postNewInfo.bind(this));

		var cont_info = createElem('form', 'cont_info', par);

		left_path = dom.div('left_path', cont_info);
		right_path = dom.div('right_path', cont_info);
		this.leftPath();
		this.rightPath();
	}
	this.leftPath = function(){
		var cont_view = dom.div('cont_view', left_path);
		this.cont_view = cont_view
		var cont_btn = dom.div('cont_top_btn', cont_view)
		var view = dom.div('view', cont_view);

		var cont_num_panels = dom.div('cont_num_panels', left_path);

		this.createCount(cont_num_panels);

		this.createBtnView(cont_btn);

		this.loadMpanelViewer(view);
	};
	this.rightPath = function(){
		var self = this
		var info = createElem('div', 'info', right_path);
		var info_text = createElem('div', 'info_text', info);
		var cont_text_result = dom.div('cont_result', info_text);
		this.text_result = cont_text_result;
		cont_text_result.id = 'content-3dtd';

		this.setTextResult();

		var cont_info_select = dom.div('cont_info_select', right_path);
		var cont_warp = dom.div('cont_select cont_warp', cont_info_select)
		var select_warp = createElem('select', 'select_warp', cont_warp);

		this.select_fabric = $("select.select_warp").selectBoxIt({
			defaultText: "WAPR DIRECTION"
		});

		var btn_help_1 = main.createBtnHelp(cont_info_select);
		var popup = main.hintHelp(btn_help_1, 'Warp is direction of fabric comming off the roll')

		var cont_straight = dom.div('cont_straight', right_path);
		// var cont_checkbox = dom.div('cont_checkbox', cont_straight);

		var cont_checkbox = dom.div('cont_check', cont_straight) ;
		var input_fixed = dom.input('checkbox', 'straight', cont_checkbox);
		// input_fixed.addEventListener('change', self.changeFixed.bind(self))

		var label_fixed = dom.elem('label', '', cont_checkbox);
		
		input_fixed.id= 'straight';
		label_fixed.setAttribute('for', 'straight');

		var text = dom.div('text', cont_straight);
		dom.text(text, 'Straighten Seams');

		var cont_info_select_1 = dom.div('cont_info_select', right_path);
		var cont_tag = dom.div('cont_select cont_tag', cont_info_select_1)
		var select_tag = createElem('select', 'select_tag', cont_tag);

		this.select_fabric = $("select.select_tag").selectBoxIt({
			defaultText: "CORNER TAG"
		});

		var cont_btn_make = dom.div('cont_btn_make', right_path);
		var btn_make = dom.div('my_btn grad_blue btn_make disabled', cont_btn_make);
		dom.text(btn_make, 'make panels');

		btn_make.addEventListener('click', self.makePanels.bind(self));


		
	};
	this.loadMpanelViewer = function(parent){
		var file_obj = window.localStorage.getItem('mpanel_obj');
		if(!file_obj) return
		arr_url[0] = file_obj;

		mpanel = new MpanelViewer(parent);
		mpanel.loadObj(arr_url[0])

		
		// this.createBtnScreen();
	};
	this.createBtnView = function(par){
		if(!par) return
		// var par = this.cont_btn_top;
		
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

	this.setTextResult = function(text){

		text = text ? text : example_text;

		var par = this.text_result;
		var cont_text = createElem('div', 'text', par);
		cont_text.innerHTML = text;
		//cont_text.innerHTML = example_text + example_text+ example_text

		// var arr_text = this.data_obj.messages
		// var arr_type = this.data_obj.messageTypes

		// for(var i = 0; i < arr_text.length; i++){

		// 	var class_name = ''
		// 	if(arr_type[i] == 0){
		// 		class_name = 'text_green'
		// 	} else if(arr_type[i] == 1){
		// 		class_name = 'text_orange'
		// 	} else if(arr_type[i] == 2) {
		// 		class_name = 'text_red'
		// 	}
		// 	var span = dom.elem('span', class_name, cont_text)
		// 	dom.text(span, arr_text[i])
		// }


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
	};
	
	this.createCount = function(par){
		var cont = dom.div('cont_count', par);
		var title = dom.div('text', cont);
		dom.text(title, 'number of panels')
		var btn_help = main.createBtnHelp(title);
		var popup = main.hintHelp(btn_help, this.text_pan)

		var cont_count = dom.div('elem_count', cont);

		var btn_minus = dom.div('btn_minus', cont_count);
		dom.on('click', btn_minus, this.minusNum.bind(this));
		var val_num = dom.div('val_num', cont_count);
		dom.text(val_num, this.item_num);

		this.elem_val_num = val_num;
		var btn_plus = dom.div('btn_plus', cont_count);
		dom.on('click', btn_plus, this.plusNum.bind(this));
	}
	this.minusNum = function(){
		var new_num = this.item_num-1;
		if(new_num >= min_edge ){
			this.updateNumPanel(new_num);
		}
	};
	this.plusNum = function(){
		var new_num = this.item_num+1;
		if(new_num <= max_edge ){
			this.updateNumPanel(new_num);
		}
	};
	this.updateNumPanel = function(new_num){
		this.item_num = new_num;
		dom.text(this.elem_val_num, new_num);
	};
	this.makePanels = function(){
		console.log('makePanels')
	}
	this.postNewInfo = function(){

	}
	loadAllFiles(scripts, styles, this.init.bind(this));
}