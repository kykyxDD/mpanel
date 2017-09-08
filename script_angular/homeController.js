
mpanelApp.controller("homeController",['$http', '$window','$scope', function($h, $w, $s){
    $s.message = "This page will be used to display all the students";
    $w.document.title = 'Mpanel';
    console.log('homeController')
    var parent = $s.$parent
    $s.$parent.id_itm_page = -1;

    $s.$parent.itm_page = undefined;
    $s.$parent.home_page = true;

    $s.$on("$destroy", function() {
        $s.$parent.home_page = false
        return true
        // return postInfo();
    });
    $s.$on('child_start', function(event,args){
        parent.home_page = false
        $s.$emit('child_finish', args)
    })
    
}])