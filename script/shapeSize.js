function ShapeSize (argument) {
	

	var scripts = [];
	this.arr_sides = [];
	this.arr_diagonals = [];
	this.arr_corners = [];
	var styles = [
		'./style/shape_size.css'
	];
	var min_edge = 3;
	var max_edge = 6;
	this.item_num = min_edge ;
	var lang = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	this.obj_info = {};
	this.reset = false;
	this.list_error = {
		sides: {},
		corners: {},
		diag: {}

	};

	this.kod_error = {
		'<0': 1
	}

	this.init = function(){
		var self = this

		main.createPreload();
		main.showPreload();
		var par = document.querySelector('.body .cont');

		par.classList.add('page_shape');
		var elem_title = document.querySelector('.body .title .cont_left_btn');
		var btn_help = elem_title.querySelector('.btn_help');

		this.createBtnHead(elem_title, btn_help);

		var cont_info = dom.div('cont_info', par);

		var left_path = dom.div('left_path', cont_info);
		var right_path = dom.div('right_path', cont_info);

		this.createInfoLeft(left_path);
		this.createInfoRight(right_path);

		//loadDoc(main.host+url, this.loadObj.bind(this), this.errorObj.bind(this))
		var mpanel_id = main.getDataId();
		if(mpanel_id) {
			this.getDataObj(mpanel_id);
		} else {
			main.createDataId(this.getDataObj.bind(this))
			
		}

		this.addEventNextBtn()

		// window.onbeforeunload = function(e){
		// 	return self.postNewData();
		// }
	}
	this.addEventNextBtn = function(){
		var self = this;
		var btn_link_next = main.link_next;
		btn_link_next.removeAttribute('href');

		var btn_next = main.btn_next;
		console.log(btn_link_next, btn_next);

		btn_next.addEventListener('click', function(){
			self.postNewData();
		});
		var btn_menu = main.link_page['review']
		btn_menu.removeAttribute('href');
		// btn_menu.addEventListener('click', function(){
		// 	self.postNewData();
		// })
	}

	this.getNewData = function(){
		var data = {
			"sideCount": this.item_num,
			"loftingSelected": 0,
			"measureBetween": 0,
			"sideParameters": [],
			"cornerParameters": [],
			"diagonalParameters": []
		}
		var sides = [];
		var diagonals = [];
		var corners = [];

		for(var i = 0; i < this.arr_sides.length; i++){
			var itm = {};
			var side = this.arr_sides[i];

			itm.index = side.index;
			itm.name = side.name;

			var fun_dip = side.sel_dip.data("selectBox-selectBoxIt");
			var fun_type = side.sel_type.data("selectBox-selectBoxIt");
			var val = side.elem_meas.value;

			itm.pointToPointSize = val != '' ? parseFloat(val) : '';//parseFloat(side.elem_meas.value)
			itm.selectedHemType = fun_type.textArray[fun_type.currentIndex];
			itm.selectedDip = fun_dip.textArray[fun_dip.currentIndex];
			itm.isFixed = side.elem_fixed.checked;
			itm.isMidSupport = side.elem_mid.checked;
			sides[i] = itm;
		}

		for(var i = 0; i < this.arr_diagonals.length; i++){
			var itm = {};
			var diag = this.arr_diagonals[i];

			itm.index = diag.index;
			itm.name = diag.name;
			var val = diag.elem_meas.value
			itm.value = val != '' ? parseFloat(diag.elem_meas.value) : '';

			diagonals[i] = itm;
		}

		for(var i = 0; i < this.arr_corners.length;i++){
			var itm = {};
			var corn = this.arr_corners[i];

			itm.index = corn.index;
			itm.name = corn.name;
			var height = corn.elem_h.value;
			itm.height = height != '' ? parseFloat(corn.elem_h.value) : '';
			var linkLength = corn.elem_length.value;
			itm.linkLength = linkLength != '' ? parseFloat(corn.elem_length.value) : '';

			var fun_finish = corn.elem_finish.data("selectBox-selectBoxIt");
			var fun_link = corn.elem_link.data("selectBox-selectBoxIt");
			itm.selectedLink = fun_link.textArray[fun_link.currentIndex];
			itm.selectedHardware = fun_finish.textArray[fun_finish.currentIndex];

			corners[i] = itm;
		}

		data.sideParameters = sides
		data.cornerParameters = corners
		data.diagonalParameters = diagonals

		return data
	};

	this.postNewData = function(){

		main.loadDataPreload();
		var id = main.getDataId();
		var url = main.host + dataUrl.meas.post.commit+id
		var data = this.getNewData()

		var str_data = JSON.stringify(data);

		console.log("str_data", str_data)

		return $.ajax({
			url: url,
			type: "POST",
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(data),
			success: function(data){
				console.log('data', data)
				if(!data.error){
					//self.parseDataObj(data.data);
					console.log('update',true)

					window.localStorage.setItem('mpanel_id', data.data);
					main.updateTextPreload('Ready. A few seconds later, the page loads.');
					setTimeout(function(){
						window.location.href = '?page=review';	
					}, 3000);
				} else {
					console.log('update',false)
					
					//window.location.href = '?page=review';
					main.updateTextPreload('Problem loading data! ' + data.error );
					setTimeout(function(){
						window.location.href = '?page=review';	
					}, 3000);
				}
			}, 
			error: function(e){
				console.log('error', false,e);
			}
		});
	}

	this.postDataPolyNum = function(num){
		var id = main.getDataId();

		main.showPreload();

		var url = main.host + dataUrl.meas.post.newSide+id+'&polyNum='+num;
		var self = this;
		console.log(url)

		$.ajax({
			type: "GET",
			url: url,
			success: function(data){
				console.log('data', data)
				if(data.data){
					self.parseDataObj(data.data);
				} else {
					console.log('error')
					var text = data.error
					main.errorTextPreload(text)
				}
			}, 
			error: function(e){
				console.log('error',e)
				// if(e.statusText){
				// 	main.errorTextPreload('Problem loading data')
				// }
				main.errorTextPreload('Problem loading data!', e)
			}
		})

	}

	this.getDataObj = function(){
		var id = main.getDataId();
		console.log('id',id)
		var url = main.host + dataUrl.meas.get+id
		var self = this;
		if(!id) {
			console.log('error')
			return
		}

		$.ajax({
			type: "GET",
			url: url,
			success: function(data){
				console.log('data', data)
				if(data.data){
					self.parseDataObj(data.data);
				} else {
					console.log('error')
					var text = data.error || data.message
					main.errorTextPreload(text)
				}
			}, 
			error: function(e){
				console.log('error',e)
				main.errorTextPreload('Problem loading data!', e)
			}
		})
	}

	this.createInfoLeft = function(left_path){
		var cont_text_hind = dom.div('cont_text_hind', left_path);
		var cont_checkbox = dom.div('cont_check', cont_text_hind);

		var input_tension = dom.input('checkbox', 'tension', cont_checkbox);
		input_tension.checked = true;
		input_tension.id = 'tension';

		var label_tension = dom.elem('label', 'tension', cont_checkbox);
		label_tension.setAttribute('for', 'tension');

		var text_tension = dom.div('txt_tension', cont_text_hind);
		dom.text(text_tension, 'Same tension on all edges (required if continuous cable)')
		var btn_help = dom.div('btn_help', cont_text_hind);
		dom.text(btn_help, '?')

		var cont_figure_tension = dom.div('cont_figure', left_path);
		this.cont_figure_tension = cont_figure_tension;
		var self = this;

		input_tension.addEventListener('change', function(){
			self.checkTension(this.checked)
		})
		this.createCount(left_path)
	};
	this.checkTension = function(checked){
		console.log('checkTension', checked);

	};



	this.createInfoRight = function(right_path){
		var num_edge = 3;

		var cont_sides_diagonals = dom.div('cont_sides_diagonals',right_path )

		var cont_sides = dom.div('cont_sides', cont_sides_diagonals);
		var title = dom.div('title_cont', cont_sides);
		dom.text(title, 'sides');

		var title_hind = dom.div('btn_help', title)
		dom.text(title_hind, '?');

		var cont_table_sides = dom.div('cont_table_sides', cont_sides);
		var table_sides = dom.elem('table', 'table_info table_sides', cont_table_sides);
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
				dom.text(text, arr_sides[i].text);
				var cont_hint = dom.div('cont_btn_help', td);
				var hint = dom.div('btn_help', cont_hint);
				dom.text(hint, '?');
			} else {
				dom.text(td, arr_sides[i].text);
			}
		}

		var cont_diagonals = dom.div('cont_diagonals', cont_sides_diagonals);
		var title = dom.div('title_cont', cont_diagonals);
		dom.text(title, 'diagonals');
		this.cont_diagonals = cont_diagonals;

		var cont_table_diagonals = dom.div('cont_table_diagonals', cont_diagonals);
		var table_diagonals = dom.elem('table', 'table_info table_diagonals', cont_table_diagonals);
		var thead_diagonals = dom.elem('thead', 'thead_diagonals', table_diagonals);
		var tbody_diagonals = dom.elem('tbody', 'tbody_diagonals', table_diagonals);
		this.tbody_diagonals = tbody_diagonals;

		var tr_head_diagonals = dom.elem('tr', '', thead_diagonals);
		var arr_diagonals = [{
			'text' : 'Diagonal',
			'id': 'diagonal'
		}, {
			'text' : 'Measurement',
			'id': 'measurement'
		}];

		for(var i = 0; i < arr_diagonals.length; i++){
			var td = dom.elem('td' , arr_diagonals[i].id, tr_head_diagonals);
			dom.text(td, arr_diagonals[i].text);
		};

		var cont_corners = dom.div('cont_corners', right_path);
		var title = dom.div('title_cont', cont_corners);
		dom.text(title, 'corners');

		var cont_table_corners = dom.div('cont_table_corners', cont_corners);
		var table_corners = dom.elem('table', 'table_info table_corners', cont_table_corners);
		var thead_corners = dom.elem('thead', 'thead_corners', table_corners);
		var tbody_corners = dom.elem('tbody', 'tbody_corners', table_corners);
		this.cont_table_corners = cont_table_corners;
		this.tbody_corners = tbody_corners;

		var tr_head_corners = dom.elem('tr', '', thead_corners);
		var arr_corners = [
			{
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
			}
		];

		for(var i = 0; i < arr_corners.length; i++){
			var td = dom.elem('td' , arr_corners[i].id, tr_head_corners);
			dom.text(td, arr_corners[i].text);
		};

	};

	this.parseDataObj = function(data){

		dom.remclass(this.cont_figure_tension, 't_'+this.item_num);

		
		this.item_num = data.sideCount;

		this.data_obj = data
		this.createNewInfo();


		
	};

	this.createNewInfo = function(){

		this.remPrevInfo();
		var num = this.item_num;

		dom.text(this.elem_val_num, this.item_num);

		dom.addclass(this.cont_figure_tension, 't_'+num);

		this.list_error.sides = {};
		this.list_error.corners = {};
		this.list_error.diag = {};

		this.createSides(num);
		this.createDiagonals(num);
		this.createCorners(num);

		this.updateAllVal();
		this.checkError();

		main.hidePreload()

	};
	this.remPrevInfo = function(){
		var self = this
		var obj = {
			sides: [],
			diag: [],
			corners: []
		};
		for(var i = 0; i < this.arr_sides.length; i++ ){
			if(!obj.sides) obj.sides = {}
			var itm = this.arr_sides[i];
			this.arr_sides[i].elem_meas.removeEventListener('input', self.updateAllVal.bind(self));
			this.arr_sides[i].elem_meas.removeEventListener('change', self.checkSides.bind(self));
			var id = this.arr_sides[i].id;

			var fun_dip = itm.sel_dip.data("selectBox-selectBoxIt")
			var fun_type = itm.sel_type.data("selectBox-selectBoxIt")

			itm.pointToPointSize = itm.elem_meas.value;
			itm.selectedHemType = fun_type.currentIndex; //itm.sel_type[0].selectedIndex;
			itm.selectedDip = fun_dip.currentIndex; //itm.sel_dip[0].selectedIndex;

			itm.isFixed = itm.elem_fixed.checked;
			itm.isMidSupport = itm.elem_mid.checked;
			obj.sides[i] = itm;
			fun_dip.destroy();
			fun_type.destroy();
		}

		for(var i = 0; i < this.arr_diagonals.length; i++ ){
			if(!obj.diag) obj.diag = {}
			var itm = this.arr_diagonals[i];
			var id = itm.id;

			itm.elem_meas.removeEventListener('input', self.updateAllVal.bind(self));
			itm.elem_meas.removeEventListener('change', self.checkDiag.bind(self));
			itm.value = itm.elem_meas.value;
			obj.diag[i] = itm
		}

		for(var i = 0; i < this.arr_corners.length; i++ ){
			if(!obj.corners) obj.corners = {}
			var itm = this.arr_corners[i];
			var id = itm.id;
			itm.elem_h.removeEventListener('input', self.updateAllVal.bind(self));
			itm.elem_h.removeEventListener('change', self.checkCorners.bind(self));

			var fun_link = itm.elem_link.data("selectBox-selectBoxIt");
			var fun_finish = itm.elem_finish.data("selectBox-selectBoxIt");

			itm.height = itm.elem_h.value;
			itm.linkLength = itm.elem_length.value;
			itm.selectedLink = fun_link.currentIndex;
			itm.selectedHardware = fun_finish.currentIndex;

			obj.corners[i] = itm;

			fun_link.destroy();
			fun_finish.destroy();

			/*obj.corners[id] = {
				h: itm.elem_h.value,//itm.elem_h.innerText,
				finish: itm.elem_finish.innerText,
				link: itm.elem_link.innerText,
				length: itm.elem_length.innerText
			}*/
		}
		console.log(obj)

		var num_sides = this.arr_sides.length;
		if(num_sides > 0){
			if(this.reset){
				this.obj_info[num_sides] = obj;	
			} else if(this.obj_info[num_sides]) {
				this.obj_info[num_sides] = false
			}
		}
		
		console.log('obj_info',this.obj_info)

		var tbody_sides = this.tbody_sides;

		while(tbody_sides.children.length){
			tbody_sides.removeChild(tbody_sides.children[0]);
		}

		var tbody_diagonals = this.tbody_diagonals;

		while(tbody_diagonals.children.length){
			tbody_diagonals.removeChild(tbody_diagonals.children[0]);
		}
		//this.remCorners()
		var tbody_corners = this.tbody_corners;

		while(tbody_corners.children.length){
			tbody_corners.removeChild(tbody_corners.children[0]);
		}

	};
	this.checkError = function(){
		var all_list_error = this.list_error;
		var error = 0;
		var val_true = true
		var list_error = [];
		var val_und = true

		for(var key in all_list_error){
			var table = all_list_error[key]
			for(var val in table){
				if(parseFloat(table[val]) && table[val] >= 1){
					error++;
					list_error.push([val, table[val]])
					// val_und = false
				} else if(table[val] === true){
					
					// val_und = false
				}
				if((parseFloat(table[val]) && parseFloat(table[val]) >= 1) || 
					typeof table[val] === "undefined"){
					val_true = false;
				}
			}
		}
		if(val_true && !list_error.length) {
			dom.remclass(main.text_prompt, "hide")
			dom.addclass(main.text_prompt, "ok")
			dom.remclass(main.text_prompt, "error")
			dom.remclass(main.text_prompt, "itm")
			dom.remclass(main.text_prompt, "fill")
		} else {
			dom.remclass(main.text_prompt, "hide")
			dom.addclass(main.text_prompt, "error")
			if(error){
				dom.addclass(main.text_prompt, "itm")
				dom.remclass(main.text_prompt, "fill")
			} else {
				dom.addclass(main.text_prompt, "fill")
				dom.remclass(main.text_prompt, "itm")
			}
		}
	}
	this.remCorners = function(){
		var arr = this.arr_corners;
		for(var i = 0; i < arr.length; i++){
			dom.elem(arr[i].elem_h, '');
		}
	}

	this.createSides = function(num){
		this.arr_sides = [];
		var self = this;
		var tbody_sides = this.tbody_sides;
		var alf = lang.substr(0, num).split("");
		var prev_values = this.obj_info[num] && this.obj_info[num].sides;
		console.log(prev_values)
		var sides = prev_values ? prev_values : this.data_obj.sideParameters

		//for(var i = 0; i < num; i++){
		for(var i = 0; i < sides.length; i++){
			var itm = sides[i];
			var arr_txt = itm.name.split('-');//[alf[i] , alf[(i+1)%num]];
			var txt = itm.name//arr_txt.join('-');
			var id_obj = arr_txt.join('')
			var id = arr_txt.join('_').toLowerCase();

			var tr = dom.elem('tr', '', tbody_sides);

			var td_side = dom.elem('td', 'td_side', tr);
			dom.text(td_side, txt);
			var td_meas = dom.elem('td', 'td_meas td_input_red', tr);
			// var cont_input_meas = dom.div('cont_meas', td_meas);
			var input_meas = dom.input('text', 'input_meas', td_meas);
			input_meas.value = itm.pointToPointSize
			var label_meas = dom.elem('label', 'label', td_meas); //dom.input('text', 'input_meas', cont_input_meas);
			var cont_val_red = dom.div('val_red', td_meas);
			dom.text(cont_val_red, 'mm');

			input_meas.addEventListener('input', self.updateAllVal.bind(self));
			input_meas.addEventListener('change', self.checkSides.bind(self));
			input_meas.side = id_obj;
			if(i == 0) {
				input_meas.setAttribute('autofocus', true)
			}

			var td_type = dom.elem('td', 'td_type', tr);
			// dom.text(td_type, 'Webbing');

			var sel_type_id = 'side_sel_type_'+id_obj;
			var select_type = this.createSelType(sel_type_id, td_type);
			select_type.selectedIndex = itm.selectedHemType;
			var fun_select_type = this.createSelFun(sel_type_id);


			var td_dip = dom.elem('td', 'td_dip', tr);

			/*var input_dip = dom.input('text', 'dip_'+id, td_dip)
			var label_meas = dom.elem('label', 'label', td_dip)*/
			var sel_dip_id = 'side_sel_dip_'+id_obj;
			var select_dip = this.createSelDip(sel_dip_id, td_dip);
			select_dip.selectedIndex = itm.selectedDip;
			var fun_select_dip = this.createSelFun(sel_dip_id)

			// var select_dip = this.createSelDip(td_dip);

			var td_fixed = dom.elem('td', 'td_fixed', tr);
			var cont_check_fixed = dom.div('cont_check', td_fixed) ;
			var input_fixed = dom.input('checkbox', 'fixed', cont_check_fixed);
			input_fixed.checked = itm.isFixed;
			var label_fixed = dom.elem('label', '', cont_check_fixed);
			
			input_fixed.id= "fixed_"+id;
			label_fixed.setAttribute('for', "fixed_"+id)

			var td_mid = dom.elem('td', 'td_mid', tr);
			var cont_check_mid = dom.div('cont_check', td_mid) ;
			var input_mid = dom.input('checkbox', 'mid', cont_check_mid);
			var label_mid = dom.elem('label', '', cont_check_mid);
			input_mid.checked = itm.isMidSupport;
			input_mid.id= "mid_"+id;
			label_mid.setAttribute('for', "mid_"+id)


			this.list_error.sides[id_obj] = undefined;

			itm.id = id_obj
			itm.id_sides = arr_txt
			itm.elem_meas = input_meas
			itm.sel_type = fun_select_type
			itm.sel_dip = fun_select_dip
			itm.elem_fixed = input_fixed
			itm.elem_mid = input_mid

			this.arr_sides.push(itm);
			if(prev_values) {
				this.checkValSides(input_meas)
				//var obj_val = prev_values[id_obj]
				/*if(obj_val){
					input_meas.value = obj_val.meas;
					dom.text(td_type, obj_val.type);
					// input_dip.value = obj_val.dip;
					input_fixed.checked = obj_val.fixed;
					input_mid.checked = obj_val.mid;					
				}*/
			}
		}
	};
	this.createSelDip=function(id, par){
		var select = dom.elem('select', 'td_select select_dip', par);
		select.id = id;

		var list = this.data_obj.dipItems;
		for(var i = 0; i < list.length; i++){

			var opt = dom.elem('option', 'opt', select);
			opt.value = 'opt_'+i
			dom.text(opt, list[i]);
		}
		return select
	};

	this.createSelType=function(id, par){
		var select = dom.elem('select', 'td_select select_type', par);
		select.id = id;

		var list = this.data_obj.hemItems;
		for(var i = 0; i < list.length; i++){

			var opt = dom.elem('option', 'opt', select);
			opt.value = 'opt_'+i
			dom.text(opt, list[i]);
		}
		return select
	};
	this.createSelLink=function(id, par){
		var select = dom.elem('select', 'td_select select_link', par);
		select.id = id;

		var list = this.data_obj.linkItems;
		for(var i = 0; i < list.length; i++){

			var opt = dom.elem('option', 'opt', select);
			opt.value = 'opt_'+i
			dom.text(opt, list[i]);
		}
		return select
	};
	this.createSelFinish=function(id, par){
		var select = dom.elem('select', 'td_select select_finish', par);
		select.id = id;

		var list = this.data_obj.hardwareItems;
		for(var i = 0; i < list.length; i++){

			var opt = dom.elem('option', 'opt', select);
			opt.value = 'opt_'+i
			dom.text(opt, list[i]);
		}
		return select
	};
	this.createSelFun = function(id){		
		return $("select#"+id).selectBoxIt({});
	}
	this.checkSides = function(e){

		var target = e.target || e.srcElement;

		this.checkValSides(target)

		this.checkError()

		// this.calcDiag();
	}
	this.checkValSides = function(elem){

		if(elem.value.substr(-1) == '.'){
			elem.value = parseFloat(elem.value).toFixed(1);
		}
		var label = elem.nextElementSibling;
		if(parseFloat(elem.value) < 0) {
			this.list_error.sides[elem.side] = this.kod_error['<0'];
			
			if(label && label.tagName.toLowerCase() == 'label'){
				dom.addclass(label, 'error');
			}
		} else {
			this.list_error.sides[elem.side] = true
			if(label && label.tagName.toLowerCase() == 'label'){
				dom.remclass(label, 'error');
			}
		}

		this.checkError()

		// this.calcDiag();
	}
	// this.checkVal
	this.checkCorners = function(e){

		var target = e.target || e.srcElement;

		this.checkValCorners(target)

		this.checkError();
	}
	this.checkValCorners = function(elem){

		if(elem.value.substr(-1) == '.'){
			elem.value = parseFloat(elem.value).toFixed(1);
		}
		var label = elem.nextElementSibling;
		if(parseFloat(elem.value) < 0) {
			this.list_error.corners[elem.side] = this.kod_error['<0'];
			
			if(label && label.tagName.toLowerCase() == 'label'){
				dom.addclass(label, 'error');
			}
		} else {
			this.list_error.corners[elem.side] = true
			if(label && label.tagName.toLowerCase() == 'label'){
				dom.remclass(label, 'error');
			}
		}
	}

	this.checkDiag = function(e){

		var target = e.target || e.srcElement;
		this.checkValDiag(target);
		this.checkError();
	}
	this.checkValDiag = function(elem){

		if(elem.value.substr(-1) == '.'){
			elem.value = parseFloat(elem.value).toFixed(1);
		}
		var label = elem.nextElementSibling;
		if(parseFloat(elem.value) < 0) {
			this.list_error.diag[elem.side] = this.kod_error['<0'];
			
			if(label && label.tagName.toLowerCase() == 'label'){
				dom.addclass(label, 'error');
			}
		} else {
			this.list_error.diag[elem.side] = true
			if(label && label.tagName.toLowerCase() == 'label'){
				dom.remclass(label, 'error');
			}
		}

		this.checkError();
	}

	this.updateAllVal = function(){
		console.log('updateAllVal')
		var arr_sides = this.arr_sides;
		var arr_corners = this.arr_corners;
		var arr_diag = this.arr_diagonals;
		var all_val = true
		var num_val = 0;

		for(var i = 0; i < arr_sides.length; i++){
			var itm = arr_sides[i];
			var side = arr_sides[i].elem_meas;
			var str_num = this.checkValNum(side.value)
			if((''+str_num) != arr_sides[i].elem_meas.value){
				arr_sides[i].elem_meas.value = str_num 	
			}
			// first + parseFloat(side.value)+last
			// var has_at = itm.elem_meas.hasAttribute('autofocus')
			// if(itm.elem_meas.hasAttribute('autofocus')){
			// 	itm.elem_meas.removeAttribute('autofocus')
			// }

			if(!isNaN(parseFloat(str_num))){
				num_val++;
			} else {
				all_val = false
			}

		}

		for(var i = 0; i < arr_diag.length; i++){
			var itm = arr_diag[i];
			var side = arr_diag[i].elem_meas;
			var str_num = this.checkValNum(side.value)

			if((''+str_num) != arr_diag[i].elem_meas.value){
				arr_diag[i].elem_meas.value = str_num 	
			}
			// arr_diag[i].elem_meas.value = str_num; // first + parseFloat(side.value)+last
			// if(itm.elem_meas.hasAttribute('autofocus')){
			// 	itm.elem_meas.removeAttribute('autofocus')
			// }

			if(!isNaN(parseFloat(str_num))){
				num_val++;
			} else {
				all_val = false
			}
		}

		this.validData()

		for(var i = 0; i < arr_corners.length; i++){
			var itm = arr_corners[i];
			var side = arr_corners[i].elem_h;
			var str_num = this.checkValNum(side.value)
			if((''+str_num) != arr_corners[i].elem_h.value){
				arr_corners[i].elem_h.value = str_num 	
			}
			// arr_corners[i].elem_h.value = str_num; 

		}

		this.reset = num_val > 0 ; 
		if(all_val){
			dom.remclass(this.cont_table_corners, 'disable');
		} else {
			dom.addclass(this.cont_table_corners, 'disable');
		}
		if(num_val){
			dom.remclass(this.btn_reset, 'disable');
		} else {
			dom.addclass(this.btn_reset, 'disable');
		}
	};

	this.validData = function(){
		return false
		if(this.item_num == 3){
			res = this.validateTriangle();
			// if(res){
			// 	buildTriangle(currentObject)
			// }
		}else if(this.item_num == 4){
			res = this.validateQuadrangle();
			// if(res){
			// 	buildQuadrangle(currentObject);
			// }
		}
		/*if(currentObject.length == 10){
			buildPentagone(currentObject);
		}
		if(currentObject.length == 11){
			buildHexagone(currentObject);
		}*/
	}
	this.buildTriangle = function(obj,selected){
		var AB = obj[0].val;
		var BC = obj[1].val;
		var CA = obj[2].val;

		var p1 = {x:0,y:0};
		var p2 = {x:AB,y:0};
		var p3 = getCoordinateBy2sides(AB,BC,CA);
		var points = [p1,p2,p3];
		rotatePoints(points, Math.PI/3);
		var bbox = getBoungingBox(points);
		resetPivot(points,bbox);
		//setSelection(obj,selected);
		var scale = getFitScale(bbox);
		calculateAngles(points);
		drawShape(points,scale, obj);

	//	x1 = 0;
	//	x2 = 0;
	//	y1 = -AB/2;
	//	y2 = AB/2;
	}
	this.checkValNum = function(str_num){
		return str_num.replace(/[^0-9.\-]/gi, '');
	}
	

	this.createDiagonals = function(num){
		var tbody_diagonals = this.tbody_diagonals;
		var alf = lang.substr(0, num).split("");
		var prev_values = this.obj_info[num] && this.obj_info[num].diag
		console.log(prev_values)

		this.arr_diagonals = [];
		// var diagonals = this.data_obj.diagonalParameters
		var diagonals = prev_values ? prev_values : this.data_obj.diagonalParameters
		if(!diagonals.length){
			dom.visible(this.cont_diagonals, false);
			return
		}

		dom.visible(this.cont_diagonals, true);
		var self = this;

		//for(var i = 0; i < num_diag; i++){
		for(var i = 0; i < diagonals.length; i++){
			// var arr_val = arr[i].val.split("");
			var itm = diagonals[i];
			var arr_val = itm.name.split("-")
			var txt = arr_val.join('');// arr[i].val;
			var tr = dom.elem('tr', '', tbody_diagonals);
			var id_obj = txt//arr[i].val

			var td_corner = dom.elem('td', 'td_diag', tr);
			dom.text(td_corner, itm.name);

			var td_meas = dom.elem('td', 'td_meas td_input_red', tr);
			// var div_m_val = dom.div('div_m_val', td_meas);

			var input_meas = dom.input('text', 'input_meas_diag', td_meas);
			var label_meas = dom.elem('label', 'label', td_meas)
			input_meas.addEventListener('input', self.updateAllVal.bind(self));
			input_meas.addEventListener('change', self.checkDiag.bind(self));
			input_meas.side = id_obj
			input_meas.value = itm.value;
			var div_m_red = dom.div('div_m_red val_red', td_meas);

			dom.text(div_m_red, 'mm');
			itm.id = id_obj;
			itm.elem_meas = input_meas;

			this.arr_diagonals.push(itm);

			this.list_error.diag[id_obj] = undefined;

			/*if(prev_values) {
				var obj_val = prev_values[id_obj]
				if(obj_val){
					input_meas.value = obj_val.meas;
				}
			}*/
		}
	};

	this.getDiagonal = function(values){
		return Math.sqrt((Math.pow(values[0], 2) + Math.pow(values[1], 2)))
	};

	/*this.calcDiag = function(){
		console.log('calcDiag');
		var arr_diag = this.arr_diagonals;
		var arr_sides = this.arr_sides;


		for(var i = 0; i < arr_diag.length; i++){
			var corners = arr_diag[i].corners[0];
			var diag = 0;
			console.log(arr_diag[i].id)
			if(arr_diag[i].corners) {
				var sides = this.putValForDiag(arr_diag[i].corners[0]);

				if(!sides.length && arr_diag[i].corners.length > 1){
					var other_sides = this.putValForDiag(arr_diag[i].corners[1])	
					console.log('side')
					if(other_sides.length){
						diag = this.getDiagonal(sides)
					}
				} else {
					console.log('sides' , sides)
					diag = this.getDiagonal(sides)
				}
				if(diag > 0){
					var num = diag%Math.floor(diag) > 0 ? diag.toFixed(1) : diag; 

					dom.text(arr_diag[i].elem_meas, num)
				} else {
					console.log('no diag')
				}
			

			}
		}
	};*/
	this.putValForDiag = function(sides){
		var res = [];
		var arr_sides = this.arr_sides; 
		for(var i = 0; i < arr_sides.length; i++ ){
			if(arr_sides[i].id == sides[0] || arr_sides[i].id == sides[1])  {
				res.push(parseFloat(arr_sides[i].elem_meas.value));
			}
		}
		return res
	};
	this.createCorners = function(num){
		var self = this

		dom.addclass(this.cont_table_corners, 'disable');

		this.arr_corners = [];
		var tbody_corners = this.tbody_corners;
		var alf = lang.substr(0, num).split("");
		var prev_values = this.obj_info[num] && this.obj_info[num].corners;
		console.log(prev_values)

		var corners = prev_values ? prev_values : this.data_obj.cornerParameters;

		//for(var i = 0; i < num; i++){
		for(var i = 0; i < corners.length; i++){
			var itm = corners[i];
			var txt = itm.name;
			var tr = dom.elem('tr', '', tbody_corners);
			
			var td_corner = dom.elem('td', 'td_corner', tr);
			dom.text(td_corner, txt);

			var td_height = dom.elem('td', 'td_height td_input_red', tr);
			// var div_h_val = dom.div('div_h_val', td_height)

			var input_h = dom.input('text', 'input_h', td_height);
			var label_h = dom.elem('label', 'label', td_height);
			input_h.value = itm.height;

			dom.on('input', input_h, this.updateAllVal.bind(this));
			dom.on('change', input_h, this.checkCorners.bind(this));
			input_h.side = txt;


			var div_h_red = dom.div('div_h_red val_red', td_height);
			dom.text(div_h_red, 'mm')

			var td_finish = dom.elem('td', 'td_finish', tr);
			var sel_finish_id = 'side_sel_finish_'+txt;
			var select_finish = this.createSelFinish(sel_finish_id, td_finish);
			select_finish.selectedIndex = itm.selectedHardware;
			var fun_select_finish = this.createSelFun(sel_finish_id)
			// dom.text(td_finish, 'D Ring');

			var td_link = dom.elem('td', 'td_link', tr)
			var sel_link_id = 'side_sel_link_'+txt;
			var select_link = this.createSelLink(sel_link_id, td_link);
			select_link.selectedIndex = itm.selectedLink;
			var fun_select_link = this.createSelFun(sel_link_id)


			var td_length = dom.elem('td', 'td_length td_input_red', tr);

			var input_l = dom.input('text', 'input_h', td_length);
			var label_l = dom.elem('label', 'label', td_length);
			input_l.value = itm.linkLength;

			itm.id = txt
			itm.elem_h = input_h
			itm.elem_finish = fun_select_finish
			itm.elem_link = fun_select_link
			itm.elem_length = input_l

			this.arr_corners.push(itm)

			/*this.arr_corners.push({
				id: txt, 
				elem_h: input_h,
				elem_finish: td_finish,
				elem_link: td_link,
				elem_length: td_length
			});*/
			this.list_error.corners[txt] = undefined;

			/*if(prev_values) {
				var obj_val = prev_values[txt]
				if(obj_val){
					//dom.text(div_h_val, obj_val.h)
					input_l.value = obj_val.h;
					dom.text(td_finish, obj_val.finish)
					dom.text(td_link, obj_val.link)
					dom.text(td_length, obj_val.length)
					this.checkValCorners(input_l)
				}
			}*/
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
			this.checkData(new_num);
		}
	};
	this.plusNum = function(){
		var new_num = this.item_num+1;
		if(new_num <= max_edge ){
			this.checkData(new_num);
		}
	};
	this.checkData = function(num){

		if(this.obj_info[num]){
			dom.remclass(this.cont_figure_tension, 't_'+this.item_num);
			this.item_num = num;
			this.createNewInfo();
		} else {
			this.postDataPolyNum(num)
		}
	}

	this.createBtnHead = function(parent, btn_help){
		var load_example = dom.div('my_btn load_exam');
		dom.text(load_example, 'Load example');
		parent.insertBefore(load_example, btn_help);

		dom.on('click', load_example, this.loadExample.bind(this));

		var reset = dom.div('my_btn reset disable grad_blue');
		dom.text(reset, 'Reset');
		parent.insertBefore(reset, btn_help);
		dom.on('click', reset, this.resetData.bind(this));
		this.btn_reset = reset;
	}
	this.loadExample = function(){
		console.log('loadExample')

	};
	this.resetData = function(){

		var arr_sides = this.arr_sides;
		for(var i = 0; i < arr_sides.length; i++){
			arr_sides[i].elem_meas.value = '';
		}

		var arr_corners = this.arr_corners;

		for(var i = 0; i < arr_corners.length; i++){
			dom.text(arr_corners[i].elem_h, '');
		}

		var arr_diag = this.arr_diagonals;
		for(var i = 0; i < arr_diag.length; i++) {
			arr_diag[i].elem_meas.value = '';
		}
		var arr_corners = this.arr_corners //arr_diagonals;
		for(var i = 0; i < arr_corners.length; i++) {
			arr_corners[i].elem_h.value = '';
		}
		dom.addclass(this.cont_table_corners, 'disable');

		dom.addclass(this.btn_reset, 'disable');

	};
	this.validateTriangle = function(obj){
		if(!obj) return false
		var AB = obj[0];
		var BC = obj[1];
		var CA = obj[2];

		var res = [];
		if(AB > BC+CA){
			res.push(["AB", "BC+CA"]);
		}
		if(BC > AB+CA){
			res.push(['BC', 'AB+CA']);
		}
		if(CA > AB+BC){
			res.push(['CA', 'AB+BC']);
		}
		return  res;
	}
	
	this.validateQuadrangle = function(obj){
		if(!obj) return false
		var res = true;
		var AB = obj[0];
		var BC = obj[1];
		var CD = obj[2];
		var DA = obj[3];

		var AC = obj[4];

		res =  validateTriangle([obj[4],obj[0],obj[1]]).concat(validateTriangle([obj[4],obj[2],obj[3]]));
		return res;
	}
	this.buildHexagone = function(obj){
		var AB = obj[0].val;
		var BC = obj[1].val;
		var CD = obj[2].val;
		var DE = obj[3].val;
		var EF = obj[4].val;
		var FA = obj[5].val;
		
		var diagAE = obj[6].val;
		var diagBD = obj[7].val;
		var diagBE = obj[8].val;
		
		var pA =  {x:0,y:0};
		var pB =  {x:AB,y:0};
		var pE = getCoordinateBy2sides(AB,diagBE,diagAE);
		
		var vAE = {x:pE.x - pA.x, y:pE.y - pA.y};
		var pF_ = getCoordinateBy2sides(diagAE,EF,FA);
		var pF = changeBasis(pF_ , pA, vAE);
		
		
		var vBE = {x:pB.x - pE.x, y:pB.y - pE.y};
		var pD_ =  getCoordinateBy2sides(diagBE,diagBD,DE);	
		var pD = changeBasis(pD_ , pE, vBE);
		
		
		var vBD = {x:pB.x - pD.x, y:pB.y - pD.y};
		var pC_ =  getCoordinateBy2sides(diagBD,BC,CD);	
		var pC =  changeBasis(pC_ , pD, vBD);
		
		
		
			
		var points = [pA,pB,pC,pD,pE,pF];
		
		//rotatePoints(points, Math.PI/5*4.5);
		var bbox = getBoungingBox(points);
		resetPivot(points,bbox);
		var scale = getFitScale(bbox);
		calculateAngles(points);
		drawShape(points,scale, obj);
		
	}

	this.buildPentagone = function(obj){
		var AB = obj[0].val;
		var BC = obj[1].val;
		var CD = obj[2].val;
		var DE = obj[3].val;
		var EA = obj[4].val;
		
		var diagAC = obj[5].val;
		var diagAB = obj[6].val;
		var pC = {x:0,y:0};
		var pD = {x:CD,y:0};
		var pA = getCoordinateBy2sides(CD,diagAB,diagAC);
		
		var vCA={x:pA.x - pC.x, y:pA.y - pC.y};
		
		var pB_ = getCoordinateBy2sides(diagAC,AB,BC);
		var pB = changeBasis(pB_ , pC, vCA);
		
		var vDA={x:-(pA.x - pD.x), y:-(pA.y - pD.y)};
		var pE_ = getCoordinateBy2sides(diagAC,DE,EA);
		var pE = changeBasis(pE_ , pA, vDA);
		
		
		var points = [pA,pB,pC,pD,pE];
		
		rotatePoints(points, Math.PI/5*4.5);
		var bbox = getBoungingBox(points);
		resetPivot(points,bbox);
		var scale = getFitScale(bbox);
		calculateAngles(points);
		drawShape(points,scale, obj);
	
	}
	
	this.buildQuadrangle = function(obj){
		var AB = obj[0].val;
		var BC = obj[1].val;
		var CD = obj[2].val;	
		var DA = obj[3].val;
	
		var diagAC = obj[4].val;
		
		var p1 = {x:0,y:0};
		var p2 = {x:diagAC,y:0};
		var p3 = getCoordinateBy2sides(diagAC,BC,AB);
		var p4 = getCoordinateBy2sides(diagAC,CD,DA);
		p3.y *=-1;
		var points = [p1,p3,p2,p4];
		
		rotatePoints(points, Math.PI/4);
		var bbox = getBoungingBox(points);
		resetPivot(points,bbox);
		var scale = getFitScale(bbox);
		calculateAngles(points);
		drawShape(points,scale, obj);
	}

	loadAllFiles(scripts, styles, this.init.bind(this));

}