mpanelApp.controller("patternController", ['$scope', function($s){
	var parent = $s.$parent;
	$s.item_pattern = {}
	$s.url_svg = ''
	if(parent.all_data['pattern']){
		$s.item_pattern = parent.all_data['pattern'];

		$s.url_svg = $s.item_pattern.svgImage
		if($s.url_svg.indexOf('<?xml')>=0){
			// var 

			var parser = new DOMParser();
			var doc = parser.parseFromString($s.url_svg, "image/svg+xml");

			var s = new XMLSerializer().serializeToString(doc.querySelector('svg'))
			var encodedData = window.btoa(s);
			$s.dase_url_svg = 'data:image/svg+xml;base64,' + encodedData;
		}
	}
}])