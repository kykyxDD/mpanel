mpanelApp.controller("projectController", ['$http', '$window','$scope', function($h, $w, $s){
	// console.log('project')
	var parent = $s.$parent;
	$s.data_project = {
		/*unitIndex: 1,
		units:  [
			"Meters  ( 1.234 )",
			"Centimeters  ( 123.4 )",
			"Millimeters  ( 1234 )",
			"Inches  ( 123.4\" )",
			"Feet and inches  ( 12\' 3.4\" )",
			"Feet, inches, fractions  ( 12\' 3 5/16\" )"
		]*/
	};

	$s.destroy = function(start){
		return postInfo();
	}


	if($s.id_project){
		$s.$parent.load_data = true;
		// console.log($s.all_data['project'])
		if(parent.all_data['project']){
			$s.data_project = parent.all_data['project'];
			pullDataPage()
		} else {
			getInfo().then(function(){
				if(!$s.data_error){
					pullDataPage()
				}
			})
		}
	} else {
		$s.data_project = {
		unitIndex: 1,
			units:  [
				"Meters  ( 1.234 )",
				"Centimeters  ( 123.4 )",
				"Millimeters  ( 1234 )",
				"Inches  ( 123.4\" )",
				"Feet and inches  ( 12\' 3.4\" )",
				"Feet, inches, fractions  ( 12\' 3 5/16\" )"
			]
		};
	}

	function pullDataPage(data){
		$s.$parent.load_data = false;
	}
	function getData(){
		var data = $s.data_project;
		var id_unit = $s.data_project.unitIndex; //data.units.indexOf(model.unitIndex)

		return {
			clientName: data.clientName,
			description: data.description,
			enteredBy: data.enteredBy,
			enteredDate: data.enteredDate,// "2017-08-18T14:50:47.6188583+03:00",
			porjectNumber: data.projectNumber,
			projectName:data.projectName,
			projectNumber:data.projectNumber,
			quantity: data.quantity,
			requestDate: data.requestDate,// "2017-08-18T14:50:47.6188583+03:00",
			sailNumber:data.sailNumber,
			sailOf: data.sailOf,
			unitIndex: id_unit //data.units.indexOf(model.unitIndex)
		}
	}

	function getInfo(){
		var id = $s.id_project;
		var url = $s.host + dataUrl.project.get+id;//dataUrl.project.new_project;

		return $h({
			method : "get",
			url : url
		}).then(function mySuccess(response) {
			var data = response.data
			if(!data.error){
				parent.all_data['project'] = data.data;
				$s.data_project = data.data;
				parent.id_unit = $s.data_project.unitIndex; 
				$w.localStorage.setItem('mpanel_unit', parent.id_unit);
			} else {
				parent.data_error = data.error;
			}
			
		}, function myError(response) {
			parent.data_error = response.data.message;
		});
	}
	$s.desplayPikaday = function(){
		var data = $s.data_project;
		var date_required = document.getElementById('date_required');
		var date_entered = document.getElementById('date_entered');
		$(date_required).data('datepicker').destroy();
		$(date_entered).data('datepicker').destroy();
	}
	function postInfo(){
		var id = $s.id_project;

		var url =  $s.host
		if(id){
			url += dataUrl.project.post + id;
		} else {
			url += dataUrl.project.new_project
		}
		var data = $s.data_project;
		var data_1 = getData();

		var prev_unit = $w.localStorage.getItem('mpanel_unit');
		if(prev_unit != undefined &&  +prev_unit >= 0 ){
			if(+prev_unit != $s.data_project.unitIndex) {
				console.log('prev_unit')
				if(parent.all_data['shape']){
					delete parent.all_data['shape']
				}
				if(parent.all_data['default_shape']){
					delete parent.all_data['default_shape']
				}
				if(parent.all_data['review']){
					delete parent.all_data['review']
				}

				if($w.localStorage.getItem('mpanel_obj')){
					$w.localStorage.removeItem('mpanel_obj')
				}
				if(parent.mpanel){
					parent.mpanel = false
				}
			}
		}

		$w.localStorage.setItem('mpanel_unit', $s.data_project.unitIndex);

		parent.all_data['project'] = data_1;
		parent.all_data['project'].units = $s.data_project.units;

		parent.id_unit = $s.data_project.unitIndex;
		$w.localStorage.setItem('mpanel_unit', parent.id_unit);

		return $h({
			method : "post",
			data: data_1,
			url : url
		}).then(function mySuccess(response) {
			var data = response.data
			if(!data.error){
				parent.id_project = data.data
				$w.localStorage.setItem('mpanel_id', data.data);
				$s.desplayPikaday()
			} else {
				parent.data_error = data.error
			}
			
		}, function myError(response) {
			parent.data_error = data.error
		});
	}
}])