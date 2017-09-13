mpanelApp.controller("fittingController", ['$http', '$window','$scope', function($h, $w, $s){
	$s.$parent.load_data = true;

	$s.$on('child_start', postInfo)

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

	$s.changeSelect = function(name, old_val) {
		postInfoSelect(name, old_val)
	}
	function initPage(){
		if($s.all_data['material']) {
			$s.data_fitting = $s.all_data['material'];
			$s.$parent.load_data = false;
		} else {
			// getInfo().then(function(){
			// 	parent.load_data = false;
			// });
			getInfo()
		}
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
		return data
	}


	/*function postInfo(sel, index) {
		var url = $s.host; 
		var id = $s.id_project;
		if(typeof sel == 'string'){
			parent.preload_opacity = true;
			url += dataUrl.material.post.selectChange+id+ '&selectType='+sel+'&oldVal='+index;;

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
	}*/

	function postInfoSelect(sel, index) {
		var url = $s.api;
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
		var url = $s.api;
		var id = $s.id_project;
		if(!id) return

		// if(typeof sel == 'string'){
		// 	parent.preload_opacity = true
		// 	url += dataUrl.material.post.selectChange+id+ '&selectType='+sel+'&oldVal='+index;
		// } else {
			url += dataUrl.material.post.commit+id;
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


	function getInfo(){
		var id = $s.id_project;
		var url = $s.api + dataUrl.material.get+id;//dataUrl.project.new_project;
		return $h({
			method : "get",
			url : url
		}).then(function mySuccess(response) {
			var data = response.data;
			if(!data.error){
				$s.all_data['material'] = data.data;
				$s.data_fitting = data.data;
				parent.load_data = false;
			} else {
				parent.data_error = data.error;
			}
		}, function myError(response) {
			parent.data_error = response.data.message;
		});
	}
	initPage()

}])