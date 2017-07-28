function Fabric (argument) {
	var par = document.querySelector('.body .cont');

	par.classList.add('page_fabric');
	var scripts = [];
	var styles = [
		'./style/fabric.css'
	];

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
		main.createBtnSetting();

		var cont_info = createElem('form', 'cont_info', par);
		left_path = createElem('div', 'left_path', cont_info);
		right_path = createElem('div', 'right_path', cont_info);


		var cont_img_texture = createElem('div', 'cont_img_texture', left_path);

		var item_texture = createElem('div', 'item_texture', cont_img_texture);

		var cont_database = createElem('div', 'cont_select cont_database', right_path)
		var select_database = createElem('select', 'select_database', cont_database);

		for(var i = 0; i < 3; i++){
			var elem = createElem('option', 'database', select_database)
			elem.value = 'database'
			elem.innerHTML = 'FABRIC DATABASE'//this.units[key];
		}
		$("select").selectBoxIt({
			defaultText: "FABRIC DATABASE"

		});


		var cont_brand = createElem('div', 'cont_select cont_brand', right_path)
		var select_brand = createElem('select', 'select_brand', cont_brand);

		for(var i = 0; i < this.list_brand.length; i++){
			var itm = this.list_brand[i];
			var option = createElem('option', 'opt '+ itm.key, select_brand)
			option.value = itm.key
			option.innerHTML = itm.name
			option.setAttribute('data-iconurl', itm.img);
		}

		$("select").selectBoxIt({
			defaultText: "BRAND SELECTOR",
			defaultIcon: ''
		});


		var cont_colour = createElem('div', 'cont_select cont_colour', right_path)
		var select_colour = createElem('select', 'select_colour', cont_colour);


		for(var i = 0; i < this.list_colour.length; i++){
			var itm = this.list_colour[i];
			var option = createElem('option', 'opt '+ itm.key, select_colour);
			option.value = itm.key;
			option.innerHTML = itm.name;
			option.setAttribute('data-iconurl', itm.img);
		}

		$("select").selectBoxIt({
			defaultText: "COLOUR CHOICE",
			defaultIcon: ''
		});

		var cont_roll = this.createElemInput('Roll width (mm)', 'poll', 'text');
		cont_roll.input.value = 300;
		var cont_over = this.createElemInput('Override stretch values', 'override', 'checkbox');

		var cont_str_warp = this.createElemInput('Warp Stretch %', 'warp_str', 'text');
		cont_str_warp.input.value = 4;

		var cont_str_werp = this.createElemInput('Waft Stretch %', 'waft_str', 'text');
		cont_str_werp.input.value = 2;
	};

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