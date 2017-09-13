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
	}

	parent.load_data = false
	
}])