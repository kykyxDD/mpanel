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
		var cont_input = dom.div('cont_form', cont_info) 
		var left_path = dom.div('left_path', cont_input);
		var right_path = dom.div('right_path', cont_input);
		var elem_client = this.createInputVal('client', 'client');
		left_path.appendChild(elem_client.elem);

		var elem_project = this.createInputVal('project name', 'project');
		left_path.appendChild(elem_project.elem);

		var cont_list_input = dom.div('cont_list_input', left_path);

		var elem_quantity = this.createInputVal('quantity required', 'quantity');
		cont_list_input.appendChild(elem_quantity.elem);

		var elem_required = this.createInputVal('date required', 'date_required')
		cont_list_input.appendChild(elem_required.elem);


		var elem = dom.div('cont_val_input sail');
		var title = dom.div('txt', elem);
		title.innerHTML = 'sail number';

		var cont_list_val = dom.div('cont_list_val', elem)
		var cont_input_val = dom.div('cont_input', cont_list_val);
		var input = createElem('input', false, cont_input_val);
		input.type = 'text';
		input.name = 'sail_if';
		input.value = 1;

		var div_span = dom.div('text', cont_list_val)
		div_span.innerHTML = 'of';
		var cont_input_val_1 = dom.div('cont_input', cont_list_val);
		var input_0 = createElem('input', false, cont_input_val_1);
		input_0.type = 'text';
		input_0.name = 'sail_of';
		input_0.value = 1

		cont_list_input.appendChild(elem);

		var elem_project_num = this.createInputVal('project number', 'proj_num');
		right_path.appendChild(elem_project_num.elem);


		var elem_date_entered = this.createInputVal('date entered', 'date_entered');
		right_path.appendChild(elem_date_entered.elem);

		var elem_entered = this.createInputVal('entered by', 'entered_by');
		right_path.appendChild(elem_entered.elem);

		var cont_form_bottom = dom.div('cont_form_bottom', cont_info) 

		var elem_textarea = dom.div('cont_val_textarea desc')
		var title = dom.div('txt', elem_textarea);
		title.innerHTML = 'description';
		var cont_textarea = dom.div('cont_textarea', elem_textarea);
		var textarea = createElem('textarea', false, cont_textarea);
		textarea.name = 'description';
		cont_form_bottom.appendChild(elem_textarea);

		var cont_units = dom.div('cont_units', cont_form_bottom)
		var select = createElem('select', 'select_units', cont_units)
		select.id = 'select_units';
		this.select_units = select

		// for(var key in this.units) {
		// 	var elem = createElem('option', key, select)
		// 	elem.value = key
		// 	elem.innerHTML = this.units[key];
		// }



		this.fun_units = $("select").selectBoxIt({
			defaultText: "units"
		});

		this.obj_elem = {
			clientName: elem_client.input,
			projectName: elem_project.input,
			projectNumber: elem_project_num.input,
			description: textarea, 
			enteredBy:elem_entered.input , 
			enteredDate: elem_date_entered.input, 
			quantity: elem_quantity.input , 
			requestDate: elem_required.input,//"2017-08-11T18:52:25.9516135+03:00",
			sailNumber:input ,
			sailOf:input_0 ,
			unit: this.fun_units
		}

		var id_project = main.getDataId();

		if(id_project){
			this.getInfoService(id_project)
		} else {

		}

	}
	this.getInfoService = function(id){
		var url = main.host + dataUrl.project.get+id;
		main.createPreload();
		main.showPreload();

		var self = this;

		$.ajax({
			url: url,
			type: "GET",
			contentType: 'application/json',
			dataType: 'json',
			success: function(data){
				if(!data.error) {
					self.setInfoProject(data.data)
				} else {
					main.errorTextPreload(data.error)
				}
			}, 
			error: function(e){
				main.errorTextPreload('Problem loading data!', e)
			}
		});
	};
	this.setInfoProject = function(data){
		this.obj_data = data;
		console.log('data', data)
		main.hidePreload()

		for(var key in data){
			var elem = this.obj_elem[key];
			if(elem){
				var tag = elem.tagName.toLowerCase();
				if(tag == 'input' || tag == 'input') {
					elem.value = data[key];
				}
			} else if(key == 'unitIndex'){
				this.addSelect(data.units, data.unitIndex);
			}
		}


	};
	this.getInfoProject = function(){

	};
	this.postInfoProject =  function(){

	};

	this.addSelect = function(arr, index){
		if(!arr || !this.fun_units) return 
		var fun = this.fun_units.data("selectBox-selectBoxIt");
		fun.remove();

		for(var i = 0; i < arr.length; i++){
			var obj = {
				value: arr[i],
				text: arr[i]
			}
			fun.add(obj);
		}
		fun.selectOption(index);
	}
	this.createInputVal = function(text, name){
		var elem = createElem('div', 'cont_val_input ' + name)
		var title = createElem('div', 'txt', elem);
		title.innerHTML = text;
		var cont_input = createElem('div', 'cont_input', elem);
		var input = createElem('input', false, cont_input);
		input.type = 'text';
		input.name = name;
		return {
			elem : elem,
			input: input
		}
	}
	loadAllFiles(scripts, styles, this.init.bind(this));
}