mpanelApp.controller("shapeController", ['$http', '$window','$scope', function($h, $w, $s){
	console.log('shapeController')
	var canvas, exportRoot, stage, objectsDataCanvas, curentObject;
	var defaultTriangle, defaultQuadrilateral, defaultPentagon, defaultHexagon;
	$s.data_shape = {};
	$s.prev_num = $s.item_num;
	$s.model_shape = {};
	// $s.load_data = true;

	var parent = $s.$parent;

	$s.default_data = [];
	$s.loadExampleShape = function(){
		console.log('loadExample')
		var num = $s.item_num - $s.min_edge;
		$s.item_shape = clone($s.default_data[num]);
	}

	
	$s.resetDataShape = function(){
		console.log('resetData')
		var shape = $s.item_shape;
		for(var i = 0; i < shape.sideParameters.length;i++){
			var side = shape.sideParameters[i];
			side.pointToPointSize = 0;
			side.isFixed = false;
			side.isMidSupport = false;
		}
		for(var i = 0; i < shape.cornerParameters.length;i++){
			var corner = shape.cornerParameters[i];
			corner.height = 0;
			corner.linkLength = 0;
			// side.isMidSupport = false;
		}
		for(var i = 0; i < shape.diagonalParameters.length; i++){
			var dial =  shape.diagonalParameters[i];
			dial.value = 0;
		}
	}

	$s.$watch('item_num', updateNumEdge);
	// $s.$on("$destroy", function() {
	// 	console.log(' projectController destroy')
	// 	return postInfo();
	// });

	$s.destroy = function(start){
		if(start){
			return postInfo();
		}
		return false
	}

	$s.minusNum = function(){
		$s.prev_num = $s.item_num;
		$s.item_num--;
	};
	$s.plusNum = function(){
		$s.prev_num = $s.item_num;
		$s.item_num++;
	};

	$s.focus = function(name){
		if(name){
			exportRoot.setSelection(name.replace('-',''));
		}
	}
	$s.blur = function(name){
		exportRoot.setSelection("");
	}

	function updateNumEdge(){
		console.log('updateNumEdge', $s.prev_num, $s.item_num)
		// clearMasure()
		var num = $s.item_num - $s.min_edge;
		curentObject = objectsDataCanvas[num];
		exportRoot.buildShape(curentObject);

		if($s.prev_num != $s.item_num){
			updatePrevVal($s.prev_num);
		} else {
			pullDataPage($s.prev_num);
		}
	}


	if($s.id_project){
		if(parent.all_data['shape']){
			saveData()
		} else {
			getInfo().then(function(){
				if(!parent.data_error){
					saveData()
				}
			})
		}
	}

	createSailPattern();

	function saveData(){
		var data = parent.all_data['shape'];

		for(var i = 0; i < data.innerItems.length; i++){
			// var itm = data.innerItems[i];
			// var obj = {};
			// // $s.default_data[i] = []//data.innerItems[i];
			// for(var key in itm){
			// 	obj[key] = itm[key]
			// }
			$s.default_data[i] = clone(data.innerItems[i])
		}

		pullDataPage()
		console.log('data',$s.default_data)
	}
	function updatePrevVal(prev){

		var num = prev - $s.min_edge;
		
		$s.data_shape.innerItems[num] = clone($s.item_shape)

		pullDataPage()
	}

	function pullDataPage(){
		var data = $s.data_shape
		if(!data || !data.sideCount) return
		// console.log('data',data)
		if($s.item_num != data.sideCount){
			var index = $s.item_num - $s.min_edge
			$s.item_shape = data.innerItems[index];
			console.log('no')
		} else {
			$s.item_shape = data
			console.log('itm')
		}		
	}

	function getInfo(){
		var id = $s.id_project;
		var url = $s.host + dataUrl.meas.get+id; 
		console.log('url', url)
		return $h({
			method : "get",
			url : url
		}).then(function mySuccess(response) {
			console.log('getInfo', response)
			// $scope.myWelcome = response.data;
			var data = response.data
			if(!data.error){
				$s.data_shape = data.data;
				parent.all_data['shape'] = data.data;
				$s.item_num = $s.data_shape.sideCount;
			} else {
				// $s.data_error = data.error
				parent.data_error = data.error
			}
			
		}, function myError(response) {
			console.log('getInfo myError', response)
			// $scope.myWelcome = response.statusText;
			parent.data_error = response.data.message
		});
	}

	function getDataParent(){
		var data = $s.item_shape;
		data.innerItems = $s.data_shape.innerItems
		console.log(data)
		return data
	}
	function postInfo(){
		var id = $s.id_project;
		var url = $s.host + dataUrl.meas.post.commit+id;
		parent.all_data['shape'] = getDataParent()
		var data = getNewData();
		console.log('url', data)
		return $h({
			method : "post",
			data: data,
			url : url
		}).then(function mySuccess(response) {
			console.log('getInfo', response)
			// $scope.myWelcome = response.data;
			var data = response.data
			if(!data.error){
				// console.log('data',data.data)
				parent.id_project = data.data;
				$w.localStorage.setItem('mpanel_id', data.data);
				parent.updateMpanel = true
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
	function getSides(arr){
		var res = [];
		var hemItems = $s.data_shape.hemItems
		var dipItems = $s.data_shape.dipItems
		for(var i = 0; i < arr.length; i++){
			var itm = arr[i];
			res[i] = {
				"index": itm.index,
				'name': itm.name,
				"pointToPointSize": +itm.pointToPointSize,  //"sample string 2",
				"selectedHemType": hemItems[itm.selectedHemType],  //"sample string 3",
				"selectedDip": dipItems[itm.selectedDip],//"sample string 4",
				"isFixed": itm.isFixed,
				"isMidSupport": itm.isMidSupport
			}
		}
		return res
	}
	function getDiag(arr){
		var res = [];
		for(var i = 0; i < arr.length; i++){
			var itm = arr[i];
			res[i] = {
				"index" : itm.index,
				"name": itm.name,
				"value": +itm.value
			}
		}
		return res
	}
	function getCorn(arr){
		var res = [];
		var linkItems = $s.data_shape.linkItems
		var hardwareItems = $s.data_shape.hardwareItems
		for(var i = 0; i < arr.length; i++){
			var itm = arr[i];
			res[i]= {
				"height" : +itm.height, //300,
				"index" : itm.index, //1,
				"linkLength" : +itm.linkLength, //1,
				"name" : itm.name, //"A",
				"selectedHardware" : hardwareItems[itm.selectedHardware], //"D ring",
				"selectedLink" : linkItems[itm.selectedLink] //"Shackle",
			}

		}
		return res
	}

	function getNewData(){
		var data = $s.item_shape;
		var sides = getSides(data.sideParameters);
		var diagonals = getDiag(data.diagonalParameters);
		var corners = getCorn(data.cornerParameters);
		return {
			sideCount: +$s.item_num,
			sideParameters: sides,
			diagonalParameters: diagonals,
			cornerParameters: corners,
			loftingSelected : $s.data_shape.loftingSelected,
			measureBetween : $s.data_shape.measureBetween
		}
	}

	function createSailPattern(){

		canvas = document.getElementById('canvas_shape'); //dom.elem('canvas', 'canvas',parent)//document.getElementById("canvas");
		canvas.id = 'canvas';
		canvas.style.background = '#fff';
		canvas.width = canvas.height = 430;
		exportRoot = new lib.Shapes();

		stage = new createjs.Stage(canvas);
		stage.addChild(exportRoot);
		stage.update();

		createjs.Ticker.setFPS(lib.properties.fps);
		createjs.Ticker.addEventListener("tick", stage);


		defaultTriangle = [{name:"AB",val:100,fin:false,indexes:[0,1],curved:0.3},
					   {name:"BC",val:100,fin:false,indexes:[1,2],curved:0.3},
					   {name:"CA",val:100,fin:false,indexes:[2,0],curved:0.3}];

		defaultQuadrilateral = [{name:"AB",val:100,fin:false,indexes:[0,1],curved:0.3},
									{name:"BC",val:100,fin:false,indexes:[1,2],curved:0.3},
									{name:"CD",val:100,fin:false,indexes:[2,3],curved:0.3},
									{name:"DA",val:100,fin:false,indexes:[3,0],curved:0.3},
									{name:"AC",val:Math.sqrt(20000),fin:false,indexes:[0,2],diag:true},
									{name:"BD",val:Math.sqrt(20000),fin:false,indexes:[1,3],diag:true}
									];
		var pentaK = (1+Math.sqrt(5))/2;
		defaultPentagon = [{name:"AB",val:100,fin:false,indexes:[0,1],curved:0.3},
							   {name:"BC",val:100,fin:false,indexes:[1,2],curved:0.3},
							   {name:"CD",val:100,fin:false,indexes:[2,3],curved:0.3},
							   {name:"DE",val:100,fin:false,indexes:[3,4],curved:0.3},
							   {name:"EA",val:100,fin:false,indexes:[4,0],curved:0.3},
							   {name:"AC",val:100*pentaK,fin:false,indexes:[0,2],diag:true},
							   {name:"AD",val:100*pentaK,fin:false,indexes:[0,3],diag:true},
							   {name:"BE",val:100*pentaK,fin:false,indexes:[1,4],diag:true},
							   {name:"BD",val:100*pentaK,fin:false,indexes:[1,3],diag:true},
							   {name:"CE",val:100*pentaK,fin:false,indexes:[2,4],diag:true}
							];
		var side = 100;
		var khex = Math.sqrt(2) ;///Math.sqrt(3/4)*2;
		defaultHexagon = [{name:"AB",val:side,fin:false,indexes:[0,1],curved:0.3},
							   {name:"BC",val:side,fin:false,indexes:[1,2],curved:0.3},
							   {name:"CD",val:side,fin:false,indexes:[2,3],curved:0.3},
							   {name:"DE",val:side,fin:false,indexes:[3,4],curved:0.3},
							   {name:"EF",val:side,fin:false,indexes:[4,5],curved:0.3},
							   {name:"FA",val:side,fin:false,indexes:[5,0],curved:0.3},
							   {name:"AE",val:side*khex,fin:false,indexes:[0,4],diag:true},
							   {name:"BD",val:side*khex,fin:false,indexes:[1,3],diag:true},
							   {name:"BE",val:side,fin:false,indexes:[1,4],diag:true},
							   {name:"BF",val:side*khex,fin:false,indexes:[1,5],diag:true},
							   {name:"CE",val:side*khex,fin:false,indexes:[2,4],diag:true}
							];

		objectsDataCanvas =  [clone(defaultTriangle),  clone(defaultQuadrilateral), clone(defaultPentagon), clone(defaultHexagon)];

	}
	function clone(obj) {
		var copy;

		// Handle the 3 simple types, and null or undefined
		if (null == obj || "object" != typeof obj) return obj;

		// Handle Date
		if (obj instanceof Date) {
			copy = new Date();
			copy.setTime(obj.getTime());
			return copy;
		}

		// Handle Array
		if (obj instanceof Array) {
			copy = [];
			for (var i = 0, len = obj.length; i < len; i++) {
			    copy[i] = clone(obj[i]);
			}
			return copy;
		}

		// Handle Object
		if (obj instanceof Object) {
			copy = {};
			for (var attr in obj) {
				if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
			}
			return copy;
		}

		throw new Error("Unable to copy obj! Its type isn't supported.");
	}

	function clearMasure(){

		var shape = $s.item_num - $s.min_edge;
		if(shape == 0){
			objectsDataCanvas[shape] = clone(defaultTriangle);
		}
		if(shape == 1){
			objectsDataCanvas[shape] = clone(defaultQuadrilateral);
		}
		if(shape == 2){
			objectsDataCanvas[shape] = clone(defaultPentagon);
		}
		if(shape == 3){
			objectsDataCanvas[shape] = clone(defaultHexagon);
		}
		curentObject = objectsDataCanvas[shape];

		exportRoot.updateShape(curentObject,true);
	}


}])