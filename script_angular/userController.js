mpanelApp.controller("userController",['$http', '$window','$scope', function($h, $w, $s){
	$s.message = "This page will be used to display all the students";
	console.log('headerController')
	$s.$parent.id_itm_page = -1;

	$s.$parent.itm_page = undefined
	$w.document.title = 'User setting';
	$s.model_styles;
	$s.styles = [
		'Standard',
		'Single Poly cut',
		'Aeronaut',
		'Autometrix',
		'Prosail',
		'Smre'
	];

	$s.model_units;
	$s.units = [
		"Meters  ( 1.234 )",
		"Centimeters  ( 123.4 )",
		"Millimeters  ( 1234 )",
		"Inches  ( 123.4\" )",
		"Feet and inches  ( 12\' 3.4\" )",
		"Feet, inches, fractions  ( 12\' 3 5/16\" )"
	];
	$s.$parent.user_page = true
	$s.$on("$destroy", function() {
		console.log(' projectController destroy')
		return $s.$parent.user_page = false
		// return postInfo();
	});
}])