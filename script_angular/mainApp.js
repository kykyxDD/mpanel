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
		"inches",
		"ft inches",
		"ft inches and fractions",
	];
	$s.min_edge = 3;
	$s.item_num = 3
	$s.max_edge = 6;
	var unit = $w.localStorage.getItem('mpanel_unit');
	$s.id_unit = +unit >= 0 ? +unit : 1; //1;
	console.log($s.id_unit)


	$s.$route = $r;
	$s.$location = $l;
	$s.$routeParams = $rp;
	// console.log($r, $l, $rp)

	$s.errorOk = function(){
		$s.data_error = false
		$s.load_data = false
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

	function on_page_change(){
		console.log('on_page_change');
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
		
				// updateItmPage(obj)
			} 
			$s.itm_page = obj;
		}
		
	}

	$s.loadExample = function(){
		// console.log('loadExample',$s)
		$s.$$childTail.loadExampleShape()
	}
	
	$s.resetData = function(){
		// console.log('resetData',$s)
		$s.$$childTail.resetDataShape()
	}



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
		console.log('index', index)
		var obj = $s.list_menu[index];
		
		updateItmPage(obj)
		// $s.itm_page = obj;
	}

	function updateItmPage(obj){
		console.log('updateItmPage', obj == $s.itm_page)
		if(obj == $s.itm_page && !$s.user_page) return

		if($s.$$childTail && $s.$$childTail.destroy) {
			console.log(true)
			$s.load_data = true
			$s.$$childTail.destroy(true).then(function(){
				console.log(true, $s.data_error)
				if(!$s.data_error){
					$s.itm_page = obj;
					$s.load_data = false	
				}
				
			// }).then(function(){
				// $s.load_data = false
			});
		} else {
			console.log(false)
			$s.itm_page = obj;
		}
		
	}

	$s.backPage = function(){
		var obj = $s.list_menu[$s.id_itm_page-1]
		if(obj){
			updateItmPage(obj)
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
			updateItmPage(obj)
		}
		
		// $s.itm_page = $s.list_menu[$s.id_itm_page+1]
	}

	$s.createDataId = function(){
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
		var url = $s.host+dataUrl.project.new_project;
		console.log(url)
		var self = this;

		return $h({
		    method : "POST",
		    url : url,
			data: data//"welcome.htm"
		}).then(function mySuccess(response) {
			// console.log('mySuccess', response)
			var data = response.data
			if(!data.error){
				// console.log('data',data.data)
				$s.id_project = data.data;
				$w.localStorage.setItem('mpanel_id', data.data);
				// parent.updateMpanel = true
			} else {
				console.lgo('data error')
				$s.data_error = data.error

			}
		    // $scope.myWelcome = response.data;
		    	
		}, function myError(response) {
			console.log('myError', response)
		    // $scope.myWelcome = response.statusText;
		    $s.data_error = data.error
		});
	}

	$s.createMaterialId = function(){
		var id = $s.id_project// main.getDataId();
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

		var url = $s.host + dataUrl.project.new_project + $s.id_project;;

		
		return $h({
		    method : "POST",
		    url : url,
			data: data//"welcome.htm"
		}).then(function mySuccess(response) {
			// console.log('mySuccess', response)
			var data = response.data
			if(!data.error){
				// console.log('data',data.data)
				$s.id_project = data.data;
				$w.localStorage.setItem('mpanel_id', data.data);
				// parent.updateMpanel = true
			} else {
				console.lgo('data error')
				$s.data_error = data.error

			}
		    // $scope.myWelcome = response.data;
		    	
		}, function myError(response) {
			console.log('myError', response)
		    // $scope.myWelcome = response.statusText;
		    $s.data_error = data.error
		});
		
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
