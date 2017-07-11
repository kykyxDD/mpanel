function UserSettings(){
	var par = document.querySelector('.body .cont');

	par.classList.add('user_set')
	var scripts = [];
	var styles = [
		'./style/user_settings.css'
	]


	this.init = function (argument) {
		// var title = createElem('div', 'title', par);
		// title.innerHTML = 'USER SETTINGS';



		var set = createElem('div', 'set btn disabled', main.big_title );
		set.innerHTML = 'Settings';

		main.big_title.removeChild(main.big_title.querySelector('.btn_help'))

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
		var label_img = createElem('label', 'btn label_img', bottom_view)
		label_img.innerHTML = 'Browse';
		var input_img = createElem('input', 'browse', label_img)
		input_img.type = 'file';
		input_img.accept="image/*";
		input_img.addEventListener('change', self.changeImg.bind(self))

		var text = createElem('div', 'small_title', left_path);
		text.innerHTML = 'UNITS';

		var select = createElem('div','change', left_path);

		var file_name = createElem('div', 'set_file_name', left_path);
		var input_file_name = createElem('input', 'file_name',  file_name);
		input_file_name.type = 'text';
		input_file_name.name = 'file_name';
		input_file_name.placeholder = 'FILE NAME';

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