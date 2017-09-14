mpanelApp.controller("fabricController", ['$http', '$window','$scope', function($h, $w, $s){
	$s.$parent.load_data = true;
	var parent = $s.$parent;

	$s.$on('child_start', postInfo)

	//$s.material_db = {}

	// $s.destroy = function(start){
	// 	if(start){
	// 		return postInfo();
	// 	} 
	// 	return false
	// }

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

	$s.changeSelect = function(name, old_val) {
		// console.log('changeSelect',name, old_val)
		postInfoSelect(name, old_val)
	}


	function initInfo(){
		if(parent.all_data['material']) {
			getDataUnits(parent.material_db)
			$s.data_fabric = parent.all_data['material'];
			$s.$parent.load_data = false;
		} else {
			// getInfo().then(function(){
			// 	parent.load_data = false
			// })

			getMaterial()
		}
	}

	function getDataUnits(data){
		$s.material_db = data.staticObj.staticMatlPage
		$s.fabRelations = data.unitItems[$s.id_unit].fabRelations;
		console.log($s.fabRelations)
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

		return data
	}

	function postInfoSelect(sel, index) {
		var url = $s.api; //main.host + dataUrl.material.post.selectChange+id; 
		var id = $s.id_project;
		if(!id) return

		// if(typeof sel == 'string'){
			parent.preload_opacity = true
			url += dataUrl.material.post.selectChange+id+ '&selectType='+sel+'&oldVal='+index;
		// } else {
		// 	url += dataUrl.material.post.commit+id;
		// }
		var data = getData();

		return $h({
			method : "post",
			data: data,
			url : url
		}).then(function mySuccess(response) {
			var data = response.data
			if(!data.error){
				// if(typeof data.data == 'string'){
				// 	$w.localStorage.setItem('mpanel_id', data.data)
				// } else {
					parent.all_data['material'] = data.data;
					$s.data_fabric = data.data;	
					parent.preload_opacity = false;
				// }
			} else {
				parent.data_error = data.error;
			}
		}, function myError(response) {
			parent.data_error = response.data.message;
		});
	}
	function postInfo(start,args) {
		var url = $s.api; //main.host + dataUrl.material.post.selectChange+id; 
		var id = $s.id_project;
		if(!id) return

		// if(typeof sel == 'string'){
		// 	parent.preload_opacity = true
		// 	url += dataUrl.material.post.selectChange+id+ '&selectType='+sel+'&oldVal='+index;
		// } else {
			url += dataUrl.material.post.commit+id;
		// }
		var data = getData();

		// console.log('data', args, data)
		parent.all_data['material'] == data;

		parent.update_texture = true
		if(args.id == 'fittings'){
			return $s.$emit('child_finish', args)
		}


		return $h({
			method : "post",
			data: data,
			url : url
		}).then(function mySuccess(response) {
			var data = response.data
			if(!data.error){
				// if(typeof data.data == 'string'){
				$w.localStorage.setItem('mpanel_id', data.data)
				// } else {
				// 	parent.all_data['material'] = data.data;
				// 	$s.data_fabric = data.data;	
				// 	parent.preload_opacity = false;
				// }
			} else {
				parent.data_error = data.error;
			}
		}, function myError(response) {
			parent.data_error = response.data.message;
		}).then(function(){
			$s.$emit('child_finish', args)
		});
	}


	function getMaterial(){
		var id = $s.id_project;
		var url = $s.api_material_db + dataUrl.material_db //+ id;
		console.log('url',url)
		//var url = $s.api + dataUrl.material.get+id;
		if(!id) return
		return $h({
			method : "get",
			url : url
		}).then(function mySuccess(response) {
			var data = response.data
			if(!data.error){
				// parent.all_data['material_db'] = data;
				parent.material_db = data
				// console.log($s.material_db)
				// $s.data_fabric = data.data;
				// parent.load_data = false
				getDataUnits(data)

				getInfo()
			} else {
				parent.data_error = data.error;
			}
			
		}, function myError(response) {
			parent.data_error = response.data.message;
		});
	}
	function getInfo(){
		var id = $s.id_project;
		var url = $s.api + dataUrl.material.get+id;
		if(!id) return
		return $h({
			method : "get",
			url : url
		}).then(function mySuccess(response) {
			var data = response.data
			if(!data.error){
				parent.all_data['material'] = data.data;
				$s.data_fabric = data.data;
				parent.load_data = false
			} else {
				parent.data_error = data.error;
			}
			
		}, function myError(response) {
			parent.data_error = response.data.message;
		});
	}

	initInfo();
}])