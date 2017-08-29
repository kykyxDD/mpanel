mpanelApp.controller("shapeController", ['$http', '$window','$scope', function($h, $w, $s){
	if(!$s.id_project){
		return $s.updatePage(0)
	}
	$s.item_shape = {
		arr_negative: []
	}
	// $s.$s.item_shape.arr_negative = [];
	$s.$parent.load_data = true
	console.log('shapeController')
	var canvas, exportRoot, stage, objectsDataCanvas, curentObject;
	var defaultTriangle, defaultQuadrilateral, defaultPentagon, defaultHexagon;
	$s.data_shape = [];
	$s.prev_num = $s.item_num;

	var parent = $s.$parent;

	$s.default_data = [];
	$s.loadExampleShape = function(){
		// console.log('loadExample')
		var num = $s.item_num - $s.min_edge;
		var new_data = $s.default_data[num];
		// console.time('loadExample')
		for(var key in new_data){
			$s.item_shape[key] = cloneItem(new_data[key])			
		}
		$s.item_shape.arr_negative = []
		// console.timeEnd('loadExample')
	}

	function cloneItem(data){
		if(!data) return data

		if(typeof data === 'string' || typeof data === 'number'){
			return data;
		} else if(data.length){
			var arr = [];

			for(var i = 0; i < data.length; i++){
				arr.push(cloneItem(data[i]))
			}
			return arr
		} else if(typeof data === 'object'){
			var obj = {}
			for(var key in data){
				obj[key] = cloneItem(data[key])
			}
			return obj
		} else {
			return data
		}
	}

	
	$s.resetDataShape = function(){
		// console.log('resetData')
		var shape = $s.item_shape;
		// console.time('reset')
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

		$s.item_shape.arr_negative = []
		// console.timeEnd('reset')
	}

	$s.$watch('item_num', updateNumEdge);

	$s.$watch('item_shape.arr_negative.length', updateNedative);

	$s.destroy = function(start){
		if(start){
			return postInfo();
		}
		return false
	}
	function updateNedative(){
		var str = false
		if($s.item_shape && $s.item_shape.arr_negative && $s.item_shape.arr_negative.length > 0){
			str = $s.item_shape.arr_negative.length > 0
		}
		parent.negative = str
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
	$s.blur = function(obj, str){
		exportRoot.setSelection("");
		if(obj){
			// console.log('blur', obj, str)
			var val_str = str+'-'+obj.name
			if(str == 'size'){
				// var val_str = str+'-'+obj.name
				if(+obj.pointToPointSize < 0){
					$s.item_shape.arr_negative.push(val_str)
					obj.negative = true
				} else if(obj.negative){
					var id = $s.item_shape.arr_negative.indexOf(val_str)
					if(id >= 0){
						$s.item_shape.arr_negative.splice(id, 1);
					}
				}
			} else if(str == 'diag'){
				if(+obj.value < 0){
					$s.item_shape.arr_negative.push(val_str)
					obj.negative = true
				} else if(obj.negative){
					var id = $s.item_shape.arr_negative.indexOf(val_str)
					if(id >= 0){
						$s.item_shape.arr_negative.splice(id, 1);
					}
				}
			} else if(str == 'corn'){
				if(+obj.height < 0){
					$s.item_shape.arr_negative.push(val_str)
					obj.negative = true
				} else if(obj.negative){
					var id = $s.item_shape.arr_negative.indexOf(val_str)
					if(id >= 0){
						$s.item_shape.arr_negative.splice(id, 1);
					}
				}
			}
		}
	}

	function updateNumEdge(){
		// console.log('updateNumEdge', $s.prev_num, $s.item_num)
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


	if(parent.all_data['shape']){
		saveData();
		$s.$parent.load_data = false
	} else {
		getInfo().then(function(){
			if(!parent.data_error){
				saveData()
				$s.$parent.load_data = false
			}
		});
	}

	createSailPattern();

	function saveData(){
		var data = parent.all_data['shape'];

		if(!$s.default_data.length){
			$s.default_data = cloneItem(parent.all_data['default_shape'])
		}

		if(!$s.data_shape.length){
			$s.data_shape = getArrData();
		}

		$s.item_num = data.sideCount;

		pullDataPage();
		// console.log('data',$s.default_data)
	}
	function updatePrevVal(prev){
		if($s.item_shape){
			var num = prev - $s.min_edge;
			$s.data_shape[num] = cloneItem($s.item_shape)
		}

		pullDataPage()
	}

	
	function getArrData(){
		var res = [];
		var data = parent.all_data['shape'];
		var index = parent.all_data['shape'].sideCount - $s.min_edge;

		res[index] = cloneInner(data);

		for(var i = 0; i < data.innerItems.length; i++){
			if(i == index) continue

			res[i] = cloneInner(data.innerItems[i])
		}

		function cloneInner(data){
			var obj = {}

			for(var key in data){
				if(key == 'innerItems' || key == 'isInnerPage') continue
				obj[key] = cloneItem(data[key])
			}
			obj.arr_negative = []
			return obj
		}
		return res

	}

	function pullDataPage(){
		var data = $s.data_shape;
		if(!data.length) return

		var index = $s.item_num - $s.min_edge;
		// console.log('data',data)
		if($s.item_shape && $s.item_num != $s.item_shape.sideCount){
			// var index = $s.item_num - $s.min_edge;
			$s.item_shape = data[index];
			// console.log('no')
		} else {
			$s.item_shape = data[index];
			// console.log('itm')
		}
	}

	function getInfo(){
		var id = $s.id_project;
		var url = $s.host + dataUrl.meas.get+id; 
		// console.log('url', url)
		return $h({
			method : "get",
			url : url
		}).then(function mySuccess(response) {
			// console.log('getInfo', response)
			// $scope.myWelcome = response.data;
			var data = response.data
			if(!data.error){
				// console.time('get')
				// $s.data_shape = data.data;
				// $s.default_data = cloneItem(data.data.innerItems);
				parent.all_data['shape'] = data.data;
				parent.all_data['default_shape'] = cloneItem(data.data.innerItems)//cloneItem(data.data.innerItems);
				// console.timeEnd('get')
			} else {
				// $s.data_error = data.error
				parent.data_error = data.error
			}
			
		}, function myError(response) {
			// console.log('getInfo myError', response)
			// $scope.myWelcome = response.statusText;
			parent.data_error = response.data.message
		});
	}

	function getDataParent(){
		var data = $s.item_shape;
		data.innerItems = $s.default_data
		return data
	}
	function postInfo(){
		var id = $s.id_project;
		var url = $s.host + dataUrl.meas.post.commit+id;
		parent.all_data['shape'] = getDataParent()
		var data = getNewData();
		// console.log('url', data)
		return $h({
			method : "post",
			data: data,
			url : url
		}).then(function mySuccess(response) {
			// console.log('getInfo', response)
			var data = response.data
			if(!data.error){
				// console.log('data',data.data)
				parent.id_project = data.data;
				$w.localStorage.setItem('mpanel_id', data.data);
				parent.updateMpanel = true
			} else {
				// console.log('data error')
				parent.data_error = data.error

			}
			
		}, function myError(response) {
			// console.log('getInfo myError', response)
			// $s.all_data['project'] 
			// $scope.myWelcome = response.statusText;
			parent.data_error = data.error
		});

	}
	function getSides(arr){
		var res = [];
		var hemItems = $s.item_shape.hemItems
		var dipItems = $s.item_shape.dipItems
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
		var linkItems = $s.item_shape.linkItems
		var hardwareItems = $s.item_shape.hardwareItems
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
			loftingSelected : $s.item_shape.loftingSelected,
			measureBetween : $s.item_shape.measureBetween
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