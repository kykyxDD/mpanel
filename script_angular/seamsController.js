mpanelApp.controller("seamsController", ['$http', '$window','$scope', function($h, $w, $s){

	var elem = document.getElementById('threejs');
	var mpanel
	// $s.$parent.load_data = true;
	var mpanel_obj = $w.localStorage.getItem('mpanel_obj');
	var parent = $s.$parent;

	parent.load_data = true

	$s.data_seams = {		
		warpIndex: 0,
		tagIndex: 0
	}

	$s.item_seams = {
		nPanels: [1]
	}
	$s.index_panel = 0
	$s.pattern_error = false;
	$s.data_pattern = {
		
	}

	parent.noUpdateMpanel = true
	var timeout

	if(parent.mpanel){
		mpanel = $s.mpanel;
		mpanel.parent = elem;
		mpanel.preloadOpen()
		elem.appendChild(mpanel.container);
		mpanel.updateMaterial(true);
		mpanel.onWindowResize();
		mpanel.viewTop(true);
		mpanel.preloadClose();
	} else {
		mpanel = new MpanelViewer(elem);
		parent.mpanel = mpanel;
		
		if(mpanel_obj){
			var url = $s.host + $s.folder + mpanel_obj;
			mpanel.loadObj(url, false, true);
			mpanel.viewTop(true);
		}
	}

	
	$s.prevPanels = function(){
		if($s.index_panel == 0) return

		$s.index_panel--
	}
	$s.nextPanels = function(){
		if($s.index_panel == $s.item_seams.nPanels.length-1) return

		$s.index_panel++
	}

	$s.getMake = function(){

		var id = $s.id_project;
		var data = {
			objFileName: $s.item_seams.objModelName,
			selectedPanel: $s.index_panel,
			selectedTag: $s.data_seams.warpIndex,
			selectedWarp: $s.data_seams.tagIndex
		}
		var url = $s.host + dataUrl.seams.post+id;
		$s.load_pattern = true
		// console.log('data',data)
		return $h({
			method : "post",
			data: data,
			url : url
		}).then(function mySuccess(response) {
			// console.log('getInfo', response)
			var data = response.data
			if(!data.error){
				loadPattern(data.data)
			} else {
				$s.pattern_error = data.error

			}
			$s.load_pattern = false
			
		}, function myError(response) {
			$s.load_pattern = false
			$s.pattern_error = response.data.message;
		});
	}

	if(parent.all_data['review']){
		//$s.item_seams = parent.all_data['review'];
		loadInfo(parent.all_data['review'])
	} else {
		getInfo()
	}
	function loadPattern(data){
		parent.all_data['pattern'] = data;
		$s.data_pattern = data;
	}

	function getInfo(){
		// load_file = false
		if(!$s.id_project) return
		var id = $s.id_project;
		var url = $s.host + dataUrl.calculate.post+id;
		// console.log('url', url)
		return $h({
			method : "post",
			url : url
		}).then(function mySuccess(response) {
			var data = response.data
			if(!data.error){
				loadInfo(data.data)
			} else {
				$s.pattern_error = data.error;
				parent.load_data = false
			}
			
		}, function myError(response) {
			$s.pattern_error = response.data.message;
		});
	};

	function loadInfo(data){
		$s.item_seams = data;
		parent.all_data['review'] = data;

		parent.load_data = false

		if(data.objModelName != mpanel_obj){
			console.log(data.objModelName)
			var url = $s.host + $s.folder + data.objModelName;
			mpanel.loadObj(url, false, true);
			mpanel.viewTop(true);
		}

		$s.getMake();
	}

}]);