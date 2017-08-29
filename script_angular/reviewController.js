mpanelApp.controller("reviewController", ['$http', '$window','$scope', function($h, $w, $s){
	$s.index_model = 0;
	var elem = document.getElementById('threejs');
	var mpanel
	var parent = $s.$parent;
	$s.$parent.load_data = true;

	if(!$s.id_project){
		return $s.updatePage(0)
	} else if(parent.mpanel){
		mpanel = parent.mpanel;
		mpanel.parent = elem;
		elem.appendChild(mpanel.container);
		// mpanel.parent = elem;
		mpanel.onWindowResize()
		mpanel.updateMaterial(false);
	} else {
		mpanel = new MpanelViewer(elem);
		parent.mpanel = mpanel;
	}

	var load_file = true;



	$s.arr_url = [
		'./data/MPSD2.obj'
		//,
		//	'./data/as2.obj'
	];
	// $s.$watch('index_model', updateNumModel);

	$s.data_review = {
		messages: [],
		messageTypes: []
	}
	$s.arr_class = [
		'text_green',
		'text_orange',
		'text_red',
		''
	]

	if(parent.all_data['review'] && !parent.updateMpanel){
		loadInfo(parent.all_data['review'])
	} else {
		getInfo()
	}

	$s.editNumModel = function(num){
		if(num != $s.index_model){
			$s.index_model = num
		}
	}

	

	$s.isometricClick = function(){
		mpanel.viewIsometric();
	}
	$s.rightClick = function(){
		mpanel.viewRight();
	}
	$s.frontClick = function(){
		mpanel.viewFront();
	}
	$s.topClick = function(){
		mpanel.viewTop();
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
			// console.log('getInfo', response)
			// $scope.myWelcome = response.data;
			var data = response.data
			if(!data.error){
				
				loadInfo(data.data)
			} else {
				//parent.data_error = data.error
				$s.review_error = data.error;
			}
			
		}, function myError(response) {
			// console.log('getInfo myError', response)
			$s.review_error = response.data.message;
		});
	};
	function loadInfo(data){
		load_file = false
		$s.data_review = data;
		if(!parent.all_data['review']) {
			parent.all_data['review'] = data;
		}
		

		if(data.objModelName && !parent.noUpdateMpanel){
			$s.arr_url[0] =  $s.host + $s.folder + data.objModelName;
			$w.localStorage.setItem('mpanel_obj', data.objModelName)

			mpanel.loadObj($s.arr_url[0]);
		}
		parent.updateMpanel = false;
		parent.noUpdateMpanel = false

		$s.$parent.load_data = false

	}

	function updateNumModel(){
		
		if(!mpanel || load_file) return 
		mpanel.loadObj($s.arr_url[$s.index_model]);
	}
}])