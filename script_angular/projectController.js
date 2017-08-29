mpanelApp.controller("projectController", ['$http', '$window','$scope', function($h, $w, $s){
	console.log('project')
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
	// $s.model_project = {
	// 	// selectedOption: false
	// 	// clientName: '',
	// 	description: '',
	// 	enteredBy: '',
	// 	enteredDate: '',
	// 	projectName: '',
	// 	projectNumber: '',
	// 	quantity: '',
	// 	requestDate: '',
	// 	sailNumber: '',
	// 	sailOf: '',
	// 	unitIndex: $s.data_project.units[1]
	// }
	// $s.$on("$destroy", function() {
	// 	console.log(' projectController destroy')
	// 	return postInfo();
	// });

	$s.destroy = function(start){
		return postInfo();
	}


	if($s.id_project){
		console.log($s.all_data['project'])
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
		console.log('pullDataPage', $s)
		var data = $s.data_project;
		// var model = $s.model_project;
		// $s.$apply();

		console.log(data.enteredDate)

		// $s.$apply(function(argument) {
		// 	console.log(true)
		// })

		// model.clientName =  data.clientName
		// model.description =  data.description
		// model.enteredBy =  data.enteredBy
		// model.enteredDate =  data.enteredDate //"2017-08-18T14:50:47.6188583+03:00",
		// model.porjectNumber =  data.projectNumber,
		// model.projectName = data.projectName
		// model.projectNumber = data.projectNumber
		// model.quantity =  data.quantity
		// model.requestDate =  data.requestDate //"2017-08-18T14:50:47.6188583+03:00"
		// model.sailNumber = data.sailNumber
		// model.sailOf = data.sailOf
		// model.unitIndex = data.units[data.unitIndex] //data.units.indexOf($s.model_project.unitIndex)
	}
	function getData(){
		var data = $s.data_project
		// var model = $s.model_project
		var id_unit = $s.data_project.unitIndex //data.units.indexOf(model.unitIndex)

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
		console.log('url', url)
		return $h({
			method : "get",
			url : url
		}).then(function mySuccess(response) {
			console.log('getInfo', response)
			// $scope.myWelcome = response.data;
			var data = response.data
			if(!data.error){
				parent.all_data['project'] = data.data;
				$s.data_project = data.data;
				parent.id_unit = $s.data_project.unitIndex; //1;
				$w.localStorage.setItem('mpanel_unit', parent.id_unit);
			} else {
				//$s.data_error = data.error
				parent.data_error = data.error;
			}
			
		}, function myError(response) {
			console.log('getInfo myError', response)
			// $scope.myWelcome = response.statusText;
			//$s.data_error = response.data.message
			parent.data_error = response.data.message;
		});
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
		console.log(data_1)
		// $s.data_project.unitIndex = data.units.indexOf($s.model_project.unitIndex)
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
			console.log('getInfo', response)
			// $scope.myWelcome = response.data;
			var data = response.data
			if(!data.error){
				console.log('data',data.data)
				parent.id_project = data.data
				$w.localStorage.setItem('mpanel_id', data.data)
			} else {
				console.lgo('data error')
				parent.data_error = data.error

			}
			
		}, function myError(response) {
			console.log('getInfo myError', response)
			// $s.all_data['project'] 
			// $scope.myWelcome = response.statusText;
			parent.data_error = data.error
		});
	}
}])