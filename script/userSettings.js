function UserSettings(){
	var par = document.querySelector('.body .cont');

	par.classList.add('user_set')
	var scripts = [];
	var styles = [
		'./style/user_settings.css'
	];
	


	this.styles = {
		'standard':'standard',
		'single'  :'single Poly cut',
		'aeronaut':'aeronaut',
		'autometrix':'autometrix',
		'prosail':'prosail',
		'smre':'smre'
	}


	this.init = function (argument) {
		this.units = main.units;
		// var title = createElem('div', 'title', par);
		// title.innerHTML = 'USER SETTINGS';

		main.createBtnSetting(true)



		main.cont_left_btn.removeChild(main.cont_left_btn.querySelector('.btn_help'))

		var cont_info = createElem('form', 'cont_info', par);
		var left_path = createElem('div', 'left_path', cont_info);
		var right_path = createElem('div', 'right_path', cont_info);

		var name = createElem('div', 'elem_name',left_path);
		var input_name = createElem('input', 'input_name', name);
		input_name.type = 'text';
		input_name.name = 'name';
		input_name.placeholder = 'COMPANY NAME';

		var view_img = createElem('div', 'drag', left_path);
		var bottom_view = createElem('div', 'set_image', left_path);
		var self = this;

		this.drag = view_img


		view_img.addEventListener('dragenter', self.dropenter.bind(self));
		view_img.addEventListener('dragover', self.dropenter.bind(self));
		view_img.addEventListener('dragleave', self.dropleave.bind(self));
		view_img.addEventListener('drop', function(e){
			e.stopPropagation();
			e.preventDefault();
			self.dodrop(e)
			return false;
		});

		var text = createElem('span', 'text', bottom_view);
		text.innerHTML = 'Add your Company Logo';
		var label_img = createElem('label', 'my_btn label_img', bottom_view)
		label_img.innerHTML = 'Browse';
		var input_img = createElem('input', 'browse', label_img)
		input_img.type = 'file';
		input_img.accept="image/*";
		input_img.addEventListener('change', self.changeImg.bind(self))

		var text = createElem('div', 'small_title', left_path);
		text.innerHTML = 'UNITS';

		var cont_select_units = createElem('div','change_units', left_path);

		var select = createElem('select', 'select_units', cont_select_units)
		select.id = 'select_units ';

		for(var key in this.units) {
			var elem = createElem('option', key, select)
			elem.value = key
			elem.innerHTML = this.units[key];
		}

		$("select").selectBoxIt({
			defaultText: "units"
		});
		



		var file_name = createElem('div', 'set_file_name', left_path);
		var input_file_name = createElem('input', 'file_name',  file_name);
		input_file_name.type = 'text';
		input_file_name.name = 'file_name';
		input_file_name.placeholder = 'FILE NAME';

		var cont_btn_save = createElem('div','cont_save', left_path)

		var input_save = createElem('input', 'my_btn btn_save', cont_btn_save)
		input_save.type = 'submit';
		input_save.value = 'Save';


		var cont_select_units = createElem('div','change_units', right_path);

		var select = createElem('select', 'select_units', cont_select_units)
		select.id = 'select_units ';

		for(var key in this.styles) {
			var elem = createElem('option', key, select)
			elem.value = key
			elem.innerHTML = this.styles[key];
		}
		$("select").selectBoxIt({
			//defaultText: "units"
		});

	}
	this.changeImg = function(e){

		console.log('e',e)
		var tgt = e.target || window.event.srcElement,
		files = tgt.files;
		this.getImg(files[0])
		
	}
	this.getImg = function(file) {
		var self = this;
		var fr = new FileReader();
		fr.onload = function () {
			console.log(fr.result)
			self.drag.style.backgroundImage = 'url('+fr.result+')';
			self.drag.style.backgroundSize = 'contain';
		}
		fr.readAsDataURL(file);
	}
	this.dodrop = function(e) {
		this.dropleave()
		var dt = e.dataTransfer;
		if(!dt && !dt.files) { return false ; }

		var files = dt.files;
		dt.dropEffect="copy";
		this.getImg(files[0])

		e.stopPropagation();
		e.preventDefault();
		return false;
	}

	this.dropenter = function(e) {
		e.stopPropagation();
		e.preventDefault();

		this.drag.style.backgroundColor = '#E4E4E4';
	}

	this.dropleave = function() {
		this.drag.style.backgroundColor = '';
	}


	loadAllFiles(scripts, styles, this.init.bind(this));
	// this.init();
}