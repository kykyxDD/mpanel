mpanelApp.directive('validNum', function() {

    function checkValNum(str_num){
        return str_num.replace(/[^0-9.\-\'\"\,\/\s]/gi, '');
    }
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, el, attr, ngModel) {
            el[0].addEventListener('input', function(){
                var str = checkValNum(this.value)
                if(str != this.value){
                    ngModel.$setViewValue(str);
                    this.value = str
                };
            });
        }
    };

})