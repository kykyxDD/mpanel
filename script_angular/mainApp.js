var mpanelApp = angular.module("mpanelApp", ['ngRoute']);

mpanelApp.controller("mpanelController", ["appState",'navigation', '$route', '$routeParams', '$location', '$http', '$window','$document', '$scope', function (state, nav, $r, $rp ,$l, $h, $w, $d, $s) {
	$s.id_project = $w.localStorage.getItem('mpanel_id')
	console.log($s.id_project)
	$s.host = 'http://192.168.0.119:1234/';
	$s.folder = 'api/mp/modelLoad?fileName=';
	$s.load_data = false;
	$s.all_data = {};
	$s.data_error = false;
	$s.mpanel = false;
	$s.updateMpanel = false;
	$s.user_page = false;
	$s.negative = false
	$s.reduction = [
		"m",
		"cm",
		'mm',
		"in",
		"in",
		"in"
	];
	$s.min_edge = 3;
	// $s.item_num = 3
	$s.max_edge = 6;
	var unit = $w.localStorage.getItem('mpanel_unit');
	$s.id_unit = +unit >= 0 ? +unit : 1; //1;
	// console.log($s.id_unit)


	$s.$route = $r;
	$s.$location = $l;
	$s.$routeParams = $rp;
	// console.log($r, $l, $rp)

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
			title: 'Pattern plane',
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
		// console.log('on_page_change');
		var itm = $s.itm_page;
		if(itm){
			$s.id_itm_page = itm.id ? $s.list_menu.indexOf(searchListPage(itm.id)) : 0;	
			$w.document.title = itm.title
			$l.path('/'+itm.id)
		}
	}
	var search = nav.page();

	if(search != ''){
		var obj = searchListPage(search);
		if(obj){
			var index = $s.list_menu.indexOf(obj) 
			if(index > 0 && !$s.id_project){
				obj = $s.list_menu[0];
			} else if(index == $s.list_menu.length-1 && !$s.all_data['pattern']){
				obj = $s.list_menu[$s.list_menu.length-2];
			}
			$s.itm_page = obj;
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



	$s.updatePage = function(index){
		var obj = $s.list_menu[index];
		
		updateItmPage(obj);
	}

	function updateItmPage(obj, index){

		if(obj == $s.itm_page && !$s.user_page && !$s.home_page) return
		if(obj.id == 'pattern' && !$s.all_data['pattern']) return

		if(index > 0){
			if($s.$$childTail && $s.$$childTail.destroy) {
				$s.load_data = true
				$s.$$childTail.destroy(true).then(function(){
					if(!$s.data_error){
						$s.itm_page = obj;
						$s.load_data = false
					}
				});
			} else {
				$s.itm_page = obj;
			}
		} else {
			$s.itm_page = obj;
		}
		
	}

	$s.backPage = function(){
		var obj = $s.list_menu[$s.id_itm_page-1]
		if(obj){
			updateItmPage(obj, -1)
		}
		
		// $s.itm_page = $s.list_menu[$s.id_itm_page-1]
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
		
		// $s.itm_page = $s.list_menu[$s.id_itm_page+1]
	}

}])
.service('navigation', ['$location', function($l) {
    return {
        
        page: function() {
            var path = $l.path()
            if (path == "") {
                return ""
            }
            else {
                var parts = path.split("?")[0].split("/")
                parts.shift()
                return parts[0]
            }
        },
        
        params: function(match) {
            var parts = $l.path().split("?")[0].split("/")
            parts.shift()
            if (parts.length > 1) {
                return parts.splice(1)
            }
            return ""
        },
        params1: function(queryString){
        	queryString = queryString ? queryString : window.location.search;
			queryString = queryString.substring(1);
			var params = {}, queries, temp, i, l;
			queries = queryString.split("&");
			for ( i = 0, l = queries.length; i < l; i++ ) {
				temp = queries[i].split('=');
				params[temp[0]] = temp[1];
			}
			return params;
        } 
        
    }
}])