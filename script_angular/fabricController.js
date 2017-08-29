
mpanelApp.controller("fabricController", ['$http', '$window','$scope', function($h, $w, $s){

	// $s.$on("$destroy", function(start) {
	// 	console.log('farbicController destroy', start)
	// 	if(start){
	// 		return postInfo()	
	// 	}		
	// });

	// $s.$parent.load_data = true;

	var parent = $s.$parent;

	$s.destroy = function(start){
		if(start){
			return postInfo();
		} 
		return false
	}

	$s.destroy
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
	if(!$s.id_project){
		return $s.updatePage(0)
	} else if(parent.all_data['material']) {
		$s.data_fabric = parent.all_data['material'];
	} else {
		parent.load_data = true
		getInfo().then(function(){

			pullDataPage()
			parent.load_data = false
		})
	}


	function pullDataPage(argument) {
		// console.log('pullDataPage', $s.data_fabric)

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

		if(typeof data.fabricSelectedIndex == 'string'){
			var id = data_fabric.fabricItems.indexOf(data.fabricSelectedIndex)
			if(id >= 0){
				data.fabricSelectedIndex = data_fabric.fabricItems.indexOf(data.fabricSelectedIndex);
				parent.all_data['material'].fabricSelectedIndex =  data.fabricSelectedIndex//data_fabric[key]
			}
		}
		if(typeof data.fabricTypeSelectedIndex == 'string'){
			var id = data_fabric.fabricTypeItems.indexOf(data.fabricTypeSelectedIndex)
			if(id >= 0){
				data.fabricTypeSelectedIndex = data_fabric.fabricTypeItems.indexOf(data.fabricTypeSelectedIndex);
				parent.all_data['material'].fabricTypeSelectedIndex =  data.fabricTypeSelectedIndex//data_fabric[key]
			}
		}
		if(typeof data.fabricColorSelectedIndex == 'string'){
			var id = data_fabric.fabricColorItems.indexOf(data.fabricColorSelectedIndex)
			if(id >= 0){
				data.fabricColorSelectedIndex = data_fabric.fabricColorItems.indexOf(data.fabricColorSelectedIndex);
				parent.all_data['material'].fabricColorSelectedIndex =  data.fabricColorSelectedIndex//data_fabric[key]
			}
		}
		return data
	}

	function postInfo(sel) {
		var url = $s.host; //main.host + dataUrl.material.post.selectChange+id; 
		var id = $s.id_project;
		if(!id) return
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
			// console.log('getInfo', response)
			// $scope.myWelcome = response.data;
			var data = response.data
			if(!data.error){
				// console.log('data',data.data)
				// $s.id_project = data.data
				if(typeof data.data == 'string'){
					$w.localStorage.setItem('mpanel_id', data.data)
				} else {
					parent.all_data['material'] = data.data;
					$s.data_fabric = data.data;	
				}
				
				// $w.localStorage.setItem('mpanel_id', data.data)
			} else {
				// console.log('data error')
				parent.data_error = data.error
			}
		}, function myError(response) {
			// console.log('getInfo myError', response)
			// $s.all_data['project'] 
			// $scope.myWelcome = response.statusText;
			parent.data_error = response.data.message;
		});
	}


	function getInfo(){
		var id = $s.id_project;
		var url = $s.host + dataUrl.material.get+id;//dataUrl.project.new_project;
		// console.log('url', url)
		if(!id) return
		return $h({
			method : "get",
			url : url
		}).then(function mySuccess(response) {
			// console.log('getInfo', response)
			// $scope.myWelcome = response.data;
			var data = response.data
			if(!data.error){
				parent.all_data['material'] = data.data;
				$s.data_fabric = data.data;
				// $s.id_unit = $s.data_fabric.unitIndex; //1;
				//$w.localStorage.setItem('mpanel_unit', $s.id_unit);
			} else {
				parent.data_error = data.error
			}
			
		}, function myError(response) {
			// console.log('getInfo myError', response)
			// $scope.myWelcome = response.statusText;
			parent.data_error = response.data.message
		});
	}
}])