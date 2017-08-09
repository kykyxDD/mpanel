function Main (argument) {
	this.host = ' http://192.168.0.119:1234/'
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

	this.units = {
		"m"  :"<span class='name'>meters</span> <span class='val'>1.234</span>",	//метр
		"cm" : "<span class='name'>centimetre</span> <span class='val'>123.4</span>", // сантиметр 
		'mm' : "<span class='name'>millimeters</span> <span class='val'>1234</span>", // милиметр
		"in" :"<span class='name'>inches</span> <span class='val'>123.4	&Prime;</span>", //дюйм	//
		"ft_in" : "<span class='name'>feet and inches</span> <span class='val'>12 &Prime; 3.4</span>",	//фут	
		"ft_in_fr" : "<span class='name'>feet, inches, fractions</span> <span class='val'>12 &Prime; 3.5/16</span>"	//фатом	1 f, fm	
	}

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
	this.preload
	this.text_preload
	this.loadDataPreload = function(){
		dom.remclass(this.preload, 'hide');

		var post = dom.div('post_text', this.preload);
		dom.text(post, "Sending update data");
		this.text_preload = post

		dom.addclass(this.preload, 'post');
	},
	this.createPreload = function(){
		this.preload = dom.div('preload hide',this.cont_body);
	};
	this.hidePreload = function(){
		dom.addclass(this.preload, 'hide');
		dom.remclass(this.preload, 'error');
		dom.addclass(this.preload, 'post');
		if(this.text_preload){
			this.preload.removeChild(this.text_preload);
		}
	};
	this.updateTextPreload = function(txt){
		if(!this.text_preload) {
			var post = dom.div('post_text', this.preload);
			this.text_preload = post
			dom.addclass(this.preload, 'post');
		}
		dom.text(this.text_preload, txt)
		dom.addclass(this.preload, 'ready');
	}
	this.showPreload = function(){
		dom.text(this.preload, '');
		dom.remclass(this.preload, 'error');

		dom.remclass(this.preload, 'hide');
	};
	this.remPreload = function(){

	};
	this.errorTextPreload = function(txt, events){
		dom.addclass(this.preload, 'error');
		dom.text(this.preload, '')
		var elem = dom.div('error_text', this.preload);

		if(events){
			var title_error = dom.div('title_error', elem)
			dom.text(title_error, txt)
			var parse = JSON.parse(events.responseText);
			var cont_text = dom.div('cont_text', elem);
			dom.text(cont_text, parse.message +'('+events.status+')')
		} else {
			dom.text(elem, txt);
		}
		
	};
	this.pageHome = function(){
		var body = createElem('div', 'body', this.main);
		var cont = createElem('div', 'cont', body);

		var logo = createElem('div', 'logo', cont);
		// var link_logo = createElem('a', )

		var form = createElem('div', 'form', cont);


		var left_path = createElem('div', 'left', form)
		var right_path = createElem('div', 'right', form)

		var title = createElem('div', 'title', left_path)
		title.innerHTML = 'Get started with';

		var cont_btn = createElem('div', 'cont_btn', left_path)
		var btn_home = createElem('div', 'my_btn btn_home grad_orange', cont_btn);
		var link_home = createElem('a' , 'link', btn_home);
		link_home.href = 'http://mpanel.com/'
		var btn_open = createElem('div', 'my_btn btn_open grad_blue', cont_btn);
		var link_open = createElem('a' , 'link', btn_open);
		link_open.innerHTML = 'Open'


		var line_1 = createElem('div', 'cont_btn', right_path)
		var line_2 = createElem('div', 'cont_btn', right_path)


		var btn_learn = createElem('div', 'my_btn learn grad_blue', line_1)
		var link_learn = createElem('a' , 'link', btn_learn);
		link_learn.innerHTML = 'Learn';
		link_learn.href = 'https://www.youtube.com/playlist?list=PLlFQftmRED8vTFU01XcvMzOGieBj-IGWJ'
		var btn_set = createElem('div', 'my_btn setting', line_1)
		var link_set = createElem('a' , 'link', btn_set);
		link_set.href = '?page=project&section=settings';


		var btn_news = createElem('div', 'my_btn news grad_blue', line_2)
		var link_news = createElem('a' , 'link', btn_news);
		link_news.innerHTML = 'news';
		link_news.href = 'http://mpanel.com/news/'
		var btn_help = createElem('div', 'my_btn help', line_2)
		var link_help = createElem('a' , 'link', btn_help);
		btn_help.href = '?page=project';
		link_help.href = 'http://demo.stagingmonster.com/mpanel_help/source/html/hs10.htm'

		var btn_start = createElem('div','btn_start grad_orange', cont);
		var link = createElem('a', 'link', btn_start)
		link.innerHTML = 'start';
		link.href = '?page=project'

		this.main.classList.add('home')
		document.body.classList.add('body_home')
	};

	this.createPage = function(){
		var head = dom.div('header', this.main);//document.querySelector('.header');

		var cont_head = dom.div('cont', head);
		var logo = dom.div('logo', cont_head);
		var cont_menu = dom.div('cont_menu', cont_head);
		var menu = dom.div('menu', cont_menu);
		this.menu = menu

		var body = dom.div('body', this.main);
		var cont_body = dom.div('cont', body);
		this.big_title = dom.div('title', cont_body);
		this.cont_body = cont_body;

		var footer = dom.div('footer', this.main);
		var cont_elemfooter = dom.div('cont', footer);

		var cont_footer = dom.div('cont_bottom', cont_elemfooter);
		this.cont_footer = cont_footer;
		var cont_btn_back = dom.div('my_btn back', cont_footer);
		var link_btn_back = createElem('a', 'link',cont_btn_back);
		var btn_text_prompt = dom.div('text_prompt hide', cont_footer);
		var cont_btn_next = dom.div('my_btn next active', cont_footer);
		var link_btn_next = createElem('a', 'link',cont_btn_next);
		this.btn_next = cont_btn_next;
		this.link_next = link_btn_next;

		this.btn_back = cont_btn_back;
		this.link_back = link_btn_back;

		var cont_error = dom.div('cont_error', btn_text_prompt);
		var cont_text_error = dom.div('cont_text_error', cont_error);
		var cont_ok = dom.div('text_ok', btn_text_prompt);


		var cont_fill = dom.div('fill_data', cont_text_error);
		dom.text(cont_fill, 'Please fill your measurement data.')
		
		var cont_itm_error = dom.div('cont_itm_error', cont_text_error);
		var text = dom.div('txt_before', cont_itm_error);
		dom.text(text, 'It looks like there is an error in your measurements.');
		var cont_text = dom.div('cont_txt', cont_itm_error);
		dom.text(cont_text, '');


		this.text_prompt = btn_text_prompt;
		this.cont_error = cont_text_error;
		this.cont_text = cont_text

		cont_ok.innerHTML = 'Preliminary data check passed.';

		link_btn_back.innerHTML = 'back';
		link_btn_next.innerHTML = 'next';

		this.createMenu();

		
	};

	this.createBtnSetting = function(disabled){
		var set = createElem('div', 'set my_btn' );
		if(disabled) {
			set.classList.add('disabled');
		}
		var link = createElem('a', 'link', set);
		link.innerHTML = 'Settings';
		link.href = '?page=project&section=settings';

		this.cont_left_btn.insertBefore(set, this.btn_help)

	}
	this.createMenu = function(){
		var w = this.menu.clientWidth;
		// console.log(w)
		var id = list_menu.indexOf(this.itm_page)
		this.link_page = {};

		var l_w = Math.floor(w/(list_menu.length-1));

		for(var l = 0; l < list_menu.length; l++){
			var link = list_menu[l]
			var elem = createElem('div', 'page', this.menu);
			if(l < id){
				elem.classList.add('prev')
			} else if(l == id) {
				elem.classList.add('itm')
			}
			elem.style.left = (Math.floor(l*l_w) - 7) + 'px';
			var point = createElem('div','point', elem);
			var text = createElem('a', 'text', elem);
			text.innerHTML = link.text;
			text.href = '?page='+link.id;
			this.link_page[link.id] = text
			/*(function(data){
				point.addEventListener('click', function(){
					window.location.href = '?page='+data.id;
				})
			})(link);*/
		}
		var line = createElem('div', 'line', this.menu)
		line.style.width = (id/(list_menu.length-1))*w + 'px';
		var html = ''


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
						title = this.itm_page.title
						var project = new Project();
						html = 'hs30.htm';
					}
					break
				case 'fabric':
						title = this.itm_page.title
						var fabric = new Fabric();
						html = 'hs40.htm';
					break
				case 'shape':
					title = this.itm_page.title
					var shape_size = new ShapeSize();
					html = 'hs50.htm';
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

				var btn_start = createElem('div','my_btn btn_start active', this.cont_footer);
				var link = createElem('a', 'link', btn_start)
				link.innerHTML = 'start';
				link.href = '?page=project'
			} else {
				this.link_next.href = '?page='+list_menu[next_id].id;
			}

			this.createBigTitle(title, html)
			
		}
	}

	this.createBigTitle = function(tlt, html){
		// 
		var title = this.big_title
		title.innerHTML = tlt;

		this.cont_left_btn = createElem('div', 'cont_left_btn', title)

		var btn_help = createElem('div', 'my_btn btn_help', this.cont_left_btn);
		if(html){
			var link = createElem('a', 'link', btn_help);
			link.href = 'http://demo.stagingmonster.com/mpanel_help/source/html/' + html
			link.innerHTML = 'Help';
			link.target = "_blank";
		} else {
			btn_help.innerHTML = 'Help';
			btn_help.classList.add('disabled')
		}
		this.btn_help = btn_help;

	};
	this.emptyPage = function(){
		var elem = createElem('div', 'development', this.cont_body)
		elem.innerHTML = 'Page in development';
	}

	this.createDataId = function(callback){

		var data = {
			"ClientName": "Dimka",
			"ProjectName": "Dimka Save2",
			"ProjectNumber": 3,
			"Quantity": 4,
			"RequestDate": "2017-07-31T14:29:42.3012892+03:00",
			"SailNumber": 6,
			"SailOf": 7,
			"Description": "sample string 8",
			"PorjectNumber": 9,
			"EnteredDate": "2017-07-31T14:29:42.3022891+03:00",
			"EnteredBy": "sample string 10",
			"UnitIndex": 1
		}
		var url =  this.host+dataUrl.project.new_project;
		console.log(url)
		var self = this;
		return $.ajax({
			url: url,
			type: "POST",
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(data),
			success: function(data){
				if(data.data){
					window.localStorage.setItem('mpanel_id', data.data)
					return self.createMaterial(data.data, callback);	
				} else {
					var text = data.error || data.message;
					self.errorTextPreload(text)
				}
				
			}, 
			error: function(e){
				self.errorTextPreload('Problem loading data!', e)
			}
		})
	};
	this.createMaterial = function(id, callback){
		var data = {
			"fabricSelectedIndex": 0,
			"fabricTypeSelectedIndex": 0,
			"fabricColorSelectedIndex": 1,
			"rollWidthText": "1",
			"override": false,
			"warpStretch": 1,
			"weftStretch": 1,
			"warpStretchOverride": 1,
			"weftStretchOverride": 1,
			"hardwareSelectedIndex": 0,
			"hardEdgeTypeSelectedIndex": 1,
			"hardColorSelectedIndex": 0,
			"hemText": "1",
			"hardCornorSelectedIndex": 0,
			"cornerLengthText": "1",
			"cornerWidthText": "1",
			"fitCorner": false,
			"hardLinkSelectedIndex": 0,
			"linkLengthText": "1",
			"thread": "1",
			"accessories": "1",
			"seamText": "1",
			"reoText": "1",
			"poleDiameterText": "1",
			"poleAngle": 1,
			"poleExtraHeight": "1",
			"exampleImageSelectedIndex": 0
		}
		var self = this;
		var url = main.host + dataUrl.material.post.commit + id;

		return $.ajax({
			url: url,
			type: "POST",
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(data),
			success: function(data){
				if(data.data){
					window.localStorage.setItem('mpanel_id', data.data);
					callback(data.data);
				} else {
					//this.errorTextPreload(data.error);
					var text = data.error || data.message
					self.errorTextPreload(text)
				}
			},
			error: function(e){
				console.log('error')
				self.errorTextPreload('Problem loading data!', e)
			}
		})

	}
	this.getDataId = function(){
		return window.localStorage.getItem('mpanel_id')
	}


	this.hintHelp = function(parents, text, w, l){
		var popup = dom.div('popup', parents);

		var cont_popup = dom.div( 'cont_popup', popup );
		dom.text(cont_popup, text)
		return popup
	};

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
			num--;
			if(!num) {
				fun();
			}
		};
		head.appendChild(link);
	}
	function loadFile(){
		var script = document.createElement('script');
		script.src = scripts[s];
		script.type ="text/javascript";
		script.onload = function () {
			num--;
			if(!num) {
				fun();
			} else {
				s++;
				loadFile();
			}
		};

		head.appendChild(script);
	}

	if(!scripts.length && !styles.length){
		fun()
	}

}

function getXmlHttp(){
  var xmlhttp;
  try {
    xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
  } catch (e) {
    try {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } catch (E) {
      xmlhttp = false;
    }
  }
  if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
    xmlhttp = new XMLHttpRequest();
  }
  return xmlhttp;
}



function loadDoc(url, cFunction, eFunction) {
  var xhttp = getXmlHttp();//XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    	cFunction(this);
    } else {
    	eFunction(this)
    }
 };
  xhttp.open("GET", url, true);
  xhttp.send();
}

