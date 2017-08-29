mpanelApp.controller("fittingController", ['$http', '$window','$scope', function($h, $w, $s){
	// $s.$on("$destroy", function() {
	// 	console.log('farbicController destroy')
	// 	postInfo()
	// });
	if(!$s.id_project){
		return $s.updatePage(0)
	} else {
		$s.destroy = function(start){
			if(start){
				return postInfo()
			}
			return false
		}
	}
	$s.data_fitting = {};
	var del_key = [
		'exampleImageBase64',
		"hardwareItems",
		"hardEdgeTypeItems",
		"hardColorItems",
		"hardCornorItems",
		"hardLinkItems",
		"exampleImageItems",
		"fabricItems",
		"fabricTypeItems",
		"fabricColorItems",
		'fabricImageBase64'
	]
	$s.$watch('all_data.material', on_page_change)

	function on_page_change(){
		$s.data_fitting = $s.all_data['material']
	}

	$s.changeSelect = function(name) {
		console.log('fitting',name)
		postInfo(name)
	}
	if($s.all_data['material']) {
		$s.data_fitting = $s.all_data['material'];
	} else {
		getInfo().then(function(){
			pullDataPage()
		})
	}
	function pullDataPage(){
		console.log('pullDataPage', $s.data_fitting)

	}

	function getData(argument) {
		var data = {};
		var data_fitting = $s.data_fitting;

		for(var key in data_fitting){
			if(del_key.indexOf(key) == -1){
				var itm = data_fitting[key]
				data[key] = itm
				$s.all_data['material'][key] = itm
			}
		}

		// hardwareSelectedIndex
		// hardEdgeTypeSelectedIndex
		// hardColorSelectedIndex
		// exampleImageSelectedIndex
		// hardCornorSelectedIndex

		if(typeof data.hardwareSelectedIndex == 'string'){
			var id = data_fitting.hardwareItems.indexOf(data.hardwareSelectedIndex)
			if(id >= 0){
				data.hardwareSelectedIndex = id //data_fitting.hardwareItems.indexOf(data.hardwareSelectedIndex);
				$s.all_data['material'].hardwareSelectedIndex = id//data_fitting[key]
			}
		}
		if(typeof data.hardEdgeTypeSelectedIndex == 'string'){
			var id = data_fitting.hardEdgeTypeItems.indexOf(data.hardEdgeTypeSelectedIndex)
			if(id >= 0){
				data.hardEdgeTypeSelectedIndex = id; //data_fitting.hardEdgeTypeItems.indexOf(data.hardEdgeTypeSelectedIndex);
				$s.all_data['material'].hardEdgeTypeSelectedIndex = id; //data.hardEdgeTypeSelectedIndex//data_fitting[key]
			}
		}
		if(typeof data.hardColorSelectedIndex == 'string'){
			var id = data_fitting.hardColorItems.indexOf(data.hardColorSelectedIndex)
			if(id >= 0){
				data.hardColorSelectedIndex = id //data_fitting.hardColorItems.indexOf(data.hardColorSelectedIndex);
				$s.all_data['material'].hardColorSelectedIndex = id // data.hardColorSelectedIndex//data_fitting[key]
			}
		}

		if(typeof data.exampleImageSelectedIndex == 'string'){
			var id = data_fitting.exampleImageItems.indexOf(data.exampleImageSelectedIndex)
			if(id >= 0){
				data.exampleImageSelectedIndex = id //data_fitting.hardwareItems.indexOf(data.hardwareSelectedIndex);
				$s.all_data['material'].exampleImageSelectedIndex = id//data_fitting[key]
			}
		}
		if(typeof data.hardCornorSelectedIndex == 'string'){
			var id = data_fitting.hardCornorItems.indexOf(data.hardCornorSelectedIndex)
			if(id >= 0){
				data.hardCornorSelectedIndex = id; //data_fitting.hardEdgeTypeItems.indexOf(data.hardEdgeTypeSelectedIndex);
				$s.all_data['material'].hardCornorSelectedIndex = id; //data.hardEdgeTypeSelectedIndex//data_fitting[key]
			}
		}

		return data
	}


	function postInfo(sel) {
		var url = $s.host; //main.host + dataUrl.material.post.selectChange+id; 
		var id = $s.id_project;
		// var url = $s.host + dataUrl.material.get+id;
		if(typeof sel == 'string'){
			// this.new_page = false
			url += dataUrl.material.post.selectChange+id+ '&selectType='+sel;
		} else {
			// this.new_page = true
			url += dataUrl.material.post.commit+id;
		}
		var data = getData();


		return $h({
			method : "post",
			data: data,
			url : url
		}).then(function mySuccess(response) {
			console.log('getInfo', response)
			// $scope.myWelcome = response.data;
			var data = response.data
			if(!data.error){
				if(typeof data.data == 'string'){
					$w.localStorage.setItem('mpanel_id', data.data)
				} else {
					$s.all_data['material'] = data.data;
					$s.data_fitting = data.data;
				}
				
				
			} else {
				console.lgo('data error')
				$s.data_error = data.error
			}
		}, function myError(response) {
			console.log('getInfo myError', response)
			// $s.all_data['project'] 
			// $scope.myWelcome = response.statusText;
		});
	}

	function getInfo(){
		var id = $s.id_project;
		var url = $s.host + dataUrl.material.get+id;//dataUrl.project.new_project;
		console.log('url', url)
		return $h({
			method : "get",
			url : url
		}).then(function mySuccess(response) {
			// console.log('getInfo', response)
			// $scope.myWelcome = response.data;
			var data = response.data
			if(!data.error){
				$s.all_data['material'] = data.data;
				$s.data_fitting = data.data;
				// $s.id_unit = $s.data_fitting.unitIndex; //1;
				//$w.localStorage.setItem('mpanel_unit', $s.id_unit);
			} else {
				$s.data_error = data.error
			}
			
		}, function myError(response) {
			console.log('getInfo myError', response)
			// $scope.myWelcome = response.statusText;
			$s.data_error = response.data.message
		});
	}

	
}])