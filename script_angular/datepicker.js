mpanelApp.directive('calendar', function () {

    function getStrDate(d){
        var y = d.getFullYear();
        var m = '' + (d.getMonth()+1);
        m = m.length == 1 ? '0'+m : m;
        var day = d.getDate();
        day = day.length == 1 ? '0'+day : day;
        var arr = [
            [y,m,day].join('-'),
            d.toLocaleTimeString(),//[d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()].join(':'),
            d.getUTCMilliseconds(),
            (-d.getTimezoneOffset()/60).toFixed(2)
        ];
        var t_1 = d.toTimeString()

        var z = d.toTimeString().split(' ')[1].replace('GMT','')

        var arr_z = z.split('');
        var str_z = arr_z.slice(0, arr_z.length - 2).join('') + ':' + arr_z.slice(-2).join('');

        //return arr[0]+ 'T'+arr[1] + '.'+arr[2] + str_z;
        return d.toISOString()
    }
    function getObjDate(str){
        var arr_data = str.split("/")
        var date
        if(arr_data.length == 3){
            date = new Date(arr_data[2], +arr_data[1]-1, arr_data[0])   
        } else {
            date = new Date(str)
        }
        return date
    }

    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, el, attr, ngModel) {
            var update = false;
            var label = el[0].labels[0];

            var fun = $(el).datepicker({
                dateFormat: 'dd/mm/yyyy',

                minDate: new Date(2015, 0, 1),
                inline: false,
                onShow: function(dp, animationCompleted){
                    $(dp.el).addClass('show')
                },
                onHide: function(dp, animationCompleted){
                    $(dp.el).removeClass('show')
                },
                onSelect: function (dateText) {
                    update = true

                    var date = getObjDate(dateText);
                    if(date.getDay()){
                        str_date = getStrDate(date);
                    }
                    label.innerText = dateText;

                    ngModel.$setViewValue(str_date);
                }
            });
            el.data_pikaday = fun;
            return scope.$watch(attr.ngModel, function(newValue){
                if(newValue && !update){

                    var date = getObjDate(newValue) 
                    if(date){
                        fun.data('datepicker').selectDate(date);
                    }
                }
            });
        }
    };

})