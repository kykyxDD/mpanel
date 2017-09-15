mpanelApp.directive('watchValue', function() {

    function checkValNum(str_num){
        return str_num.replace(/[^0-9.\-\'\"\,\/\s]/gi, '');
    }
    return {
        require: 'ngModel',
        restrict: 'A',
        scope: {
            watchValue: '='
        },
        link: function (scope, el, attr, ngModel) {

            scope.$watch('watchValue', function(newVal) {
                // console.log(attr.class, newVal)
                if(newVal){
                    ngModel.$setViewValue(newVal);
                    ngModel.$render()
                }
            })
        }
    };

})