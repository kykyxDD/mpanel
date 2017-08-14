function Fabric (argument) {
	var par = document.querySelector('.body .cont');

	par.classList.add('page_fabric');
	var scripts = [];
	var styles = [
		'./style/fabric.css'
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

	this.list_brand = [
		{
			'name': '782 S2',
			'key': 's2',
			'img': './image/icon/brand/s2.png'
		},{
			'name': 'Endevour 600',
			'key': 'endevour',
			'img': './image/icon/brand/endevour.png'
		},{
			'name': 'Extrablock',
			'key': 'extrablock',
			'img': './image/icon/brand/extrablock.png'
		},{
			'name': 'Ferrari 505',
			'key': 'ferrari_505',
			'img': './image/icon/brand/ferrari.png'
		},{
			'name': 'Ferrari 802',
			'key': 'ferrari_802',
			'img': './image/icon/brand/ferrari.png'
		},{
			'name': 'Gale WP',
			'key': 'gale_wp',
			'img': './image/icon/brand/gale.png'
		},{
			'name': 'Gale',
			'key': 'gale',
			'img': './image/icon/brand/gale.png'
		},{
			'name': 'lac 650',
			'key': 'lac650',
			'img': './image/icon/brand/lac.png'
		},{
			'name': 'Monotec',
			'key': 'monotec',
			'img': './image/icon/brand/monotec.png'
		},{
			'name': '782 S2',
			'key': 's2',
			'img': './image/icon/brand/s2.png'
		},{
			'name': 'Endevour 600',
			'key': 'endevour',
			'img': './image/icon/brand/endevour.png'
		},{
			'name': 'Extrablock',
			'key': 'extrablock',
			'img': './image/icon/brand/extrablock.png'
		},{
			'name': 'Ferrari 505',
			'key': 'ferrari_505',
			'img': './image/icon/brand/ferrari.png'
		},{
			'name': 'Ferrari 802',
			'key': 'ferrari_802',
			'img': './image/icon/brand/ferrari.png'
		},{
			'name': 'Gale WP',
			'key': 'gale_wp',
			'img': './image/icon/brand/gale.png'
		},{
			'name': 'Gale',
			'key': 'gale',
			'img': './image/icon/brand/gale.png'
		},{
			'name': 'lac 650',
			'key': 'lac650',
			'img': './image/icon/brand/lac.png'
		},{
			'name': 'Monotec',
			'key': 'monotec',
			'img': './image/icon/brand/monotec.png'
	}];
	this.list_colour = [
		{
			'key' : 'olive',
			'name': 'Olive',
			'img': './image/icon/colour/olive.png'
		},{
			'key' : 'terracota',
			'name': 'Terracota',
			'img': './image/icon/colour/terracota.png'
		},{
			'key' : 'indigo',
			'name': 'Indigo',
			'img': './image/icon/colour/indigo.png'
		},{
			'key' : 'celadon',
			'name': 'Celadon',
			'img': './image/icon/colour/celadon.png'
		},{
			'key' : 'khaki',
			'name': 'Khaki',
			'img': './image/icon/colour/khaki.png'
		},{
			'key' : 'carmine',
			'name': 'Carmine',
			'img': './image/icon/colour/carmine.png'
		},{
			'key' : 'red',
			'name': 'Red',
			'img': './image/icon/colour/red.png'
		},{
			'key' : 'titian',
			'name': 'Titian',
			'img': './image/icon/colour/titian.png'
		},{
			'key' : 'crocus',
			'name': 'Crocus',
			'img': './image/icon/colour/crocus.png'
		}
	];
	var left_path, right_path;

	this.init = function(){
		var self = this;
		this.update_info = false;
		this.new_page = false;
		// main.createBtnSetting();
		main.updateLinkBtnNext(this.postNewInfo.bind(this));

		var cont_info = createElem('form', 'cont_info', par);
		left_path = dom.div('left_path', cont_info);
		right_path = dom.div('right_path', cont_info);


		var cont_img_texture = dom.div('cont_img_texture', left_path);

		var item_texture = dom.img('', 'item_texture', cont_img_texture); //dom.div('item_texture', cont_img_texture);
		this.item_texture = item_texture;

		var cont_database = dom.div('cont_select cont_database', right_path)
		var select_database = createElem('select', 'select_database', cont_database);

		// for(var i = 0; i < 3; i++){
		// 	var elem = createElem('option', 'database', select_database)
		// 	elem.value = 'database'
		// 	elem.innerHTML = 'FABRIC DATABASE'//this.units[key];
		// }
		this.select_fabric = $("select.select_database").selectBoxIt({
			defaultText: "FABRIC DATABASE"
		});


		this.select_fabric.bind({
			'change': self.changeFabric.bind(self)
		})


		var cont_brand = dom.div('cont_select cont_brand', right_path)
		var select_brand = createElem('select', 'select_brand', cont_brand);

		// for(var i = 0; i < this.list_brand.length; i++){
		// 	var itm = this.list_brand[i];
		// 	var option = createElem('option', 'opt '+ itm.key, select_brand)
		// 	option.value = itm.key
		// 	option.innerHTML = itm.name
		// 	option.setAttribute('data-iconurl', itm.img);
		// }

		this.select_brand = $("select.select_brand").selectBoxIt({
			defaultText: "BRAND SELECTOR",
			// defaultIcon: ''
		});
		this.select_brand.bind({
			'change': self.changeBrand.bind(self)
		})


		var cont_colour = createElem('div', 'cont_select cont_colour', right_path)
		var select_colour = createElem('select', 'select_colour', cont_colour);


		// for(var i = 0; i < this.list_colour.length; i++){
		// 	var itm = this.list_colour[i];
		// 	var option = createElem('option', 'opt '+ itm.key, select_colour);
		// 	option.value = itm.key;
		// 	option.innerHTML = itm.name;
		// 	option.setAttribute('data-iconurl', itm.img);
		// }

		this.select_colour = $("select.select_colour").selectBoxIt({
			defaultText: "COLOUR CHOICE",
			// defaultIcon: ''
		});

		this.select_colour.bind({
			'change': self.changeColor.bind(self)
		})


		var cont_roll = this.createElemInput('Roll width (mm)', 'poll', 'text');
		cont_roll.input.value = ''; //300;

		var cont_over = this.createElemInput('Override stretch values', 'override', 'checkbox');

		var cont_str_warp = this.createElemInput('Warp Stretch %', 'warp_str', 'text');
		cont_str_warp.input.value = ''; //4;

		var cont_str_werp = this.createElemInput('Waft Stretch %', 'waft_str', 'text');
		cont_str_werp.input.value = ''; //2;

		this.obj_elem = {
			img_texture: item_texture,
			sel_fabric: this.select_fabric,
			sel_brand: this.select_brand,
			sel_colour: this.select_colour,
			roll: cont_roll.input,
			override: cont_over.input, 
			warp: cont_str_warp.input, 
			werp: cont_str_werp.input
		}


		var id_project = main.getDataId();

		if(id_project){
			this.getInfoFabric(id_project)
		} else {

		}
	};


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

	this.getInfoFabric = function(id){
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
					self.setInfoFabric(data.data)
				} else {
					main.errorTextPreload(data.error)
				}
			}, 
			error: function(e){
				main.errorTextPreload('Problem loading data!', e)
			}
		});

	};
	this.setInfoFabric = function(data){
		console.log('data', data)


		this.update_info = true

		this.obj_data = data;
		if(data.fabricImageBase64){
			this.obj_elem.img_texture.src = data.fabricImageBase64;
		}

		if(data.fabricItems){
			this.createSelInfo(data.fabricItems, this.obj_elem.sel_fabric, data.fabricSelectedIndex)
		}

		if(data.fabricTypeItems){
			this.createSelInfo(data.fabricTypeItems, this.obj_elem.sel_brand, data.fabricTypeSelectedIndex)
		}

		if(data.fabricColorItems){
			this.createSelInfo(data.fabricColorItems, this.obj_elem.sel_colour, data.fabricColorSelectedIndex)
		}

		this.obj_elem.roll.value = data.rollWidthText
		this.obj_elem.override.checked = data.override
		this.obj_elem.warp.value = data.warpStretch
		this.obj_elem.werp.value = data.weftStretch

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

		var fun_color = this.obj_elem.sel_colour.data("selectBox-selectBoxIt");
		
		var fun_fabric = this.obj_elem.sel_fabric.data("selectBox-selectBoxIt");
		var fun_brand = this.obj_elem.sel_brand.data("selectBox-selectBoxIt");

		data.fabricSelectedIndex = fun_fabric.currentIndex
		data.fabricTypeSelectedIndex = fun_brand.currentIndex
		data.fabricColorSelectedIndex = fun_color.currentIndex
		data.rollWidthText = this.obj_elem.roll.value
		data.override = this.obj_elem.override.checked
		data.warpStretch = this.obj_elem.warp.value
		data.weftStretch = this.obj_elem.werp.value

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
						window.location.href = '?page=fittings';
					} else {
						self.setInfoFabric(data.data)
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

	this.changeFabric = function(e){
		if(this.update_info) return
		console.log('changeFabric', e)
		this.postNewInfo('FabricSelectedIndex')//fabricItems FabricSelectedIndex
		
	}
	this.changeBrand = function(e){
		if(this.update_info) return
		console.log('changeBrand', e)
		this.postNewInfo('FabricTypeSelectedIndex')//fabricTypeItems FabricTypeSelectedIndex
		
	}
	this.changeColor = function(e){
		if(this.update_info) return
		console.log('changeColor', e)
		// var fun = this.obj_elem.sel_colour.data("selectBox-selectBoxIt");
		// var val = fun.currentIndex;
		// console.log(val);

		this.postNewInfo('FabricColorSelectedIndex')//fabricColorItems FabricColorSelectedIndex
	}

	this.createElemInput = function(txt, key, type){
		var elem = createElem('div', 'cont_input '+key, right_path);
		var cont_name = createElem('div', 'cont_name', elem);
		var text = createElem('div', 'name', cont_name)
		text.innerHTML = txt
		var cont_val = createElem('div', 'cont_val', elem);

		var input = createElem('input', 'val input_' + type, cont_val);
		input.type = type;
		input.name = key;

		if(type == 'checkbox'){
			dom.addclass(cont_val , 'cont_check')
			var label = createElem('label', 'label_checkbox', cont_val)
			label.setAttribute('for', key)
			input.id = key
		}

		return {
			elem: elem,
			input : input
		}

	};

	loadAllFiles(scripts, styles, this.init.bind(this));
}