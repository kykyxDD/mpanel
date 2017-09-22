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
		if($s.item_seams.selectedNPanels == 0) return

		$s.item_seams.selectedNPanels--;
		$s.updateSeams()
	}
	$s.nextPanels = function(){
		if($s.item_seams.selectedNPanels == $s.item_seams.nPanels.length-1) return

		$s.item_seams.selectedNPanels++;
		$s.updateSeams()
	}

	$s.getMake = function(){
		var id = $s.id_project;
		var data = {
			objFileName: $s.item_seams.objModelName,
			selectedPanel: $s.item_seams.selectedNPanels,
			selectedTag: $s.item_seams.selectedTagCorner,
			selectedWarp: $s.item_seams.selectedWarpDir
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

	$s.updateSeams = function(){
		console.log('updateSeams')
		delete parent.all_data['pattern']
		$s.data_pattern = false

		updateInfo()
	}

	if(parent.all_data['review']){
		loadInfo(parent.all_data['review'])
	} else {
		getInfo()
	}
	function loadPattern(data){
		parent.all_data['pattern'] = data;
		$s.data_pattern = data;
		$s.load_pattern = false
		$s.pattern_error = false
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

		if(data.objModelName){
			//data.objModelName
			$w.localStorage.setItem('mpanel_obj', data.objModelName);
		}

		parent.load_data = false;

		console.log(data)
		

		if(parent.all_data['pattern']){
			$s.data_pattern = parent.all_data['pattern'];
		}
		
		// img.load()
		loadImage(data.imageModelName)
		
	}

	function loadImage(src){
		$s.load_img = true
		//var src = data.imageModelName;
		var img = new Image();
		img.crossOrigin = "anonymous";
		img.src = $s.api + $s.folder + src
		$s.src = img.src
		img.onload = function(){
			// setTimeout(function(){
				$s.src_imageModelName = $s.src//getBase64Image(this)
				$s.load_img = false
				$s.$apply()	
			// },1000)
			
		}
	}

	function updateInfo(argument) {
		if(!$s.id_project) return
		var id = $s.id_project;
		var url = $s.api + dataUrl.calculate.update+id;
		var data = {
			objFileName: $s.item_seams.objModelName,
			selectedPanel: $s.item_seams.selectedNPanels,
			selectedTag: $s.item_seams.selectedTagCorner,
			selectedWarp: $s.item_seams.selectedWarpDir
		}
		return $h({
			method : "post",
			data: data,
			url : url
		}).then(function mySuccess(response) {
			var data = response.data
			if(!data.error){
				$s.seams_error = false
				$s.src_imageModelName = '';
				loadImage($s.item_seams.imageModelName)
			} else {
				$s.seams_error = data.error;
				parent.load_data = false
			}
			
		}, function myError(response) {
			$s.seams_error = response.data && response.data.message ? response.data.message : 'Error loading model';
		});
	}
	function getBase64Image(img) {
	    var canvas = document.createElement("canvas");
	    canvas.width = img.width;
	    canvas.height = img.height;

	    var ctx = canvas.getContext("2d");
	    ctx.drawImage(img, 0, 0);

	    var dataURL = canvas.toDataURL("image/png");

	    return dataURL
	}
}]);