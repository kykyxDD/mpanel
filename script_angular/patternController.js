mpanelApp.controller("patternController", ['$scope', '$sce', function($s, $sce){

	var parent = $s.$parent;

	// if(!parent.all_data['pattern']) {
	// 	var obj = parent.searchListPage('seams');
	// 	var id = parent.list_menu.indexOf(obj)
	// 	parent.updatePage(id)
	// 	return
	// }
	$s.item_pattern = {};
	$s.url_svg = '';
	$s.dase_url_svg = false;
	$s.big_svg = false;
	$s.small_svg = false;
	var fun_cont_svg = false
	$s.openBig = function(){
		$s.big_svg = !$s.big_svg;
	}

	$s.$on('child_start', function(event,args){
		$s.$emit('child_finish', args)
	})

	// $s.$watch('big_svg', function(){
	// 	if(!$s.cont_svg || $s.small_svg) return false
	// 	if($s.big_svg){
	// 		// fun_cont_svg = new iScroll($s.cont_svg)
	// 		// setTimeout(function(){
	// 		// 	fun_cont_svg.refresh()
	// 		// }, 100)
			
	// 	} else if(fun_cont_svg){
	// 		// fun_cont_svg.destroy()
	// 	}
	// })
	$s.cont_svg = false
	if(parent.all_data['pattern']){
		$s.item_pattern = parent.all_data['pattern'];

		$s.url_svg = $s.item_pattern.svgImage;
		if($s.url_svg.indexOf('<?xml') >= 0){

			var parser = new DOMParser();
			var doc = parser.parseFromString($s.url_svg, "image/svg+xml");
			var svg = doc.querySelector('svg');
			var get_g = svg.querySelector('g');
			var rect = svg.querySelector('rect');
			$s.cont_svg = document.querySelector('.page_pattern .cont_view')
			var elem_view = document.querySelector('.cont_view');
			var p = 0.8
			if(rect){
				rect.setAttribute('fill', '#7f7f7f');
			}
			if(get_g){
				get_g.setAttribute('stroke-width', 1);
				var m = (elem_view.offsetWidth*p)/rect.width.baseVal.value
				// console.log(m)
				var t = (elem_view.offsetHeight*p)/rect.width.baseVal.value

				var size_g = get_g.getBBox();
				// console.log(size_g)
				svg.removeAttribute('viewBox')
				svg.setAttribute('height', elem_view.offsetHeight)
				svg.setAttribute('width', elem_view.offsetWidth)

				get_g.id = 'viewport';
				var a = d = m;
				var b = c = 0;
				var tx = ((1 - p)/2)*elem_view.offsetWidth;
				var ty = ((1 - p)/2)*elem_view.offsetHeight;
				var arr_matrix = [a, b, c, d, tx, ty];
				get_g.setAttribute('transform', 'matrix('+arr_matrix.join(', ')+')');
			}
			
			var size_svg = {
				w: svg.viewBox.baseVal.width,
				h: svg.viewBox.baseVal.height
			}
			
			var size_view = {
				w: elem_view.offsetWidth,
				h: elem_view.offsetHeight
			}

			var s = new XMLSerializer().serializeToString(svg)
			$s.dase_url_svg = $sce.trustAsHtml(s);

			// if($s.cont_svg && size_view.w < size_svg.w && size_view.h < size_svg.h){
			// 	fun_cont_svg = new iScroll($s.cont_svg);
			// } else {
			// 	$s.small_svg = true
			// }
		}
	// } else {
		
	}

	parent.load_data = false
	
}])