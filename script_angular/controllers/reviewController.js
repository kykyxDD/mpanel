mpanelApp.controller("reviewController", ['$http', '$window','$scope', function($h, $w, $s){
	$s.index_model = 0;
	var elem = document.getElementById('threejs');
	var mpanel;
	var parent = $s.$parent;

	$s.$on('child_start', function(event,args){
		$s.$emit('child_finish', args)
	});

	if(!$s.id_project){
		return $s.updatePage(0)
	} 

	if(parent.mpanel){
		mpanel = parent.mpanel;
		// mpanel.viewTop(true);
		mpanel.parent = elem;
		elem.appendChild(mpanel.container);
		mpanel.preloadOpen()
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

	$s.getScreen = function(argument) {
		console.log('getScreen')
		mpanel.getScreen()
	}
	


	function getInfo(){
		// load_file = false
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
				$s.review_error = data.error;
				parent.load_data = false
			}
			
		}, function myError(response) {
			$s.review_error = response.data && response.data.message ? response.data.message : 'Error loading model';
		});
	};
	function loadInfo(data){
		load_file = false
		$s.data_review = data;
		if(!parent.all_data['review']) {
			parent.all_data['review'] = data;
		}

		if(data.objModelName){
			$s.arr_url[0] =  $s.api + $s.folder + data.objModelName;
			$w.localStorage.setItem('mpanel_obj', data.objModelName);
			var texturePath = false;
			if(data.texturePath){
				var arr_url = data.texturePath.split('/');
				texturePath = $s.folder_fabric  + arr_url[arr_url.length-1]; //data.texturePath.;
			}
			mpanel.loadObj($s.arr_url[0], texturePath);
		} else {
			console.log('data.objModelName == null',data.objModelName)
			mpanel.preloadClose()
		}
		parent.load_data = false;
		parent.update_texture = false;

	}

	function updateNumModel(){
		
		if(!mpanel || load_file) return 
		mpanel.loadObj($s.arr_url[$s.index_model]);
	}

	function initInfo(){
		if(parent.all_data['review']){
			if(parent.update_texture){
				getInfo()
			} else {
				loadInfo(parent.all_data['review'])
			}
		} else {
			getInfo()
		}
	}

	initInfo()
}])