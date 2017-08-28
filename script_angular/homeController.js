
mpanelApp.controller("homeController",['$http', '$window','$scope', function($h, $w, $s){
    $s.message = "This page will be used to display all the students";
    $w.document.title = 'Mpanel';
    console.log('homeController')
    $s.$parent.id_itm_page = 0;
    $s.$parent.home_page = true
    $s.$on("$destroy", function() {
		console.log(' projectController destroy')
		return $s.$parent.home_page = false
		// return postInfo();
	});
    
}])