mpanelApp.controller("seamsController", ['$http', '$window', '$scope', function($h, $w, $s){

	if($w.location.hash.indexOf('seams') == -1) {
		return false
	}

	var parent = $s.$parent;
	parent.load_data = true;

	$s.data_seams = {}

	$s.$on('child_start', function(event,args){
		$s.$emit('child_finish', args)
	});

	$s.item_seams = {
		nPanels: [1],
		index_panel: 0,
		warpIndex: 0,
		tagIndex: 0
	};
	$s.index_panel = 0
	$s.pattern_error = false;
	$s.seams_error = false;
	$s.data_pattern = {}

	parent.noUpdateMpanel = true;
	
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

		var url = $s.api + dataUrl.seams.post+id;
		$s.load_pattern = true;

		return $h({
			method : "post",
			data: data,
			url : url
		}).then(function mySuccess(response) {
			var data = response.data
			if(!data.error){
				loadPattern(data.data)
			} else {
				$s.pattern_error = data.error;
			}
			$s.load_pattern = false
			
		}, function myError(response) {
			$s.load_pattern = false
			$s.pattern_error = response.data.message;
		});
	}

	if(parent.all_data['review']){
		loadInfo(parent.all_data['review'])
	} else {
		getInfo()
	}
	function loadPattern(data){
		parent.all_data['pattern'] = data;
		$s.data_pattern = data;
	}

	function getInfo(){
		// console.log('getInfo')
		if(!$s.id_project) return
		var id = $s.id_project;
		var url = $s.api + dataUrl.calculate.post+id;
		return $h({
			method : "post",
			url : url
		}).then(function mySuccess(response) {
			var data = response.data
			if(!data.error){
				loadInfo(data.data)
			} else {
				$s.seams_error = data.error;
				parent.load_data = false
			}
			
		}, function myError(response) {
			$s.seams_error = response.data && response.data.message ? response.data.message : 'Error loading model';

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

		if(parent.all_data['pattern']){
			$s.data_pattern = parent.all_data['pattern'];
		}
	}

}]);