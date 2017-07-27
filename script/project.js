function Project(){
	var par = document.querySelector('.body .cont');

	par.classList.add('page_project');
	var scripts = [];
	var styles = [
		'./style/project.css'
	]
	


	this.init = function(){
		this.units = main.units
		main.createBtnSetting();
		var cont_info = createElem('form', 'cont_info', par);
		var cont_input = createElem('div', 'cont_form', cont_info) 
		var left_path = createElem('div', 'left_path', cont_input);
		var right_path = createElem('div', 'right_path', cont_input);
		var elem_client = this.createInputVal('client', 'client');
		left_path.appendChild(elem_client);

		var elem_project = this.createInputVal('project name', 'project');
		left_path.appendChild(elem_project);

		var cont_list_input = createElem('div', 'cont_list_input', left_path);

		var elem_quantity = this.createInputVal('quantity required', 'quantity');
		cont_list_input.appendChild(elem_quantity);

		var elem_required = this.createInputVal('date required', 'date_required')
		cont_list_input.appendChild(elem_required);


		var elem = createElem('div', 'cont_val_input sail');
		var title = createElem('div', 'txt', elem);
		title.innerHTML = 'sail number';

		var cont_list_val = createElem('div', 'cont_list_val', elem)
		var cont_input_val = createElem('div', 'cont_input', cont_list_val);
		var input = createElem('input', false, cont_input_val);
		input.type = 'text';
		input.name = 'sail_if';
		input.value = 1;

		var div_span = createElem('div', 'text', cont_list_val)
		div_span.innerHTML = 'of';
		var cont_input_val_1 = createElem('div', 'cont_input', cont_list_val);
		var input_0 = createElem('input', false, cont_input_val_1);
		input_0.type = 'text';
		input_0.name = 'sail_of';
		input_0.value = 1

		cont_list_input.appendChild(elem);

		var elem_project_num = this.createInputVal('project number', 'proj_num');
		right_path.appendChild(elem_project_num);


		var elem_date_entered = this.createInputVal('date entered', 'date_entered');
		right_path.appendChild(elem_date_entered);

		var elem_entered = this.createInputVal('entered by', 'entered_by');
		right_path.appendChild(elem_entered);

		var cont_form_bottom = createElem('div', 'cont_form_bottom', cont_info) 

		var elem_textarea = createElem('div', 'cont_val_textarea desc')
		var title = createElem('div', 'txt', elem_textarea);
		title.innerHTML = 'description';
		var cont_textarea = createElem('div', 'cont_textarea', elem_textarea);
		var textarea = createElem('textarea', false, cont_textarea);
		textarea.name = 'description';
		cont_form_bottom.appendChild(elem_textarea);

		var cont_units = createElem('div', 'cont_units', cont_form_bottom)
		var select = createElem('select', 'select_units', cont_units)
		select.id = 'select_units';

		for(var key in this.units) {
			var elem = createElem('option', key, select)
			elem.value = key
			elem.innerHTML = this.units[key];
		}


		$("select").selectBoxIt();
	}
	this.createInputVal = function(text, name){
		var elem = createElem('div', 'cont_val_input ' + name)
		var title = createElem('div', 'txt', elem);
		title.innerHTML = text;
		var cont_input = createElem('div', 'cont_input', elem);
		var input = createElem('input', false, cont_input);
		input.type = 'text';
		input.name = name;
		return elem
	}
	loadAllFiles(scripts, styles, this.init.bind(this));
}