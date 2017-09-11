mpanelApp.controller("seamsController", ['$http', '$window','$scope', function($h, $w, $s){

	var elem = document.getElementById('threejs');
	var mpanel
	// $s.$parent.load_data = true;
	// var mpanel_obj = $w.localStorage.getItem('mpanel_obj');
	var parent = $s.$parent;

	parent.load_data = true

	$s.data_seams = {		
imageModelName: ''
	}


	$s.$on('child_start', function(event,args){
		$s.$emit('child_finish', args)
	})

	$s.item_seams = {
		nPanels: [1],
		index_panel: 0,
		warpIndex: 0,
		tagIndex: 0
	}
	$s.index_panel = 0
	$s.pattern_error = false;
	$s.data_pattern = {
		
	}

	parent.noUpdateMpanel = true
	var timeout

	/*if(parent.mpanel){
		mpanel = $s.mpanel;
		mpanel.parent = elem;
		mpanel.preloadOpen()
		elem.appendChild(mpanel.container);
		mpanel.updateMaterial(true);
		mpanel.onWindowResize();
		// mpanel.viewTop(true);
		mpanel.preloadClose();
	} else {
		mpanel = new MpanelViewer(elem);
		parent.mpanel = mpanel;
		
		if(mpanel_obj){
			var url = $s.host + $s.folder + mpanel_obj;
			mpanel.loadObj(url, false, true);
			// mpanel.viewTop(true);
		}
	}*/

	
	$s.prevPanels = function(){
		if($s.item_seams.index_panel == 0) return

		$s.item_seams.index_panel--;
	}
	$s.nextPanels = function(){
		if($s.item_seams.index_panel == $s.item_seams.nPanels.length-1) return

		$s.item_seams.index_panel++;
	}

	$s.getMake = function(){

		var id = $s.id_project;
		var data = {
			objFileName: $s.item_seams.objModelName,
			selectedPanel: $s.item_seams.index_panel,
			selectedTag: $s.item_seams.tagIndex,
			selectedWarp: $s.item_seams.warpIndex
		}
		// console.log(data)

		var url = $s.host + dataUrl.seams.post+id;
		$s.load_pattern = true;

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
			//$s.pattern_error = response.data.message;
			$s.pattern_error = response.data && response.data.message ? response.data.message : 'Error loading model';

		});
	};

	function loadInfo(data){
		$s.item_seams = data;
		parent.all_data['review'] = data;

		parent.load_data = false;
		if(data.index_panel >= 0){
			$s.item_seams.index_panel = data.index_panel;
		} else {
			$s.item_seams.index_panel = 0;
		} 

		if(data.warpIndex>=0){

		} else {
			$s.item_seams.warpIndex = 0
		}
		if(data.tagIndex>=0){

		} else {
			$s.item_seams.tagIndex = 0
		}

		// if(data.objModelName != mpanel_obj){
			// console.log(data.objModelName)
			// var url = $s.host + $s.folder + data.objModelName;
			// mpanel.loadObj(url, false, true);
			// mpanel.viewTop(true);
		// }

		if(parent.all_data['pattern']){
			$s.data_pattern = parent.all_data['pattern'];
		}
	}

}]);