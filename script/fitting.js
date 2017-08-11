function Fittings (argument) {
	var par = document.querySelector('.body .cont');

	par.classList.add('page_fitting');
	var scripts = [];
	var styles = [
		'./style/fitting.css'
	];
	this.edge_type = [
		{ value: "Webbing", text: "Webbing" },
		{ value: "Wipe Rope", text: "Wipe Rope" },
		{ value: "Fixed edge", text: "Fixed edge" }
	];
	this.colour = [
		{ value: "Natural", text: "Natural" },
		{ value: "Gold", text: "Gold" }
	];
	this.finish = [
		{ value: "Loop", text: "Loop"},
		{ value: "D ring", text: "D ring"},
		{ value: "Nothing", text: "Nothing"}
	];
	this.corner_link = [
		{ value: "Shackle", text: "Shackle"},
		{ value: "Tumbuckle", text: "Tumbuckle"},
		{ value: "Guy", text: "Guy"}
	];

	this.text_hint_internal = 'This allowance will be added to both sides of each seam';
	this.text_hint_added = 'This wiil extend the post above the connection height for visualisation purposes only';

	var left_path,  right_path;

	this.init = function(){
		// main.createBtnSetting();

		var cont_info = createElem('div', 'cont_info', par);
		left_path = createElem('div', 'left_path', cont_info);
		
		right_path = createElem('div', 'right_path', cont_info);
		this.createLeftPath(left_path)
		
		this.createRightPath(right_path)
	}

	this.createLeftPath = function(par){
		var cont_layer_1 = dom.div('cont_layer layer_1', par)

		var cont_left_elem = dom.div('cont_color', cont_layer_1);
		var elem_color = dom.div('color', cont_left_elem);

		var cont_all_select = dom.div('cont_all_select', cont_layer_1);

		var cont_hardware = dom.div('cont_select cont_hardware', cont_all_select)
		var select_hardware = dom.elem('select', 'select_hardware', cont_hardware);

		this.select_hardware = $("select.select_hardware").selectBoxIt({
			defaultText: "HARDWARE DATA"
		});

		this.createSelHardware(this.edge_type);

		var cont_webbing = dom.div('cont_select cont_webbing', cont_all_select);
		var select_webbing = dom.elem('select', 'select_edge_type', cont_webbing);

		this.select_edge_type = $("select.select_edge_type").selectBoxIt({
			defaultText: "EDGE TYPE"
		});
		this.createSelEdgeType(this.edge_type);


		var cont_colour = dom.div('cont_select cont_colour', cont_all_select);
		var select_colour = dom.elem('select', 'select_colour', cont_colour);

		this.select_colour = $("select.select_colour").selectBoxIt({
			defaultText: "COLOUR"
		});
		this.createSelColour(this.colour);

		var input_hem = this.createElemInput(cont_all_select, 'hem', 'Hem (mm)')

		var cont_layer_2 = dom.div('cont_layer layer_2', par);
		var cont_view_corner = dom.div("cont_view_corner", cont_layer_2);

		var cont_img_corn = dom.div('cont_img_corn', cont_view_corner);
		var img_corn = dom.div('cont_img_corn', cont_img_corn);

		var cont_select_img = dom.div('cont_select cont_corner', cont_view_corner);
		var select_img = dom.elem('select', 'select_corner', cont_select_img);

		this.select_corner = $("select.select_corner").selectBoxIt({
			defaultText: "EXAMPLE CORNER IMAGE"
		});

		var cont_all_select_1 = dom.div('cont_all_select', cont_layer_2);

		var cont_finish = dom.div('cont_select cont_finish', cont_all_select_1);
		var select_finish = dom.elem('select', 'select_finish', cont_finish);

		this.select_finish = $("select.select_finish").selectBoxIt({
			defaultText: "CORNER FINISH"
		});
		this.createSelFinish(this.finish);

		var cont_info_hardware = dom.div('cont_info_hardware', cont_all_select_1);

		var cont_lenght = this.createElemInput(cont_info_hardware, 'lenght', 'Hardware lenght (mm)');
		var cont_width = this.createElemInput(cont_info_hardware, 'width', 'Hardware width (mm)');

		var cont_checkbox_circle = dom.div('cont_checkbox_circle', cont_info_hardware);
		var text = dom.div('txt', cont_checkbox_circle);
		dom.text(text, 'Fit hardware circle in corner');
		var cont_checkbox = dom.div('cont_check', cont_checkbox_circle);
		var input_checkbox = dom.input('checkbox', 'checkbox_circle', cont_checkbox);
		input_checkbox.id = 'checkbox_circle';
		input_checkbox.setAttribute('name', 'checkbox_circle');

		var label_circle = dom.elem('label', 'label_circle', cont_checkbox);
		label_circle.setAttribute('for', 'checkbox_circle');


		var cont_shackle = dom.div('cont_select cont_shackle', cont_all_select_1);
		var select_shackle = dom.elem('select', 'select_corner_link', cont_shackle);

		this.select_corner_link = $("select.select_corner_link").selectBoxIt({
			defaultText: "CORNER LINK"
		});
		this.createSelLink(this.corner_link);

		var input_link_lenght = this.createElemInput(cont_all_select_1, 'link', 'Link length(mm)');
	}

	this.createElemInput = function(par, name, txt){
		var cont = dom.div('cont_input cont_'+name,par);
		var text = dom.div('txt', cont);
		dom.text(text, txt);

		var cont_input = dom.div('cont_val', cont);
		var input = dom.input('text', 'input_'+name, cont_input);
		return {
			cont : cont,
			cont_input : cont_input,
			input: input
		}
	}

	this.createSelHardware = function(arr){
		if(!arr || !this.select_hardware) return
		var fun = this.select_hardware.data("selectBox-selectBoxIt");
		fun.remove();

		for(var i = 0; i < arr.length; i++){
			fun.add(arr[i])
		}
	}
	this.createSelEdgeType = function(arr){
		if(!arr || !this.select_edge_type) return
		var fun = this.select_edge_type.data("selectBox-selectBoxIt");
		fun.remove();

		for(var i = 0; i < arr.length; i++){
			fun.add(arr[i])
		}
	}

	this.createSelCorner = function(){
		if(arr || this.select) return
	};

	this.createSelFinish = function(arr){
		if(!arr || !this.select_finish) return 
		var fun = this.select_finish.data("selectBox-selectBoxIt");
		fun.remove();

		for(var i = 0; i < arr.length; i++){
			fun.add(arr[i])
		}
	}

	this.createSelColour = function(arr){
		if(!arr || !this.select_colour) return
		var fun = this.select_colour.data("selectBox-selectBoxIt");
		fun.remove();

		for(var i = 0; i < arr.length; i++){
			fun.add(arr[i])
		}
	}

	this.createSelLink = function(arr){
		if(!arr || !this.select_corner_link) return
		var fun = this.select_corner_link.data("selectBox-selectBoxIt");
		fun.remove();

		for(var i = 0; i < arr.length; i++){
			fun.add(arr[i])
		}
	}


	this.createRightPath = function(par){
		var cont_details = dom.div('cont_details', par);
		var title = dom.div('title_details', cont_details);

		dom.text(title, 'DETAILS');

		var cont_thread = this.createElemInput(cont_details, 'thread', 'Thread')
		var accessories = this.createElemInput(cont_details, 'accessories', 'Accessories')

		var internal = this.createElemInput(cont_details, 'internal', 'Internal seam width (mm)');

		var btn_help = main.createBtnHelp(internal.cont_input);
		var popup = main.hintHelp(btn_help, this.text_hint_internal)

		var reinfo = this.createElemInput(cont_details, 'reinfo', 'Corner reinforcement size (mm)');

		var diameter = this.createElemInput(cont_details, 'diameter', 'Pole diameter (mm)');
		var learn = this.createElemInput(cont_details, 'learn', 'Pole learn angle degress');
		var height = this.createElemInput(cont_details, 'height', 'Pole added height (mm)');

		var btn_help = main.createBtnHelp(height.cont_input);
		var popup = main.hintHelp(btn_help, this.text_hint_added)

	}
	
	loadAllFiles(scripts, styles, this.init.bind(this));
}