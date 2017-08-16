function Seams (argument) {
	var par = document.querySelector('.body .cont');
	this.text_pan = 'Blue lines are guidelines representing the fabric width in the selected warp direction - right click on these allows movement'
	var example_text = "<p>Site measument error involving A, B, E and F + 0.0%<br>Site measument error involving A, B, E and E + 0.0%<br><span class='text_green'>Built model: OK</span><br><span class='text_green'>First model relax: *OK residual 0,0001</span><br>Adjusting cable tensions<br><span class='text_green'>Second model relax: OK residual 0,0001</span><br></p><p>Shape checks:<br>Width-breadth squareness ratio: 150<br>(recommended between 0.66 and 2.250)<br>Diagonal ratio: 1.00 (recommended below 1.75)<br>Height ratio: 0.29 (recommended below 0.25)<br>Center offset ratio: 0.00 (recommended below 0.16)<br>Smallest corner angle: 60.81 (recommended below 10.00)<br>Largest corner angle: 99.93 (recommended below 160.00)</p><p><span class='text_green'>Updating internal models: OK</span><br><span class='text_green'>Making intial seams: OK</span><br><span class='text_green'>Updating seam models: OK</span><br><span class='text_green'>Updating internal images: OK</span></p>";

	par.classList.add('page_seams');
	var scripts = [
		"./libs/jquery_mCustomScrollbar.js"
	];
	var styles = [
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
		this.leftPath()
		this.rightPath()
	}
	this.leftPath = function(){
		var cont_view = dom.div('cont_view', left_path);
		var view = dom.div('view', cont_view);
		var cont_num_panels = dom.div('cont_num_panels', left_path)

		this.createCount(cont_num_panels)
	};
	this.rightPath = function(){
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
	};

	this.setTextResult = function(text){

		text = text ? text : example_text;

		var par = this.text_result;
		var cont_text = createElem('div', 'text', par)
		cont_text.innerHTML = text
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
	this.minusNum = function(e){

	};
	this.plusNum = function(e){

	};
	this.postNewInfo = function(){

	}
	loadAllFiles(scripts, styles, this.init.bind(this));
}