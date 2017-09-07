mpanelApp.controller("shapeController", ['$http', '$window','$scope', function($h, $w, $s){
	if(!$s.id_project){
		return $s.updatePage(0)
	}
	$s.item_shape = {
		arr_negative: []
	}
	// $s.$s.item_shape.arr_negative = [];
	$s.$parent.load_data = true
	// console.log('shapeController')
	var canvas, exportRoot, stage, objectsDataCanvas, curentObject;
	var defaultTriangle, defaultQuadrilateral, defaultPentagon, defaultHexagon;
	$s.data_shape = [];
	$s.item_num = false
	$s.prev_num = false;
	

	var parent = $s.$parent;
	parent.no_all_val = false;

	$s.default_data = [];
	$s.loadExampleShape = function(){
		var num = $s.item_num - $s.min_edge;
		var new_data = $s.default_data[num];
		for(var key in new_data){
			$s.item_shape[key] = cloneItem(new_data[key])			
		}
		$s.item_shape.arr_negative = []
		chechAllVal();

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
		}
		for(var i = 0; i < shape.diagonalParameters.length; i++){
			var dial =  shape.diagonalParameters[i];
			dial.value = 0;
		}

		$s.item_shape.arr_negative = [];
		chechAllVal();
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
	$s.validNumSide = function(val, index){
		// console.log('val',val, index)
		var new_val = checkValNum(val);
		if(new_val != val){
			$s.item_shape.sideParameters[index].pointToPointSize = new_val
		}
	}
	$s.validNumDiag = function(val, index){
		// console.log('val',val)
		var new_val = checkValNum(val);
		if(new_val != val){
			$s.item_shape.diagonalParameters[index].value = new_val
		}
	}
	$s.validNumCorn = function(val, index){
		// console.log('val',val)
		var new_val = checkValNum(val);
		if(new_val != val){
			$s.item_shape.cornerParameters[index].height = new_val
		}
	}
	$s.validNumLink = function(val, index){
		// console.log('val',val)
		var new_val = checkValNum(val);
		if(new_val != val){
			$s.item_shape.cornerParameters[index].linkLength = new_val
		}
	}
	function checkValNum(str_num){
		return str_num.replace(/[^0-9.\-\'\"\,\/\s]/gi, '');
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

		chechAllVal();
	}
	function chechAllVal(){
		var res = false;
		var shape = $s.item_shape;
		if($s.item_shape.arr_negative){
			$s.item_shape.arr_negative = []
		}

		for(var i = 0; i < shape.sideParameters.length; i++){
			var itm = shape.sideParameters[i];

			if(!itm.pointToPointSize) {
				res = true
				continue
			}
			var val_str = 'size-'+itm.name;
			var search = itm.pointToPointSize.search(/[0-9]/);
			if(search < 0 || parseFloat(itm.pointToPointSize) == 0){
				res = true
			}

			if(parseFloat(itm.pointToPointSize) < 0){
				$s.item_shape.arr_negative.push(val_str)
				itm.negative = true
			} else if(itm.negative){
				var id = $s.item_shape.arr_negative.indexOf(val_str)
				if(id >= 0){
					$s.item_shape.arr_negative.splice(id, 1);
				}
				itm.negative = false
			}
		}

		for(var i = 0; i < shape.diagonalParameters.length; i++){

			var itm = shape.diagonalParameters[i];
			if(!itm.value) {
				res = true
				continue
			}
			var val_str = 'diag-'+itm.name;
			var search = itm.value.search(/[0-9]/);
			if(search < 0 || parseFloat(itm.value) == 0){
				res = true
			}

			if(parseFloat(itm.value) < 0){
				$s.item_shape.arr_negative.push(val_str)
				itm.negative = true
			} else if(itm.negative){
				var id = $s.item_shape.arr_negative.indexOf(val_str)
				if(id >= 0){
					$s.item_shape.arr_negative.splice(id, 1);
				}
				itm.negative = false
			}
		}

		for(var i = 0; i < shape.cornerParameters.length; i++){

			var itm = shape.cornerParameters[i];
			if(!itm.height) {
				res = true
				continue
			}
			var val_str = 'corn-'+itm.name;
			var search = itm.height.search(/[0-9]/);
			if(search < 0){
				res = true
			}

			if(parseFloat(itm.height) < 0){
				$s.item_shape.arr_negative.push(val_str)
				itm.negative = true
			} else if(itm.negative){
				var id = $s.item_shape.arr_negative.indexOf(val_str)
				if(id >= 0){
					$s.item_shape.arr_negative.splice(id, 1);
				}
				itm.negative = false
			}
		}
		updateNedative()

		parent.no_all_val = res
	}

	function updateNumEdge(){

		if($s.prev_num === false || $s.item_num === false) return

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

		$s.prev_num = data.sideCount;
		$s.item_num = data.sideCount;

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
		// console.time('updatePrevVal')
		if($s.item_shape){
			var num = prev - $s.min_edge;
			$s.data_shape[num] = cloneItem($s.item_shape);
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
		// console.time('pullDataPage')

		var index = $s.item_num - $s.min_edge;
		// $s.item_shape = data[index];

		var new_shape = data[index];

		var res_type = сompareArr(new_shape.hemItems, $s.item_shape.hemItems);
		var res_dip = сompareArr(new_shape.dipItems, $s.item_shape.dipItems);


		var res_finish = сompareArr(new_shape.hardwareItems, $s.item_shape.hardwareItems);
		var res_link = сompareArr(new_shape.linkItems, $s.item_shape.linkItems);

		for(var key in new_shape){

			if(!$s.item_shape[key]) {
				$s.item_shape[key] = new_shape[key];
			} else {
				if(key == 'hemItems' && !res_type) continue
				if(key == 'dipItems' && !res_dip) continue
				if(key == 'hardwareItems' && !res_finish) continue
				if(key == 'linkItems' && !res_link) continue

				if(key == 'loftingItems' || key == 'loftingSelected') continue
				

				if(key == 'sideParameters' && $s.item_shape[key]) {
					var sides = new_shape['sideParameters'];

					if($s.item_shape.sideParameters.length > sides.length){
						var len = $s.item_shape.sideParameters.length - sides.length
						$s.item_shape.sideParameters.splice(sides.length, len)
					} 
					for(var i = 0; i < sides.length; i++){
						var itm = sides[i];
						if(!$s.item_shape.sideParameters[i]){
							$s.item_shape.sideParameters[i] = itm
						} else {
							$s.item_shape.sideParameters[i].index = itm.index;
							$s.item_shape.sideParameters[i].name = itm.name;
							$s.item_shape.sideParameters[i].pointToPointSize = itm.pointToPointSize;
							
							$s.item_shape.sideParameters[i].isFixed = itm.isFixed;
							$s.item_shape.sideParameters[i].isMidSupport = itm.isMidSupport;
							$s.item_shape.sideParameters[i].selectedHemType = itm.selectedHemType;
							$s.item_shape.sideParameters[i].selectedDip = itm.selectedDip;
							$s.item_shape.sideParameters[i].negative = itm.negative
						}
					}
				} else if(key == 'cornerParameters' && $s.item_shape[key]) {
					var corner = new_shape['cornerParameters'];

					if($s.item_shape.cornerParameters.length > sides.length){
						var len = $s.item_shape.cornerParameters.length - sides.length
						$s.item_shape.cornerParameters.splice(sides.length, len)
					} 
					for(var i = 0; i < corner.length; i++){
						var itm = corner[i];
						if(!$s.item_shape.cornerParameters[i]){
							$s.item_shape.cornerParameters[i] = corner[i]
						} else {
							$s.item_shape.cornerParameters[i].index = itm.index;
							$s.item_shape.cornerParameters[i].height = itm.height;
							$s.item_shape.cornerParameters[i].linkLength = itm.linkLength;
							$s.item_shape.cornerParameters[i].linkLengthChangable = itm.linkLengthChangable;
							$s.item_shape.cornerParameters[i].name = itm.name;
							$s.item_shape.cornerParameters[i].selectedHardware = itm.selectedHardware;
							$s.item_shape.cornerParameters[i].selectedLink = itm.selectedLink;
							$s.item_shape.cornerParameters[i].negative = itm.negative;
						}
					}
				} else {
					$s.item_shape[key] = new_shape[key];
				}
			}
		}
		chechAllVal();
		// console.timeEnd('pullDataPage')
	}
	function сompareArr(itm, prev){
		var res = false
		if(!prev) return true
		for(var i = 0; i < itm.length; i++){
			if(!prev[i] || itm[i] != prev[i]) res = true
		}

		return res

	}

	function getInfo(){
		var id = $s.id_project;
		var url = $s.host + dataUrl.meas.get+id; 
		// console.log('url', url)
		return $h({
			method : "get",
			url : url
		}).then(function mySuccess(response) {
			var data = response.data
			if(!data.error){
				parent.all_data['shape'] = data.data;
				parent.all_data['default_shape'] = cloneItem(data.data.innerItems)//cloneItem(data.data.innerItems);
			} else {
				parent.data_error = data.error
			}
			
		}, function myError(response) {
			parent.data_error = response.data.message
		});
	}

	function getDataParent(){
		var data = $s.item_shape;
		data.innerItems = $s.default_data
		return data
	}
	function destroyAllData(){
		if(parent.all_data['review']){
			delete parent.all_data['review']
		}
		if(parent.all_data['seams']){
			delete parent.all_data['seams']
		}
		if(parent.all_data['pattern']){
			delete parent.all_data['pattern']
		}
		if(!parent.mpanel) {
			parent.mpanel = false
		}
	}
	function postInfo(){
		var id = $s.id_project;
		var url = $s.host + dataUrl.meas.post.commit+id;
		parent.all_data['shape'] = getDataParent()
		var data = getNewData();
		parent.no_all_val = false;
		return $h({
			method : "post",
			data: data,
			url : url
		}).then(function mySuccess(response) {
			// console.log('getInfo', response)
			var data = response.data
			if(!data.error){
				parent.id_project = data.data;
				$w.localStorage.setItem('mpanel_id', data.data);
				parent.updateMpanel = true
				destroyAllData()
				
			} else {
				parent.data_error = data.error

			}
			
		}, function myError(response) {
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