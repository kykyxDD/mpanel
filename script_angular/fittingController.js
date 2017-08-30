mpanelApp.controller("fittingController", ['$http', '$window','$scope', function($h, $w, $s){
	$s.$parent.load_data = true;

	$s.destroy = function(start){
		if(start){
			return postInfo()
		}
		return false
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
	var parent = $s.$parent;
	$s.$watch('all_data.material', on_page_change)

	function on_page_change(){
		$s.data_fitting = $s.all_data['material']
	}

	$s.changeSelect = function(name) {
		postInfo(name);
	}
	if($s.all_data['material']) {
		$s.data_fitting = $s.all_data['material'];
		$s.$parent.load_data = false;
	} else {
		getInfo().then(function(){
			parent.load_data = false;
		})
	}
	function pullDataPage(){
		// console.log('pullDataPage', $s.data_fitting)

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
		var url = $s.host; 
		var id = $s.id_project;
		if(typeof sel == 'string'){
			parent.preload_opacity = true;
			url += dataUrl.material.post.selectChange+id+ '&selectType='+sel;

		} else {
			url += dataUrl.material.post.commit+id;
		}
		var data = getData();

		return $h({
			method : "post",
			data: data,
			url : url
		}).then(function mySuccess(response) {
			var data = response.data
			if(!data.error){
				if(typeof data.data == 'string'){
					$w.localStorage.setItem('mpanel_id', data.data)
				} else {
					parent.preload_opacity = false;
					$s.all_data['material'] = data.data;
					$s.data_fitting = data.data;
				}
			} else {
				parent.data_error = data.error
			}
		}, function myError(response) {
			parent.data_error =  response.data.message;
		});
	}

	function getInfo(){
		var id = $s.id_project;
		var url = $s.host + dataUrl.material.get+id;//dataUrl.project.new_project;
		return $h({
			method : "get",
			url : url
		}).then(function mySuccess(response) {
			var data = response.data
			if(!data.error){
				$s.all_data['material'] = data.data;
				$s.data_fitting = data.data;
			} else {
				parent.data_error = data.error
			}
		}, function myError(response) {
			parent.data_error = response.data.message
		});
	}

}])