mpanelApp.controller("projectController", ['conts','$http', '$window','$scope', function(conts,$h, $w, $s){

	var parent = $s.$parent;
	$s.data_project = {};
	$s.$on('child_start', function(start, args){
		checkError()

		if(!parent.pageproject_error){
			postInfo(start, args)
		} else {
			parent.load_data = false;
		}
	})

	$s.data_error = {
		clientName: false,
		projectName: false
	}

	$s.focusText = function(name, text){
		$s.data_error[name] = false;
	}
	$s.blurText = function(name, text){

		var replace = text ? valText(text) : false; 
		$s.data_error[name] = !replace 

		parent.pageproject_error = $s.data_error['clientName'] || $s.data_error['projectName'];
	}
	function valText(text){

		var replace = text && text.replace(/\t\s/g,'');
		return !replace ? replace : true 
	}


	$s.validNum = function(name){
		var val = $s.data_project[name];
		// console.log(val)
		var check_val = checkValNum(val);
		if(check_val != val) {
			$s.data_project[name] = check_val
		}
	}

	function initPage(){
		if($s.id_project){
			parent.load_data = true;
			if(parent.all_data['project']){
				$s.data_project = parent.all_data['project'];
				pullDataPage()
			} else {
				getInfo()
			}
		} else {
			var date = new Date()
			$s.data_project = {
				unitIndex: 1,
				enteredDate: date.toISOString(),
				requestDate: date.toISOString(),
	
				units:  [
					"Meters  ( 1.234 )",
					"Centimeters  ( 123.4 )",
					"Millimeters  ( 1234 )",
					"Inches  ( 123.4\" )",
					"Feet and inches  ( 12\' 3.4\" )",
					"Feet, inches, fractions  ( 12\' 3 5/16\" )"
				]
			};
			parent.pageproject_error = true
			parent.load_data = false;
		}
	}

	function pullDataPage(data){
		parent.load_data = false;
		var client = $s.data_project['clientName'];
		var project = $s.data_project['projectName'];

		parent.pageproject_error = !valText(client) || !valText(project)
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
		var url = $s.api + dataUrl.project.get+id;//dataUrl.project.new_project;

		return $h({
			method : "get",
			url : url
		}).then(function mySuccess(response) {
			var data = response.data
			if(!data.error){
				parent.all_data['project'] = data.data;
				$s.data_project = data.data;
				parent.id_unit = $s.data_project.unitIndex; 
				$w.localStorage.setItem(conts.unit, parent.id_unit);
				pullDataPage()
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
	function postInfo(start,args){

		// checkError();

		// if(parent.pageproject_error) return false


		parent.load_data = true;
		var id = $s.id_project;

		var url =  $s.api
		if(id){
			url += dataUrl.project.post + id;
		} else {
			url += dataUrl.project.new_project
		}
		var data = $s.data_project;
		var data_1 = getData();

		// console.log('postInfo')

		var prev_unit = $w.localStorage.getItem(conts.unit);
		if(prev_unit != undefined &&  +prev_unit >= 0 ){
			if(+prev_unit != $s.data_project.unitIndex) {

				for(var key in parent.all_data){
					delete parent.all_data[key];
				}

				if($w.localStorage.getItem(conts.obj)){
					$w.localStorage.removeItem(conts.obj);
				}
				if(parent.mpanel){
					parent.mpanel = false;
				}
			}
		}

		parent.all_data['project'] = data_1;
		parent.all_data['project'].units = $s.data_project.units;

		parent.id_unit = $s.data_project.unitIndex;
		$w.localStorage.setItem(conts.unit, parent.id_unit);


		return $h({
			method : "post",
			data: data_1,
			url : url
		}).then(function mySuccess(response) {
			var data = response.data
			if(!data.error){
				parent.id_project = data.data
				$w.localStorage.setItem(conts.id, data.data);
				$s.desplayPikaday()
			} else {
				parent.data_error = data.error
			}
			
		}, function myError(response) {
			parent.data_error = response.data.message;
		}).then(function(){
			$s.$emit('child_finish', args)
		});
	}

	function checkError(){
		var client = $s.data_project['clientName'];
		var project = $s.data_project['projectName'];
		$s.blurText('clientName', client)
		$s.blurText('projectName', project)
	}

	function checkValNum(str_num){
		return str_num.replace(/[^0-9.\-\'\"\,\/]/gi, '');
	}

	initPage()
}])