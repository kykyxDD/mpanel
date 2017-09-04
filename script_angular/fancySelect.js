mpanelApp.directive('fancySelect', function() {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, el, attr, ngModel) {
            var elem = $(el);
            var opt = {};
            var update = false;

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
                if(!newValue) return

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
                if(val >= 0){
                    fun.selectOption(val);
                }
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