function ShapeSize (argument) {
	

	var scripts = [];
	var styles = [
		'./style/shape_size.css'
	];
	var min_edge = 3;
	var max_edge = 6;
	this.item_num = min_edge ;

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


		this.createCount(left_path)
	};

	this.createInfoRight = function(right_path){
		var num_edge = 3;


	};

	this.createCount = function(left_path){
		var cont = dom.div('cont_count', left_path);
		var title = dom.div('text', cont);
		dom.text(title, 'number of sides')

		var cont_count = dom.div('elem_count', cont);

		var btn_minus = dom.div('btn_minus', cont_count);
		dom.on('click', btn_minus, this.minusNum.bind(this))
		// dom.text(btn_minus, '-')
		var val_num = dom.div('val_num', cont_count);
		dom.text(val_num, this.item_num)

		this.elem_val_num = val_num;
		var btn_plus = dom.div('btn_plus', cont_count);
		dom.on('click', btn_plus, this.plusNum.bind(this))
		// dom.text(btn_plus, '+')
	}

	this.minusNum = function(){
		var new_num = this.item_num-1;
		if(new_num >= min_edge ){
			this.item_num = new_num
			dom.text(this.elem_val_num, this.item_num)
		}


	};
	this.plusNum = function(){
		var new_num = this.item_num+1;
		if(new_num <= max_edge ){
			this.item_num = new_num
			dom.text(this.elem_val_num, this.item_num)
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