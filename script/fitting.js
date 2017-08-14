function Fittings (argument) {
	var par = document.querySelector('.body .cont');

	par.classList.add('page_fitting');
	var scripts = [];
	var styles = [
		'./style/fitting.css'
	];
	this.del_key = [
		'exampleImageBase64',
		"hardwareItems",
		"hardEdgeTypeItems",
		"hardColorItems",
		"hardCornorItems",
		"hardLinkItems",
		"exampleImageItems",
		"fabricItems",
	    "fabricTypeItems",
	    "fabricColorItems",
	    'fabricImageBase64'
	]
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
	this.obj_elem = {}

	this.text_hint_internal = 'This allowance will be added to both sides of each seam';
	this.text_hint_added = 'This wiil extend the post above the connection height for visualisation purposes only';

	var left_path,  right_path;

	this.init = function(){
		this.update_info = false;
		this.new_page = false;
		// main.createBtnSetting();
		main.updateLinkBtnNext(this.postNewInfo.bind(this));

		var cont_info = createElem('div', 'cont_info', par);
		left_path = createElem('div', 'left_path', cont_info);
		
		right_path = createElem('div', 'right_path', cont_info);
		this.createLeftPath(left_path)
		
		this.createRightPath(right_path)

		var id_project = main.getDataId();

		if(id_project){
			this.getInfoFitting(id_project)
		} else {

		}
	}

	this.createLeftPath = function(par){
		var self = this
		var cont_layer_1 = dom.div('cont_layer layer_1', par)

		var cont_left_elem = dom.div('cont_color', cont_layer_1);
		var elem_color = dom.div('color', cont_left_elem);

		var cont_all_select = dom.div('cont_all_select', cont_layer_1);

		var cont_hardware = dom.div('cont_select cont_hardware', cont_all_select)
		var select_hardware = dom.elem('select', 'select_hardware', cont_hardware);

		this.select_hardware = $("select.select_hardware").selectBoxIt({
			defaultText: "HARDWARE DATA"
		});

		this.select_hardware.bind({
			'change': self.changeHardware.bind(self)
		})

		// this.createSelHardware(this.edge_type);

		var cont_webbing = dom.div('cont_select cont_webbing', cont_all_select);
		var select_webbing = dom.elem('select', 'select_edge_type', cont_webbing);

		this.select_edge_type = $("select.select_edge_type").selectBoxIt({
			defaultText: "EDGE TYPE"
		});

		this.select_edge_type.bind({
			'change': self.changeEdgeType.bind(self)
		})
		// this.createSelEdgeType(this.edge_type);


		var cont_colour = dom.div('cont_select cont_colour', cont_all_select);
		var select_colour = dom.elem('select', 'select_colour', cont_colour);

		this.select_colour = $("select.select_colour").selectBoxIt({
			defaultText: "COLOUR"
		});

		this.select_colour.bind({
			'change': self.changeColor.bind(self)
		})
		// this.createSelColour(this.colour);

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

		this.select_corner.bind({
			'change': self.changeExampleImage.bind(self)
		})

		var cont_all_select_1 = dom.div('cont_all_select', cont_layer_2);

		var cont_finish = dom.div('cont_select cont_finish', cont_all_select_1);
		var select_finish = dom.elem('select', 'select_finish', cont_finish);

		this.select_finish = $("select.select_finish").selectBoxIt({
			defaultText: "CORNER FINISH"
		});

		this.select_finish.bind({
			'change': self.changeFinish.bind(self)
		})
		// this.createSelFinish(this.finish);

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

		
		this.select_corner_link.bind({
			'change': self.changeLink.bind(self)
		})

		// this.createSelLink(this.corner_link);

		var input_link_lenght = this.createElemInput(cont_all_select_1, 'link', 'Link length(mm)');

		this.obj_elem.elem_color = elem_color
		this.obj_elem.sel_hardware = this.select_hardware
		this.obj_elem.sel_hardEdge = this.select_edge_type
		this.obj_elem.sel_color =this.select_colour
		this.obj_elem.hem = input_hem.input
		this.obj_elem.hard_corner  = this.select_finish
		this.obj_elem.hardLenght  = cont_lenght.input
		this.obj_elem.hardWidth   = cont_width.input
		this.obj_elem.fitCorner   = input_checkbox
		this.obj_elem.sel_link = this.select_corner_link;
		this.obj_elem.sel_example = this.select_corner;
		this.obj_elem.link_lenght = input_link_lenght.input
		
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

	this.createSelInfo = function(arr, sel, index){
		if(!arr || !sel) return 
		var fun = sel.data("selectBox-selectBoxIt");
		fun.remove();

		for(var i = 0; i < arr.length; i++){
			var obj = {
				value: arr[i],
				text: arr[i],
			}
			fun.add(obj)
		}
		if(!isNaN(parseFloat(index))){
			fun.selectOption(index);
		}

	}
	this.changeHardware = function(){
		if(this.update_info) return
		console.log('hardwareSelectedIndex')
		this.postNewInfo('hardwareSelectedIndex')
	}
	this.changeEdgeType = function(){
		if(this.update_info) return
		console.log('hardEdgeTypeSelectedIndex')
		this.postNewInfo('hardEdgeTypeSelectedIndex')
	}

	this.changeColor = function(){
		if(this.update_info) return
		console.log('hardColorSelectedIndex')
		this.postNewInfo('hardColorSelectedIndex')
	}
	this.changeFinish = function(){
		if(this.update_info) return
		console.log('hardCornorSelectedIndex')
		this.postNewInfo('hardCornorSelectedIndex')
	}

	this.changeLink = function(){
		if(this.update_info) return
		console.log('hardLinkSelectedIndex')
		this.postNewInfo('hardLinkSelectedIndex')
	}
	this.changeExampleImage = function(){
		if(this.update_info) return
		console.log('exampleImageSelectedIndex')
		this.postNewInfo('exampleImageSelectedIndex')
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
		var angle = this.createElemInput(cont_details, 'angle', 'Pole angle angle degress');
		var height = this.createElemInput(cont_details, 'height', 'Pole added height (mm)');

		var btn_help = main.createBtnHelp(height.cont_input);
		var popup = main.hintHelp(btn_help, this.text_hint_added)

		this.obj_elem.thread = cont_thread.input
		this.obj_elem.accessories = accessories.input
		this.obj_elem.internal = internal.input
		this.obj_elem.size = reinfo.input
		this.obj_elem.diameter = diameter.input
		this.obj_elem.angle = angle.input
		this.obj_elem.height = height.input

	}



	this.getInfoFitting = function(id){
		var url = main.host + dataUrl.material.get+id;

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
					self.setInfoFitting(data.data)
				} else {
					main.errorTextPreload(data.error)
				}
			}, 
			error: function(e){
				main.errorTextPreload('Problem loading data!', e)
			}
		});

	};
	this.setInfoFitting = function(data){
		console.log('data', data)
		this.obj_data = data;

		this.update_info = true;

		if(data.hardwareItems){
			this.createSelInfo(data.hardwareItems, this.obj_elem.sel_hardware, data.hardwareSelectedIndex)
		}
		if(data.hardEdgeTypeItems){
			this.createSelInfo(data.hardEdgeTypeItems, this.obj_elem.sel_hardEdge, data.hardEdgeTypeSelectedIndex)
		}
		if(data.hardColorItems){
			this.createSelInfo(data.hardColorItems, this.obj_elem.sel_color, data.hardColorSelectedIndex)
		}

		this.obj_elem.hem.value = data.hemText

		if(data.hardCornorItems){
			this.createSelInfo(data.hardCornorItems, this.obj_elem.hard_corner, data.hardCornorSelectedIndex)
		}

		if(data.hardLinkItems){
			this.createSelInfo(data.hardLinkItems, this.obj_elem.sel_link , data.hardLinkSelectedIndex)
		}
		if(data.exampleImageItems){
			this.createSelInfo(data.exampleImageItems, this.obj_elem.sel_example , data.exampleImageSelectedIndex)
		}
		this.obj_elem.link_lenght.value = data.linkLengthText;


		/*----- right path -----*/

		this.obj_elem.thread.value  = data.thread;
		this.obj_elem.accessories.value = data.accessories;
		
		this.obj_elem.diameter.value = data.poleDiameterText
		this.obj_elem.angle.value = data.poleAngle
		this.obj_elem.height.value = data.poleExtraHeight

		main.hidePreload()
		this.update_info = false
	}
	this.getObjInfo = function(){
		var data = this.obj_data;

		for(var i = 0; i < this.del_key.length; i++){
			if(data[this.del_key[i]]){
				delete data[this.del_key[i]]
			}
		}

		data.hardwareSelectedIndex = this.obj_elem.sel_hardware.data("selectBox-selectBoxIt").currentIndex
		data.hardEdgeTypeSelectedIndex = this.obj_elem.sel_hardEdge.data("selectBox-selectBoxIt").currentIndex
		data.hardColorSelectedIndex = this.obj_elem.sel_color.data("selectBox-selectBoxIt").currentIndex
		data.hardCornorSelectedIndex = this.obj_elem.hard_corner.data("selectBox-selectBoxIt").currentIndex
		data.hardLinkSelectedIndex = this.obj_elem.sel_link.data("selectBox-selectBoxIt").currentIndex
		data.exampleImageSelectedIndex = this.obj_elem.sel_example.data("selectBox-selectBoxIt").currentIndex


		data.hemText = this.obj_elem.hem.value
		data.linkLengthText = this.obj_elem.link_lenght.value;
		data.thread = this.obj_elem.thread.value  ;
		data.accessories = this.obj_elem.accessories.value ;		
		data.poleDiameterText = this.obj_elem.diameter.value 
		data.poleAngle = this.obj_elem.angle.value 
		data.poleExtraHeight = this.obj_elem.height.value 


		return data
	};
	this.postNewInfo = function(sel){
		var id = main.getDataId();
		var url = main.host; //main.host + dataUrl.material.post.selectChange+id; 
		if(typeof sel == 'string'){
			this.new_page = false
			url += dataUrl.material.post.selectChange+id+ '&selectType='+sel;
		} else {
			this.new_page = true
			url += dataUrl.material.post.commit+id;
		}
		

		main.createPreload();
		main.showPreload();
		var info = this.getObjInfo();

		var self = this;

		// return

		$.ajax({
			url: url,
			type: "POST",
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(info),
			success: function(data){
				if(data.data){
					if(self.new_page){
						window.localStorage.setItem('mpanel_id', data.data);
						window.location.href = '?page=shape';
					} else {
						self.setInfoFitting(data.data)
					}
				} else {
					var text = data.error || data.message;
					main.errorTextPreload(text)
				}
			}, 
			error: function(e){
				main.errorTextPreload('Problem loading data!', e)
			}
		})
	}
	
	loadAllFiles(scripts, styles, this.init.bind(this));
}