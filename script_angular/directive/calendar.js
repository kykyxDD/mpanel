mpanelApp.directive('calendar', function () {

    function getStrDate(d){
        var y = d.getFullYear();
        var m = '' + (d.getMonth()+1);
        m = m.length == 1 ? '0'+m : m;
        var day = '' + d.getDate();
        day = day.length == 1 ? '0'+day : day;
        var num_hours = '' + d.getHours();
        num_hours = num_hours.length == 1 ? '0'+num_hours : num_hours;

        var num_min = '' + d.getMinutes();
        num_min = num_min.length == 1 ? '0'+num_min : num_min;

        var num_sec = '' + d.getSeconds();
        num_sec = num_sec.length == 1 ? '0'+num_sec : num_sec;

        var arr = [
            [y,m,day].join('-'),
            [num_hours, num_min, num_sec].join(':') //,
            // d.getUTCMilliseconds(),
            // (-d.getTimezoneOffset()/60).toFixed(2)
        ]
        return arr[0]+ 'T'+arr[1] +'Z';
    }
    function getObjDate(str){
        var arr_data = str.split("/")
        var date
        if(arr_data.length == 3){
            date = new Date(arr_data[2], +arr_data[1]-1, arr_data[0])   
        } else if(str.indexOf('T')){
            var arr_data = str.split("T")
            var arr_day = arr_data[0].split("-");
            var arr_time = arr_data[1].split(":");
            var sec = arr_time[2] ? arr_time[2].substr(0,2) : 00;
            date = new Date(arr_day[0], +arr_day[1]-1, arr_day[2], arr_time[0],  arr_time[1] ,  sec);
        } else {
            date = new Date(str)
        }
        // console.log('date',date)
        return date
    }
    var minDate = new Date('01 01 2015');

    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, el, attr, ngModel) {
            var update = false;
            var id = el[0].getAttribute('id')
//            var label = el[0].labels[0];
            var label = document.querySelector('label[for='+id+']')

            var fun = $(el).datepicker({
                dateFormat: 'dd/mm/yyyy',

                // minDate: new Date(2015, 0, 1),
                inline: false,
                onShow: function(dp, animationCompleted){
                    $(dp.el).addClass('show')
                },
                onHide: function(dp, animationCompleted){
                    $(dp.el).removeClass('show')
                },
                onSelect: function (dateText) {
                    update = true
                    var str_date = '';

                    var date = getObjDate(dateText);
                    if(date.getDay()){
                        str_date = getStrDate(date);
                        label.innerText = dateText;

                        // console.log('str_date', str_date, dateText)

                        ngModel.$setViewValue(str_date);
                        ngModel.$render()
                    }

                }
            });
            el.data_pikaday = fun;
            return scope.$watch(attr.ngModel, function(newValue){
                if(newValue && !update){
                    // console.log('newValue',newValue)
                    var date = getObjDate(newValue);
                    if(date){
                        if(date < minDate){
                            fun.data('datepicker').selectDate(minDate);
                        } else {
                            fun.data('datepicker').selectDate(date);
                        }
                    }
                } else if(!newValue){
                    // console.log('newValue', newValue)
                    // fun.data('datepicker').selectDate(new Date());
                }
            });
        }
    };

})