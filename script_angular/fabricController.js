
mpanelApp.controller("fabricController", ['$http', '$window','$scope', function($h, $w, $s){
	$s.$parent.load_data = true;
	var parent = $s.$parent;

	$s.destroy = function(start){
		if(start){
			return postInfo();
		} 
		return false
	}

	// $s.destroy
	$s.data_fabric = {};
	// $s.str = $s.reduction[$s.id_unit];
	$s.model_fabric = {
		supplier: false,
		type: false,
		color: false
	}
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

	$s.changeSelect = function(name) {
		// console.log('fabric',name)
		postInfo(name)
	}
	if(parent.all_data['material']) {

		$s.data_fabric = parent.all_data['material'];
		$s.$parent.load_data = false;
	} else {
		getInfo().then(function(){
			parent.load_data = false
		})
	}


	function getData(argument) {
		var data = {};
		var data_fabric = $s.data_fabric;
		var model = $s.model_fabric;

		for(var key in data_fabric){
			if(del_key.indexOf(key) == -1){
				data[key] = data_fabric[key]
				parent.all_data['material'][key] = data_fabric[key]
			}
		}

		// if(typeof data.fabricSelectedIndex == 'string'){
		// 	var id = data_fabric.fabricItems.indexOf(data.fabricSelectedIndex)
		// 	if(id >= 0){
		// 		data.fabricSelectedIndex = data_fabric.fabricItems.indexOf(data.fabricSelectedIndex);
		// 		parent.all_data['material'].fabricSelectedIndex =  data.fabricSelectedIndex;
		// 	}
		// }
		// if(typeof data.fabricTypeSelectedIndex == 'string'){
		// 	var id = data_fabric.fabricTypeItems.indexOf(data.fabricTypeSelectedIndex)
		// 	if(id >= 0){
		// 		data.fabricTypeSelectedIndex = data_fabric.fabricTypeItems.indexOf(data.fabricTypeSelectedIndex);
		// 		parent.all_data['material'].fabricTypeSelectedIndex =  data.fabricTypeSelectedIndex;
		// 	}

		// }
		// if(typeof data.fabricColorSelectedIndex == 'string'){
		// 	var id = data_fabric.fabricColorItems.indexOf(data.fabricColorSelectedIndex)
		// 	if(id >= 0){
		// 		data.fabricColorSelectedIndex = data_fabric.fabricColorItems.indexOf(data.fabricColorSelectedIndex);
		// 		parent.all_data['material'].fabricColorSelectedIndex =  data.fabricColorSelectedIndex;
		// 	}

		// }

		console.log(data.fabricSelectedIndex,
data.fabricTypeSelectedIndex,
data.fabricColorSelectedIndex)
		return data
	}

	function postInfo(sel) {
		var url = $s.host; //main.host + dataUrl.material.post.selectChange+id; 
		var id = $s.id_project;
		if(!id) return
		// var url = $s.host + dataUrl.material.get+id;
		if(typeof sel == 'string'){
			// this.new_page = false
			parent.preload_opacity = true
			url += dataUrl.material.post.selectChange+id+ '&selectType='+sel;
		} else {
			// this.new_page = true
			url += dataUrl.material.post.commit+id;
		}
		var data = getData();

		console.log('sel',data)


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
					parent.all_data['material'] = data.data;
					$s.data_fabric = data.data;	
					parent.preload_opacity = false;
				}
			} else {
				parent.data_error = data.error;
			}
		}, function myError(response) {
			parent.data_error = response.data.message;
		});
	}


	function getInfo(){
		var id = $s.id_project;
		var url = $s.host + dataUrl.material.get+id;
		if(!id) return
		return $h({
			method : "get",
			url : url
		}).then(function mySuccess(response) {
			var data = response.data
			if(!data.error){
				parent.all_data['material'] = data.data;
				$s.data_fabric = data.data;
			} else {
				parent.data_error = data.error;
			}
			
		}, function myError(response) {
			parent.data_error = response.data.message;
		});
	}
}])