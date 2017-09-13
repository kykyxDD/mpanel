mpanelApp.directive('scrollSvg', function() {
        return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, el, attr, ngModel) {
            var size_svg = {};
            var size_view = {};
            var get_g;

            function startScroll(url_svg){

                var parser = new DOMParser();
                var doc = parser.parseFromString(url_svg, "image/svg+xml");
                var svg = doc.querySelector('svg');

                el[0].appendChild(svg);

                get_g = svg.querySelector('g');
                rect = svg.querySelector('rect');
                if(rect){
                    // rect.setAttribute('fill', '');
                    rect.parentNode.removeChild(rect)
                }
                if(get_g){
                    get_g.setAttribute('stroke-width', 1);
                }
                size_svg = {
                    w: svg.viewBox.baseVal.width,
                    h: svg.viewBox.baseVal.height
                };
                var elem_view = document.querySelector('.cont_view');

                size_view.w = elem_view.offsetWidth;
                size_view.h = elem_view.offsetHeight;
                get_g.id = 'viewport';

                svg.removeAttribute('viewBox')
                svg.setAttribute('height', size_view.h);
                svg.setAttribute('width', size_view.w);
                var size_g = get_g.getBBox();

                var max_zoom = Math.max(size_svg.w/size_g.width, size_svg.h/size_g.height)/2

                $(svg).svgPan({
                    'viewportId': 'viewport',
                    'max_zoom': max_zoom
                });

                setSize();

            }
            function setSize() {
                var svg = $("svg")[0];
                var p = 0.8;
                var rect = svg.querySelector('rect');
                var s_w = (size_view.w*p)/size_svg.w; 
                var s_h = (size_view.h*p)/size_svg.h;
                var z = Math.max(s_w, s_h);

                var size_g = get_g.getBBox();

                var p_w = ((size_view.w/z)/2 - size_g.width/2)*z;
                var p_h = ((size_view.h/z)/2 - size_g.height/2)*z;

                var a = d = z;
                var b = c = 0;
                var tx = -size_g.x*z + p_w;
                var ty = -size_g.y*z + p_h;
                var arr_matrix = [a, b, c, d, tx, ty];
                get_g.setAttribute('transform', 'matrix('+arr_matrix.join(', ')+')');
            }
            scope.$watch(attr.ngModel, function(newValue){
                if(newValue){
                    //setTimeout(startScroll, 50)
                    startScroll(newValue)
                }
            });
        }
    };

})