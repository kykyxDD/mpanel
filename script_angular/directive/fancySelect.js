mpanelApp.directive('fancySelect', function() {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, el, attr, ngModel) {
            var elem = $(el);
            var opt = {};
            var update = false;
            var list = false

            if(attr.fancyDefaultText){
                opt.defaultText = attr.fancyDefaultText;
            }
            var selectBoxIt = $(el).selectBoxIt(opt);
            var fun = selectBoxIt.data("selectBox-selectBoxIt");
            var val = undefined

            $(el).bind({
                'option-click' : function(){
                    if(!update) return
                    val = fun.currentFocus
                    ngModel.$setViewValue(fun.currentFocus)
                    fun.selectOption(val);
                }
            });

            scope.$watch(attr.fancyList, function(newValue){
                // console.log(newValue)
                if(!newValue) return

                // console.log(newValue)

                var arr = [];

                for(var i = 0; i < newValue.length; i++){
                    arr.push({
                        text: newValue[i],
                        value: 'value_'+i
                    })
                };
                update = true
                fun.remove();
                fun.add(arr);
                fun.refresh();
                // console.log(attr.fancyDefaultText, val, newValue.length)
                if(attr.fancyDependence && list){
                    fun.selectOption(0);
                    ngModel.$setViewValue(fun.currentFocus)
                    ngModel.$render()
                } else if(val >= 0){
                    fun.selectOption(val);
                }

                list = true
            })
            scope.$watch(attr.ngModel, function(newValue){
                if(newValue >= 0){ 

                    fun.selectOption(newValue);
                    val = newValue;
                }
            });
        }
    };

})