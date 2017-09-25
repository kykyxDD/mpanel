var mpanelApp = angular.module("mpanelApp", ['ngRoute', 'pdfjsViewer']);

mpanelApp.controller("mpanelController", ['conts', '$route', '$routeParams', '$location', '$http', '$window','$document', '$scope', function (conts,$r, $rp ,$l, $h, $w, $d, $s) {
	console.log('conts',conts)
	// $s.mpanel_id = 'mpanel_id';
	// $s.mpanel_ip = 'http://192.168.0.119:1234';
	// $s.mpanel_pdf = 'mpanel_pdf';
	$s.id_project = $w.localStorage.getItem(conts.id);
	$s.api = conts.ip + '/api2/'; //api/';
	$s.host = conts.ip + '/';
	$s.host_1 = conts.ip; //'http://192.168.0.119:1234';
	$s.folder = '/mp/modelLoad?fileName=';
	$s.folder_2 = 'mp/modelLoad?fileName=';
	$s.folder_fabric = './data/images/';
	$s.folder_fitting = './data/example/';
	$s.api_material_db = './';
	$s.load_data = false;
	$s.all_data = {};
	$s.data_error = false;
	$s.mpanel = false;
	$s.updateMpanel = false;
	$s.user_page = false;
	$s.pdf_page = false;
	$s.negative = false;
	$s.update_texture = false;
	$s.pageproject_error = false;
	$s.reduction = [
		"m",
		"cm",
		'mm',
		"in",
		"in",
		"in"
	];
	$s.min_edge = 3;
	$s.max_edge = 6;
	var unit = $w.localStorage.getItem(conts.unit);
	$s.id_unit = +unit >= 0 ? +unit : 1; 

	$s.$route = $r;
	$s.$location = $l;
	$s.$routeParams = $rp;

	$s.errorOk = function(){
		$s.data_error = false;
		$s.load_data = false;
		$s.preload_opacity = false;
	}

	$s.id_itm_page = 0;

	$s.$watch('itm_page.id', on_page_change)
	$s.list_menu = [
		{
			text: 'project',
			id: 'project',
			title: 'Project',
			help: 'hs30.htm'
		},{
			text: 'fabric',
			id: 'fabric',
			title: 'Fabric selection',
			help: 'hs40.htm'
		},{
			text: 'fittings',
			id: 'fittings',
			title: "Finish and Fittings",
			help: 'hs40.htm'
		},{
			text: 'shape & size',
			id: 'shape',
			title: 'Shape & Size',
			help: 'hs50.htm'
		},{
			text: 'review',
			id: 'review',
			title: 'Design review - visualisation',
			help: 'hs70.htm'
		},{
			text: 'seams',
			id: 'seams',
			title: 'Seam plan',
			help: 'hs75.htm'
		},{
			text: 'pattern',
			id: 'pattern',
			title: 'Pattern plan',
			help: 'hs80.htm'
		}	
	];

	$s.arr_class = [
		'text_green',
		'text_orange',
		'text_red',
		''
	];

	function on_page_change(){
		var itm = $s.itm_page;
		var l_path = $l.path().replace('/', '');
		if(itm){
			$s.id_itm_page = itm.id ? $s.list_menu.indexOf(searchListPage(itm.id)) : 0;	
			$w.document.title = itm.title;
			if(itm.id != l_path){
				$l.path('/'+itm.id)
			}
		}
	}
	
	$s.loadExample = function(){
		$s.$$childTail.loadExampleShape()
	}
	
	$s.resetData = function(){
		$s.$$childTail.resetDataShape()
	}

	$s.searchListPage = searchListPage;

	function searchListPage(page){
		var itm_page
		for(var i = 0; i < $s.list_menu.length; i++){
			var itm = $s.list_menu[i];
			if(page && page == itm.id){
				itm_page = itm
			}
		}
		return itm_page
	}
	$s.saveProject = function(){
		console.log('saveProject')

		if(!$s.id_project) return
		var id = $s.id_project;
		var url = $s.api + dataUrl.saveToFile+id;
		

		return $h({
			method : "post",
			url : url
		}).then(function mySuccess(response) {
			var data = response.data
			if(!data.error){
				downFile(data)
			} else {

			}
		}, function myError(response) {
			var txt = response.data && response.data.message ? response.data.message : 'Error loading model';

			$s.pdf.error = txt
		});
	}

	function downFile(text){
		if(!text) return

		console.log(text)
		var type = "text/plain;charset=utf-8"

		var file = new Blob([text], {type: type});
		if (window.navigator.msSaveOrOpenBlob){ 
			window.navigator.msSaveOrOpenBlob(file, filename);
		} else { // Others
			var a = document.createElement("a"),
				url = URL.createObjectURL(file);
			a.href = url;
			a.download = conts.file;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);  
		}
	}

	$s.updatePage = function(index){
		var obj = $s.list_menu[index];
		
		updateItmPage(obj);
	}

	$s.$on('child_finish',function(event, fun){
		if(fun){
			updateObj(fun)
		}
	})
	function updateObj(obj){
		if(!$s.data_error){
			$s.itm_page = obj;
			$s.load_data = false
		}
	}

	$s.$on('$locationChangeSuccess', function() {
		var path = $l.path().replace('/', '');
		if($s.itm_page && path != $s.itm_page.id){
			var obj = searchListPage(path)
			if(obj){
				updateObj(obj)
			}
		}
	});


	function updateItmPage(obj, index){

		if(obj == $s.itm_page && !$s.user_page && !$s.home_page) return
		if(obj.id == 'pattern' && !$s.all_data['pattern']) return

		$s.load_data = true;
		$s.$broadcast('child_start', obj );

	}

	$s.backPage = function(){
		var obj = $s.list_menu[$s.id_itm_page-1]
		if(obj){
			updateItmPage(obj, -1)
		}
	}
	$s.nextPage = function(){
		var obj
		if($s.user_page){
			$s.id_itm_page = 0;
			obj = $s.list_menu[0]
		} else {
			obj = $s.list_menu[$s.id_itm_page+1]
		}
		
		if(obj){
			updateItmPage(obj, 1)
		}
	}

	initMain()

	function initMain(){
		var mpanel_obj = true
		if($s.id_project){
			var mpanel_obj = $w.localStorage.getItem('mpanel_obj')

			if(mpanel_obj){
				var url =  $s.api + dataUrl.getIsFileExist.get + mpanel_obj;
				$h({
					method : "get",
					url : url
				}).then(function mySuccess(response) {
					var data = response.data
					if(!data.error){
						loadStartPage(response.data.data);
					} else {
						loadStartPage(false);
					}
				}, function myError(response) {
					loadStartPage(false);
				});
			} else {
				loadStartPage(mpanel_obj);
			}
		} else {
			loadStartPage(mpanel_obj);
		}
		
	}
	function loadStartPage(obj_files){
		var search = $l.path().replace('/', '');

		if(search != ''){
			var obj = searchListPage(search);
			if(obj){
				var index = $s.list_menu.indexOf(obj);
				if(index > 0 && !$s.id_project){
					obj = $s.list_menu[0];
				} else {
					if(!obj_files && index > 3){
						obj = $s.list_menu[3];
					} else if(index == $s.list_menu.length-1 && !$s.all_data['pattern']){
						obj = $s.list_menu[$s.list_menu.length-2];
					}
				}
				$s.itm_page = obj;
			}
		}
	}
}]);