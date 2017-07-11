function Main (argument) {
	
	console.log('head');
	var list_menu = [
	{
		text: 'project',
		id: 'project',
		title: 'project'
	},{
		text: 'fabric',
		id: 'fabric',
		title: 'fabric selection'
	},{
		text: 'fittings',
		id: 'fittings',
		title: "finish and fittings"
	},{
		text: 'shape & size',
		id: 'shape',
		title: 'shape & size'
	},{
		text: 'review',
		id: 'review',
		title: 'design review - visualisation'
	},{
		text: 'seams',
		id: 'seams',
		title: 'seam plan'
	},{
		text: 'pattern',
		id: 'pattern',
		title: 'pattern plane'
	}
	];

	this.init = function(){

		this.params = parseQueryString();

		this.main = document.querySelector('.main');
		var page = this.params && this.params.page;
		var itm_page;

		if(page){
			for(var i = 0; i < list_menu.length; i++){
				var itm = list_menu[i];
				if(page && page == itm.id){
					itm_page = itm
				}
			}
			this.itm_page = itm_page;
			this.createPage()
		} else {
			this.pageHome();
		}
		
	};
	this.pageHome = function(){
		var body = createElem('div', 'body', this.main);
		var cont = createElem('div', 'cont', body);

		var logo = createElem('div', 'logo', cont);
		var form = createElem('div', 'form', cont);


		var left_path = createElem('div', 'left', form)
		var right_path = createElem('div', 'right', form)

		var title = createElem('div', 'title', left_path)
		title.innerHTML = 'Get started with';

		var cont_btn = createElem('div', 'cont_btn', left_path)
		var btn_home = createElem('div', 'btn btn_home grad_orange', cont_btn);
		var link_home = createElem('a' , 'link', btn_home);
		link_home.href = 'http://mpanel.com/'
		var btn_open = createElem('div', 'btn btn_open grad_blue', cont_btn);
		var link_open = createElem('a' , 'link', btn_open);
		link_open.innerHTML = 'Open'


		var line_1 = createElem('div', 'cont_btn', right_path)
		var line_2 = createElem('div', 'cont_btn', right_path)


		var btn_learn = createElem('div', 'btn learn grad_blue', line_1)
		var link_learn = createElem('a' , 'link', btn_learn);
		link_learn.innerHTML = 'Learn';
		link_learn.href = 'https://www.youtube.com/playlist?list=PLlFQftmRED8vTFU01XcvMzOGieBj-IGWJ'
		var btn_set = createElem('div', 'btn setting', line_1)
		var link_set = createElem('a' , 'link', btn_set);
		link_set.href = '?page=project&section=settings';


		var btn_news = createElem('div', 'btn news grad_blue', line_2)
		var link_news = createElem('a' , 'link', btn_news);
		link_news.innerHTML = 'news';
		link_news.href = 'http://mpanel.com/news/'
		var btn_help = createElem('div', 'btn help', line_2)
		var link_help = createElem('a' , 'link', btn_help);
		btn_help.href = '?page=project';
		link_help.href = 'http://demo.stagingmonster.com/mpanel_help/source/html/hs10.htm'

		var btn_start = createElem('div','btn_start grad_orange', cont);
		var link = createElem('a', 'link', btn_start)
		link.innerHTML = 'start';
		link.href = '?page=project'

		this.main.classList.add('home')
	};

	this.createPage = function(){
		var head = createElem('div', 'header', this.main);//document.querySelector('.header');\

		var cont_head = createElem('div', 'cont', head);
		var logo = createElem('div', 'logo', cont_head);
		var cont_menu = createElem('div', 'cont_menu', cont_head);
		var menu = createElem('div', 'menu', cont_menu);
		this.menu = menu

		var body = createElem('div', 'body', this.main)
		var cont_body = createElem('div', 'cont', body);
		this.big_title = createElem('div', 'title', cont_body)
		this.cont_body = cont_body

		var footer = createElem('div', 'footer', this.main);
		var cont_elemfooter = createElem('div', 'cont', footer)

		var cont_footer = createElem('div', 'cont_bottom', cont_elemfooter)
		this.cont_footer = cont_footer;
		var cont_btn_back = createElem('div', 'btn back', cont_footer)
		var link_btn_back = createElem('a', 'link',cont_btn_back)
		var btn_text_prompt = createElem('div', 'text_prompt hide', cont_footer)
		var cont_btn_next = createElem('div', 'btn next active', cont_footer)
		var link_btn_next = createElem('a', 'link',cont_btn_next)
		this.btn_next = cont_btn_next;
		this.link_next = link_btn_next;

		this.btn_back = cont_btn_back;
		this.link_back = link_btn_back;

		btn_text_prompt.innerHTML = 'Preliminary data check passed';


		link_btn_back.innerHTML = 'back';
		link_btn_next.innerHTML = 'next';

		this.createMenu();

		
	};
	this.createMenu = function(){
		var w = this.menu.clientWidth;
		// console.log(w)
		var id = list_menu.indexOf(this.itm_page)

		var l_w = Math.floor(w/(list_menu.length-1));

		for(var l = 0; l < list_menu.length; l++){
			var elem = createElem('div', 'page', this.menu);
			if(l < id){
				elem.classList.add('prev')
			} else if(l == id) {
				elem.classList.add('itm')
			}
			elem.style.left = (Math.floor(l*l_w) - 7) + 'px';
			var point = createElem('div','point', elem);
			var text = createElem('a', 'text', elem);
			text.innerHTML = list_menu[l].text;
			text.href = '?page='+list_menu[l].id;
			(function(data){
				point.addEventListener('click', function(){
					window.location.href = '?page='+data.id;

				})
			})(list_menu[l]);
		}
		var line = createElem('div', 'line', this.menu)
		line.style.width = (id/(list_menu.length-1))*w + 'px';


		if(id>=0){
			var next_id = id+1;
			var title = '';
			switch(this.itm_page.id){
				case 'review':
					title = this.itm_page.title
					var review = new Review();
					break
				case 'project':
					if(this.params.section && this.params.section == 'settings'){
						next_id = id;
						title = 'user settings'
						var project = new UserSettings()
					} else {
						// var project = new Project()
						title = this.itm_page.title
						this.emptyPage();
					}
					break
				default: 
					title = this.itm_page.title
					this.emptyPage();
					break
			}
			if(id == 0) {
				this.btn_back.style.display = 'none';
			} else {
				this.link_back.href = '?page='+list_menu[id-1].id;
			}

			if(this.itm_page.id == 'project' && 
				this.params.section && this.params.section == 'settings'){
				this.btn_back.style.display = 'none';
				this.btn_next.style.display = 'none';

				var btn_start = createElem('div','btn btn_start active', this.cont_footer);
				var link = createElem('a', 'link', btn_start)
				link.innerHTML = 'start';
				link.href = '?page=project'
			} else {
				this.link_next.href = '?page='+list_menu[next_id].id;
			}

			this.createBigTitle(title)
			
		}
	}

	this.createBigTitle = function(tlt){
		// 
		var title = this.big_title
		title.innerHTML = tlt;

		var btn_help = createElem('div', 'btn_help', title);
		btn_help.innerHTML = 'Help';
	};
	this.emptyPage = function(){
		var elem = createElem('div', 'development', this.cont_body)
		elem.innerHTML = 'Page in development';
	}

	this.init()
	
}
function createElem(tag, class_name, par){
	var elem = document.createElement(tag)
	if(class_name){
		elem.className = class_name
	}
	if(par){
		par.appendChild(elem)
	}
	return elem

}

function parseQueryString() {

	var queryString = window.location.search;
	queryString = queryString.substring(1);
	var params = {}, queries, temp, i, l;
	queries = queryString.split("&");
	for ( i = 0, l = queries.length; i < l; i++ ) {
		temp = queries[i].split('=');
		params[temp[0]] = temp[1];
	}
	return params;
};


function loadAllFiles(scripts, styles, fun){
	var num = scripts.length + styles.length;
	var head = document.head;
	var s = 0;
	if(scripts.length){
		loadFile()
	}

	for(var c = 0; c < styles.length; c++){
		var link  = document.createElement('link');
		link.rel  = 'stylesheet';
		link.type = 'text/css';
		link.href = styles[c];
		link.onload = function () {
			num--
			if(!num) {
				fun()
			}
		};
		head.appendChild(link);
	}
	function loadFile(){
		var script = document.createElement('script');
		script.src = scripts[s];
		script.type ="text/javascript";
		script.onload = function () {
			num--
			if(!num) {
				fun();
			} else {
				s++;
				loadFile()
			}
		};

		head.appendChild(script);
	}

	if(!scripts.length && !styles.length){
		fun()
	}

}