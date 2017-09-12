mpanelApp.directive('scrollSvg', function() {
    function startScroll(){
        var svg = $("svg")[0];
        var cont_svg = document.querySelector('.page_pattern .cont_view')
        var size_svg = {
            w: svg.viewBox.baseVal.width,
            h: svg.viewBox.baseVal.height
        }
        var elem_view = document.querySelector('.cont_view');
        var size_view = {
            w: elem_view.offsetWidth,
            h: elem_view.offsetHeight
        }
        var maxZoom = Math.max(size_svg.h/size_view.h,size_svg.w/size_view.w)
        // var minZoom = Math.min(size_svg.h/size_view.h,size_svg.w/size_view.w)
        // console.log(maxZoom, minZoom)
        // console.log(size_view, size_svg)
        /*$("svg").svgPanZoom({
            // zoomFactor: 1,
            maxZoom: Math.max(3, maxZoom),
            animationTime: 0,
            // limits:{
            //     // x: 0,
            //     // y: 0
            // }
        });*/
        $('svg').svgPan('viewport');
    }
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, el, attr, ngModel) {


            scope.$watch(attr.ngModel, function(newValue){
                // console.log(newValue)
                if(newValue){
                    setTimeout(startScroll, 100)
                }
            });
        }
    };

})