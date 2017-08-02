(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 300,
	height: 300,
	fps: 24,
	color: "#FFFFFF",
	manifest: []
};



// symbols:



// stage content:
(lib.Shapes = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		var defaultValues = [];
		var defaultTriangle = [{name:"AB",val:100,fin:false,indexes:[0,1],curved:0.5},
							   {name:"BC",val:100,fin:false,indexes:[1,2],curved:0.5},
							   {name:"CA",val:100,fin:false,indexes:[2,0],curved:0.5}];
		
		
		
		var self = this;
		var previewWidth = 500;
		var previewHeight = 500;
		var previewPaddings = 105;
		var preview; 
		var lines;
		var lettersArr;
		var letterSize  = 26;
							   
		function init(){
			preview = new  createjs.Container();
			lines = new createjs.Shape();
			self.addChild(preview);
			preview.addChild(lines);
			var labels = ["A","B","C","D","E","F"]
			lettersArr = [];	
			for(i=0;i<6;i++){
				var txt = new createjs.Container();
				
				var letter = new createjs.Text(labels[i], letterSize + "px Arial");
				var ang = new createjs.Text(" ", "14px Arial");
				ang.textAlign = "center";
				ang.y = letterSize/2-4;
				txt.addChild(letter);
				txt.addChild(ang);
				txt.ang = ang;
				ang.color = "#999999"
				letter.x = -letterSize/3;
				letter.y = -letterSize/2-4;
				preview.addChild(txt);
				lettersArr.push(txt);
				txt.visible = false;
			}
			createjs.Ticker.addEventListener("tick", showUpdatedShape);
		
		}
		function getCoordinateBy2sides(a, b, c){
		   var result = {x:0,y:0};
		  if(a > 0){
		    result.x = (c*c - b*b + a*a) / (2*a);
		  }
		
		  result.y = Math.sqrt(c*c - result.x*result.x);
		  return result;
		}					   
							   
		
		function getBoungingBox(points){
			var minx = 1000000;
			var maxx = -1000000;
			var miny = 1000000;
			var maxy = -1000000;
			
			for(var i=0;i<points.length;i++){
				if(points[i].x<minx){
					minx= points[i].x
				}
				if(points[i].x>maxx){
					maxx= points[i].x
				}
				if(points[i].y<miny){
					miny= points[i].y
				}
				if(points[i].y>maxy){
					maxy= points[i].y
				}
			}
			var result = {x:minx,y:miny,w:maxx-minx,h:maxy-miny};
			return result;
		}
		function resetPivot(arr,bbox){
			var dx = -(2*bbox.x + bbox.w)/2;
			var dy = -(2*bbox.y + bbox.h)/2; 
			
			for(var i=0;i<arr.length;i++){
				arr[i].x +=dx;
				arr[i].y +=dy;
			}
		}
		this.setSelection = function(selected){
				var obj = currentObject;
				for(i=0;i<obj.length;i++){
					if(obj[i].name == selected){
						obj[i].selected = true;
					}else{
						obj[i].selected = false;
					}
				}
		}
		function drawShape(points, scale, obj){
			var gr = lines.graphics;
			
			gr.clear();
			gr.setStrokeStyle(2);
		
			for(var i = 0; i < obj.length; i++){
				var p1 = points[obj[i].indexes[0]];
				var p2 = points[obj[i].indexes[1]];
			//	console.log(p1);
				var clr = "#000000";
				if(obj[i].selected){
					
					var rclr = Math.floor(Math.abs(Math.cos(tm/4)*128))+127;
					clr = createjs.Graphics.getRGB(0,rclr,0);
				}
				gr.beginStroke(clr);
				if(obj[i].curved){
				
					var mx=(p1.x+p2.x)/2;
					var my=(p1.y+p2.y)/2;
					var dx = p1.x- p2.x;
					var dy = p1.y- p2.y;
					var l = Math.sqrt(dx*dx+dy*dy);
					var kang =  Math.min(Math.abs(p1.ang),Math.abs(p2.ang))/Math.PI*2;
				
					//console.log(kang);
					mpx= mx*scale + previewWidth/2 + dy*obj[i].curved*kang*scale;
					mpy= my*scale + previewHeight/2- dx*obj[i].curved*kang*scale;
					gr.setStrokeStyle(3);
					gr.moveTo(p1.x*scale + previewWidth/2 ,p1.y*scale + previewHeight/2);
					gr.curveTo(mpx,mpy,p2.x*scale + previewWidth/2 ,p2.y*scale + previewHeight/2);
					gr.setStrokeStyle(1);
					gr.moveTo(p1.x*scale + previewWidth/2 ,p1.y*scale + previewHeight/2);
					gr.lineTo(p2.x*scale + previewWidth/2 ,p2.y*scale + previewHeight/2);
				}else{
				
					if(obj[i].diag){
						gr.setStrokeStyle(1);
						var mx=(p1.x+p2.x)/2;
						var my=(p1.y+p2.y)/2;
						var dx = p1.x - mx;
						var dy = p1.y - my;
						var dlen =  Math.sqrt(dx*dx+dy*dy);
						var p1x = (mx + dx*0.8)*scale + previewWidth/2;
						var p1y = (my + dy*0.8)*scale + previewHeight/2;
						var p2x = (mx - dx*0.8)*scale + previewWidth/2;
						var p2y = (my - dy*0.8)*scale + previewHeight/2;				
						
						dx/=dlen;
						dy/=dlen;
						
						gr.beginFill(clr);
						gr.moveTo(p1x , p1y);
						gr.lineTo(p1x - dx*10 + dy*3,p1y-dy*10 - dx*3);
						gr.lineTo(p1x - dx*10 - dy*3,p1y-dy*10 + dx*3);
						gr.lineTo(p1x,p1y);
						
						gr.endFill(clr);
						
						gr.beginFill(clr);				
						gr.moveTo(p2x , p2y);
						gr.lineTo(p2x + dx*10 + dy*3,p2y + dy*10 - dx*3);
						gr.lineTo(p2x + dx*10 - dy*3,p2y + dy*10 + dx*3);
						gr.lineTo(p2x,p2y);
						gr.endFill(clr);
					
						gr.moveTo(p1x , p1y);
						gr.lineTo(p2x , p2y);
					}else{
						gr.setStrokeStyle(3);
						gr.moveTo(p1.x*scale + previewWidth/2 ,p1.y*scale + previewHeight/2);
						gr.lineTo(p2.x*scale + previewWidth/2 ,p2.y*scale + previewHeight/2);
					}
				}
				
			}
			
			for(var i=0;i<lettersArr.length;i++){
				if(i<points.length){
					lettersArr[i].visible = true;
					var d = Math.sqrt(points[i].x*points[i].x + points[i].y*points[i].y); 
					var p1x = points[i].x/d*letterSize;
					var p1y = points[i].y/d*letterSize;
					lettersArr[i].x = previewWidth/2 + points[i].x*scale + p1x;
					lettersArr[i].y = previewHeight/2 + points[i].y*scale + p1y;
					lettersArr[i].ang.text = Math.floor(points[i].ang/Math.PI*1800)/10 + "°";
				}else{
					lettersArr[i].visible = false;
				}
			}
			
			
			
		}
		function getFitScale(bbox){
			var s1 = (previewWidth-previewPaddings)/bbox.w;
			var s2 = (previewHeight-previewPaddings)/bbox.h;
			
			return Math.min(s1,s2);
		}
		function calculateAngles(points){
			for(i=0;i<points.length;i++){
				var p1 = points[i];
				var p2 = points[(i+points.length-1)%points.length]
				var p3 = points[(i+1)%points.length];
				var v1x = p2.x - p1.x;
				var v1y = p2.y - p1.y;
				var v2x = p3.x - p1.x;
				var v2y = p3.y - p1.y;
				var l1 = Math.sqrt(v1x*v1x+v1y*v1y);
				var l2 = Math.sqrt(v2x*v2x+v2y*v2y);
				var ang =  Math.acos((v1x*v2x + v1y*v2y)/l1/l2);
				points[i].ang = ang;
				//console.log("ang=",ang,ang/Math.PI*180);
				
			}
			
		}
		function validateTriangle(obj){
			var AB = obj[0].val;
			var BC = obj[1].val;
			var CA = obj[2].val;
			//console.log(AB,BC,CA);
			if(AB > BC+CA){
				return false;
			}
			if(BC > AB+CA){
				return false;
			}
			if(CA > AB+BC){
				return false;
			}
			return  true;
		}
		
		function validateQuadrangle(obj){
			var res = true;
			var AB = obj[0].val;
			var BC = obj[1].val;
			var CD = obj[2].val;
			var DA = obj[3].val;
			
			var AC = obj[4].val;
			
			res =  validateTriangle([obj[4],obj[0],obj[1]]) && validateTriangle([obj[4],obj[2],obj[3]]);
		//	console.log("validateQuadrangle");
			return res;
			//console.log(AB,BC,CA);
		}
		function changeBasis(p, p1, v1){
			var ang = Math.atan2(v1.y, v1.x);
			// console.log(ang);
			var rx = p.x*Math.cos(ang) - p.y*Math.sin(ang) + p1.x;
			var ry = p.x*Math.sin(ang) + p.y*Math.cos(ang) + p1.y;
			// console.log(rx,ry);
			return {x:rx,y:ry};
			
		}
		function rotatePoints(arr,ang){
			for(var i = 0; i < arr.length; i++){
				var rx = arr[i].x*Math.cos(ang) - arr[i].y*Math.sin(ang);
				var ry = arr[i].x*Math.sin(ang) + arr[i].y*Math.cos(ang);
				arr[i].x = rx;
				arr[i].y = ry;
				
			}
		}
		function buildHexagone(obj){
			var AB = obj[0].val;
			var BC = obj[1].val;
			var CD = obj[2].val;	
			var DE = obj[3].val;
			var EF = obj[4].val;
			var FA = obj[5].val;
			
			var diagAE = obj[6].val;
			var diagBD = obj[7].val;
			var diagBE = obj[8].val;
			
			var pA =  {x:0,y:0};
			var pB =  {x:AB,y:0};
			var pE = getCoordinateBy2sides(AB,diagBE,diagAE);
			
			var vAE = {x:pE.x - pA.x, y:pE.y - pA.y};
			var pF_ = getCoordinateBy2sides(diagAE,EF,FA);
			var pF = changeBasis(pF_ , pA, vAE);
			
			
			var vBE = {x:pB.x - pE.x, y:pB.y - pE.y};
			var pD_ =  getCoordinateBy2sides(diagBE,diagBD,DE);	
			var pD = changeBasis(pD_ , pE, vBE);
			
			
			var vBD = {x:pB.x - pD.x, y:pB.y - pD.y};
			var pC_ =  getCoordinateBy2sides(diagBD,BC,CD);	
			var pC =  changeBasis(pC_ , pD, vBD);
			
			
			
				
			var points = [pA,pB,pC,pD,pE,pF];
			
			//rotatePoints(points, Math.PI/5*4.5);
			var bbox = getBoungingBox(points);
			resetPivot(points,bbox);
			var scale = getFitScale(bbox);
			calculateAngles(points);
			drawShape(points,scale, obj);
			
		}
		function buildPentagone(obj){
			var AB = obj[0].val;
			var BC = obj[1].val;
			var CD = obj[2].val;	
			var DE = obj[3].val;
			var EA = obj[4].val;
			
			var diagAC = obj[5].val;
			var diagAB = obj[6].val;
			var pC = {x:0,y:0};
			var pD = {x:CD,y:0};
			var pA = getCoordinateBy2sides(CD,diagAB,diagAC);
			
			var vCA={x:pA.x - pC.x, y:pA.y - pC.y};
			
			var pB_ = getCoordinateBy2sides(diagAC,AB,BC);
			var pB = changeBasis(pB_ , pC, vCA);
			
			var vDA={x:-(pA.x - pD.x), y:-(pA.y - pD.y)};
			var pE_ = getCoordinateBy2sides(diagAC,DE,EA);
			var pE = changeBasis(pE_ , pA, vDA);
			
			
			var points = [pA,pB,pC,pD,pE];
			
			rotatePoints(points, Math.PI/5*4.5);
			var bbox = getBoungingBox(points);
			resetPivot(points,bbox);
			var scale = getFitScale(bbox);
			calculateAngles(points);
			drawShape(points,scale, obj);
		
		}
		
		function buildQuadrangle(obj){
			var AB = obj[0].val;
			var BC = obj[1].val;
			var CD = obj[2].val;	
			var DA = obj[3].val;
		
			var diagAC = obj[4].val;
			
			var p1 = {x:0,y:0};
			var p2 = {x:diagAC,y:0};
			var p3 = getCoordinateBy2sides(diagAC,BC,AB);
			var p4 = getCoordinateBy2sides(diagAC,CD,DA);
			p3.y *=-1;
			var points = [p1,p3,p2,p4];
			
			rotatePoints(points, Math.PI/4);
			var bbox = getBoungingBox(points);
			resetPivot(points,bbox);
			var scale = getFitScale(bbox);
			calculateAngles(points);
			drawShape(points,scale, obj);
		}
		function buildTriangle(obj,selected){
			var AB = obj[0].val;
			var BC = obj[1].val;
			var CA = obj[2].val;
		
			var p1 = {x:0,y:0};
			var p2 = {x:AB,y:0};
			var p3 = getCoordinateBy2sides(AB,BC,CA);
			var points = [p1,p2,p3];
			rotatePoints(points, Math.PI/3);
			var bbox = getBoungingBox(points);
			resetPivot(points,bbox);
			//setSelection(obj,selected);
			var scale = getFitScale(bbox);
			calculateAngles(points);
			drawShape(points,scale, obj);
			
			
		//	x1 = 0;
		//	x2 = 0;
		//	y1 = -AB/2;
		//	y2 = AB/2;
		}
		var currentObject;
		function showUpdatedShape(){
			tm++;
			if(currentObject){
				var res;
				if(currentObject.length == 3){
					res = validateTriangle(currentObject);
					if(res){
						buildTriangle(currentObject)
					}
				}
				if(currentObject.length == 6){
			///		console.log("quadro");
					res = validateQuadrangle(currentObject);
					if(res){
						buildQuadrangle(currentObject);
					}
				}
				if(currentObject.length == 10){
					buildPentagone(currentObject);
				}
				if(currentObject.length == 11){
					buildHexagone(currentObject);
				}
			
			}	
			return res;
		}
		
		this.updateShape=function(obj, animation){
			
			var res = false;
			//console.log(obj.length);
			if(obj.length == 3){
				res = validateTriangle(obj);
			}else if (obj.length == 6){
				res = validateQuadrangle(obj);
			}else{
				res = true;
			}
			
			if(res){
				for(var i=0; i<currentObject.length;i++){
					if(animation){
						createjs.Tween.get(currentObject[i]).to({val:obj[i].val}, 500, createjs.Ease.cubicInOut);
					}else{
						currentObject[i].val = obj[i].val;
					}
				}
				
			}
			return res;
		}
		this.buildShape = function(obj){
				currentObject = JSON.parse(JSON.stringify(obj));
				return showUpdatedShape();
		}
		var tm =1;
		init();
		//buildShape(defaultTriangle);
		
		//console.log(getCoordinateBy2sides(s1,Math.sqrt(s1*s1+s2*s2),s2));
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = null;

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, createjs, ss;