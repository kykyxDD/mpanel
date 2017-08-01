function ShapeSize (argument) {
	

	var scripts = [];
	var styles = [
		'./style/shape_size.css'
	];
	var min_edge = 3;
	var max_edge = 6;
	this.item_num = min_edge ;
	var lang = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	this.init = function(){
		var par = document.querySelector('.body .cont');

		par.classList.add('page_shape');
		var elem_title = document.querySelector('.body .title .cont_left_btn')
		var btn_help = elem_title.querySelector('.btn_help');


		this.createBtnHead(elem_title, btn_help);


		var cont_info = dom.div('cont_info', par);

		var left_path = dom.div('left_path', cont_info);
		var right_path = dom.div('right_path', cont_info);

		this.createInfoLeft(left_path);
		this.createInfoRight(right_path);
		
	}

	this.createInfoLeft = function(left_path){
		var cont_text_hind = dom.div('cont_text_hind', left_path);
		var cont_checkbox = dom.div('cont_check', cont_text_hind);

		var input_tension = dom.input('checkbox', 'tension', cont_checkbox);
		console.log('input_tension',input_tension)
		input_tension.checked = true;
		input_tension.id = 'tension';

		var label_tension = dom.elem('label', 'tension', cont_checkbox);
		console.log('label_tension',label_tension);
		label_tension.setAttribute('for', 'tension');

		var text_tension = dom.div('txt_tension', cont_text_hind);
		dom.text(text_tension, 'Same tension on all edges (required if continuous cable)')
		var btn_help = dom.div('btn_help', cont_text_hind);
		dom.text(btn_help, '?')

		var cont_figure_tension = dom.div('cont_figure', left_path);
		this.cont_figure_tension = cont_figure_tension;


		this.createCount(left_path)
	};

	this.createInfoRight = function(right_path){
		var num_edge = 3;

		var cont_sides = dom.div('cont_sides', right_path);
		var title = dom.div('title_cont', cont_sides);
		dom.text(title, 'sides');

		var title_hind = dom.div('btn_help', title)
		dom.text(title_hind, '?');

		var cont_table_sides = dom.div('cont_table_sides', cont_sides);
		var table_sides = dom.elem('table', 'table_sides', cont_table_sides);
		var thead_sides = dom.elem('thead', 'thead_sides', table_sides);
		var tbody_sides = dom.elem('tbody', 'tbody_sides', table_sides);
		this.tbody_sides = tbody_sides;

		var tr_head_sides = dom.elem('tr', '', thead_sides);
		var arr_sides = [{
			'text':'Side',
			'id': 'side'
		}, {
			'text':'Measurement',
			'id': 'measurement'
		}, {
			'text':'Type',
			'id': 'type'
		}, {
			'text':'Dip/ Span %',
			'id': 'dip'
		}, {
			'text':'Fixed',
			'id': 'fixed'
		}, {
			'text':'Mid support',
			'id': 'mid'
		}];

		for(var i = 0; i < arr_sides.length; i++){
			var td = dom.elem('td' , arr_sides[i].id, tr_head_sides);

			if(arr_sides[i].id == 'dip'){
				var text = dom.div('txt', td);
				dom.text(text, arr_sides[i].text)
				var cont_hint = dom.div('cont_btn_help', td);
				var hint = dom.div('btn_help', cont_hint)
				dom.text(hint, '?')
			} else {
				dom.text(td, arr_sides[i].text);
			}
		}


		var cont_corners = dom.div('cont_corners', right_path);
		var title = dom.div('title_cont', cont_corners);
		dom.text(title, 'corners');

		var cont_table_corners = dom.div('cont_table_corners', cont_corners);
		var table_corners = dom.elem('table', 'table_corners', cont_table_corners);
		var thead_corners = dom.elem('thead', 'thead_corners', table_corners);
		var tbody_corners = dom.elem('tbody', 'tbody_corners', table_corners);
		this.tbody_corners = tbody_corners;

		var tr_head_corners = dom.elem('tr', '', thead_corners);
		var arr_corners = [{
			'text':'Corner',
			'id': 'corner'
		}, {
			'text':'Height',
			'id': 'height'
		}, {
			'text':'Finish',
			'id': 'finish'
		}, {
			'text':'Link',
			'id': 'link'
		}, {
			'text':'Link Length',
			'id': 'length'
		}];

		for(var i = 0; i < arr_corners.length; i++){
			var td = dom.elem('td' , arr_corners[i].id, tr_head_corners);
			dom.text(td, arr_corners[i].text);
		}

		this.createNewInfo();

	};

	this.createNewInfo = function(){

		this.remPrevInfo();
		var num = this.item_num;

		dom.addclass(this.cont_figure_tension, 't_'+num)

		this.createSides(num);
		this.createCorners(num);

	};
	this.remPrevInfo = function(){
		var tbody_sides = this.tbody_sides;

		while(tbody_sides.children.length){
			tbody_sides.removeChild(tbody_sides.children[0])
		}
		var tbody_corners = this.tbody_corners;

		while(tbody_corners.children.length){
			tbody_corners.removeChild(tbody_corners.children[0])
		}
	};

	this.createSides = function(num){
		var tbody_sides = this.tbody_sides;
		var alf = lang.substr(0, num).split("");
		// console.log(alf)
		for(var i = 0; i < num; i++){
			var arr_txt = [alf[i] , alf[(i+1)%num]];
			var txt = arr_txt.join('-');
			var id = arr_txt.join('_').toLowerCase();

			var tr = dom.elem('tr', '', tbody_sides);

			var td_side = dom.elem('td', 'td_side', tr);
			dom.text(td_side, txt);
			var td_meas = dom.elem('td', 'td_meas', tr);
			var cont_input_meas = dom.div('cont_meas', td_meas);
			var input_meas = dom.input('text', 'input_meas', cont_input_meas);
			var cont_val_red = dom.div('val_red', td_meas);
			dom.text(cont_val_red, 'mm')

			var td_type = dom.elem('td', 'td_type', tr);
			dom.text(td_type, 'Webbing');
			var td_dip = dom.elem('td', 'td_dip', tr);
			var input_dip = dom.input('text', 'dip_'+id, td_dip)

			var td_fixed = dom.elem('td', 'td_fixed', tr);
			var cont_check_fixed = dom.div('cont_check', td_fixed) ;
			var input_fixed = dom.input('checkbox', 'fixed', cont_check_fixed);

			var label_fixed = dom.elem('label', '', cont_check_fixed);
			
			input_fixed.id= "fixed_"+id;
			label_fixed.setAttribute('for', "fixed_"+id)

			var td_mid = dom.elem('td', 'td_mid', tr);
			var cont_check_mid = dom.div('cont_check', td_mid) ;
			var input_mid = dom.input('checkbox', 'mid', cont_check_mid);
			var label_mid = dom.elem('label', '', cont_check_mid);
			input_mid.id= "mid_"+id;
			label_mid.setAttribute('for', "mid_"+id)
		}
	};
	this.createCorners = function(num){
		var tbody_corners = this.tbody_corners;
		var alf = lang.substr(0, num).split("");
		// console.log(alf)

		for(var i = 0; i < num; i++){
			var txt = alf[i]
			var tr = dom.elem('tr', '', tbody_corners);
			
			var td_corner = dom.elem('td', 'td_corner', tr);
			dom.text(td_corner, txt);

			var td_height = dom.elem('td', 'td_height', tr);
			var div_h_val = dom.div('div_h_val', td_height)
			var div_h_red = dom.div('div_h_red', td_height)
			dom.text(div_h_red, 'mm')

			var td_finish = dom.elem('td', 'td_finish', tr);
			dom.text(td_finish, 'D Ring');

			var td_link = dom.elem('td', 'td_link', tr)
			dom.text(td_link, 'SHACKLE');

			var td_length = dom.elem('td', 'td_length', tr)
			dom.text(td_length, '100');
		}
	};

	this.createCount = function(left_path){
		var cont = dom.div('cont_count', left_path);
		var title = dom.div('text', cont);
		dom.text(title, 'number of sides')

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
			dom.remclass(this.cont_figure_tension, 't_'+this.item_num)
			this.item_num = new_num
			dom.text(this.elem_val_num, this.item_num)
			this.createNewInfo()
		}


	};
	this.plusNum = function(){
		var new_num = this.item_num+1;
		if(new_num <= max_edge ){
			dom.remclass(this.cont_figure_tension, 't_'+this.item_num)
			this.item_num = new_num
			dom.text(this.elem_val_num, this.item_num)
			this.createNewInfo()
		}
	};

	this.createBtnHead = function(parent, btn_help){
		var load_example = dom.div('my_btn load_exam');
		dom.text(load_example, 'Load example');
		parent.insertBefore(load_example, btn_help);

		dom.on('click', load_example, this.loadExample.bind(this));

		var reset = dom.div('my_btn reset disable');
		dom.text(reset, 'Reset');
		parent.insertBefore(reset, btn_help);
		dom.on('click', reset, this.resetData.bind(this));
	}
	this.loadExample = function(){
		console.log('loadExample')

	};
	this.resetData = function(){
		console.log('resetData')

	};

	loadAllFiles(scripts, styles, this.init.bind(this));

}