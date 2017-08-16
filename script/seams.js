function Seams (argument) {
	var par = document.querySelector('.body .cont');

	par.classList.add('page_seams');
	var scripts = [];
	var styles = [
		'./style/seams.css'
	];
	this.init = function(){
		var self = this;
		main.updateLinkBtnNext(this.postNewInfo.bind(this));

		var cont_info = createElem('form', 'cont_info', par);
		left_path = dom.div('left_path', cont_info);
		right_path = dom.div('right_path', cont_info);
	}
	
	this.postNewInfo = function(){}
	loadAllFiles(scripts, styles, this.init.bind(this));
}