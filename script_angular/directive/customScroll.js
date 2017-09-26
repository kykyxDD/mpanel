mpanelApp.directive('customScroll', function() {
    $.mCustomScrollbar.defaults.scrollButtons.enable=true; //enable scrolling buttons by default
    $.mCustomScrollbar.defaults.axis="y"; //enable 2 axis scrollbars by default
    $.mCustomScrollbar.defaults.scrollEasing = "easeInOut"
    $.mCustomScrollbar.defaults.scrollInertia = 300;
    $.mCustomScrollbar.defaults.theme = "3d-thick-dark";

    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, el, attr, ngModel) {
            var elem = $(el);
            var opt = {};
            var update = false;

            $("#content-3dtd").mCustomScrollbar();
            $(".all-themes-switch a").click(function(e){
                e.preventDefault();
                var $this=$(this),
                    rel=$this.attr("rel"),
                    el=$(".content");
                switch(rel){
                    case "toggle-content":
                        el.toggleClass("expanded-content");
                        break;
                }
            });

            scope.$watch(attr.ngModel, function(newValue){
                if(newValue.length){
                    $("#content-3dtd").mCustomScrollbar('update');
                }
            });
            scope.$on('$destroy', function(){
                // console.log('destroy mCustomScrollbar')
                $("#content-3dtd").mCustomScrollbar("destroy");
            })
        }
    };
})