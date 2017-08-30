mpanelApp.controller("seamsController", ['$http', '$window','$scope', function($h, $w, $s){

	var elem = document.getElementById('threejs');
	var mpanel
	// $s.$parent.load_data = true;
	var mpanel_obj = $w.localStorage.getItem('mpanel_obj');

	$s.data_seams = {
		list: [],
		warp: [
		'Vertical',
		'Horizontal'
		],
		warpIndex: 0,
		tag: [
			'A',
			'B',
			'C',
			'D'
		],
		tagIndex: 0
	}

	$s.$parent.all_data['seams'] = {};

	$s.$parent.noUpdateMpanel = true
	var timeout

	if($s.$parent.mpanel){
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
		$s.$parent.mpanel = mpanel;
		
		if(mpanel_obj){
			var url = $s.host + $s.folder + mpanel_obj;
			mpanel.loadObj(url, false, true);
			mpanel.viewTop(true);
		}
	}

}]);