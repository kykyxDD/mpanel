mpanelApp.controller("homeController",['conts', '$http', '$window','$scope', function(conts, $h, $w, $s){
    $s.message = "This page will be used to display all the students";
    $w.document.title = 'Mpanel';
    console.log('homeController')
    var parent = $s.$parent
    parent.id_itm_page = -1;

    parent.itm_page = undefined;
    parent.home_page = true;

    $s.$on("$destroy", function() {
        parent.home_page = false
        return true
    });
    $s.$on('child_start', function(event,args){
        parent.home_page = false
        $s.$emit('child_finish', args)
    });
    $s.dll_file = false;
    function clearData(){
        for(var key in parent.all_data){
            delete parent.all_data[key];
        }

        if($w.localStorage.getItem(conts.obj)){
            $w.localStorage.removeItem(conts.obj);
        }
        if(parent.mpanel){
            parent.mpanel = false;
        }
        $w.localStorage.removeItem(conts.unit);
    }

    $s.openProject = function(event){

        var url = $s.api + dataUrl.loadFile

        var fd = new FormData();
        fd.append('file', event.files[0]);

        if(parent.id_project){
            url += '?id='+parent.id_project
        }
        return $h({
            method : "post",
            url : url,
            data: fd,
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(function mySuccess(response) {
            var data = response.data;
            if(!data.error){
                var id = data.data;
                parent.id_project = id
                $w.localStorage.setItem(conts.id, id);
                clearData()
                parent.updatePage(0);
            } else {
                errorLoad(data.error) 
            }
        }, function myError(response) {
            var txt = response.data && response.data.message ? response.data.message : 'Error';
            errorLoad(text) 
        })
    };

    function errorLoad(text) {
        $s.error_file = text

        setTimeout(function(){
            if($s.error_file){
                $s.error_file = false;
                $s.$apply();
            }
        },2000)
    }

}]);
