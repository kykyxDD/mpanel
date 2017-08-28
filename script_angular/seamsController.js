mpanelApp.controller("seamsController", ['$http', '$window','$scope', function($h, $w, $s){

	var elem = document.getElementById('threejs');
	var mpanel

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

	if($s.$parent.mpanel){
		mpanel = $s.mpanel;
		mpanel.parent = elem;
		elem.appendChild(mpanel.container);
		mpanel.updateMaterial(true);
		mpanel.onWindowResize();
		mpanel.viewTop();
	} else {
		mpanel = new MpanelViewer(elem);
		$s.$parent.mpanel = mpanel;
		var mpanel_obj = $w.localStorage.getItem('mpanel_obj')
		if(mpanel_obj){
			var url = $s.host + $s.folder + mpanel_obj;
			mpanel.loadObj(url, false, true);
			mpanel.viewTop();
		}
	}

}]);