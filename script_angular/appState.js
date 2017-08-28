mpanelApp.service('appState', ['$http', '$q', function($http, $q){
    return {
        selectedPage: {},
        interfaceVisible: false,
        ready: $q.defer(),
        
        set_selected_page: function(obj) {
            this.selectedPage = obj
            console.log('set_selected_page',this.selectedPage)
            // this.selectedPageData = this.get_page(name)
        },
        
        load_site_data: function(url, callback) {
            
            /*$http.get(url, {})
            .success(angular.bind(this, function(data, status) {
                
                for (var i=0; i<data.pages.length; i++) {
                    var page = data.pages[i]
                    if ('types' in page) {
                        
                        for (var k=0; k<page.types.length; k++) {
                            var type = page.types[k]
                        
                            for (var j=0; j<page.pages.length; j++) {
                                var itm = page.pages[j]
                                
                                // if (type.type == '*' ) {
                                    
                                    if ('groupInTypeBy' in page) {
                                        if (type.items == null) {
                                            type.items = [[]]
                                        }
                                        
                                        var last_group = type.items[type.items.length-1]
                                        // console.log('last_group',type.items.length-1)
                                        if (last_group.length >= page.groupInTypeBy) {
                                            last_group = []
                                            type.items.push(last_group)
                                        }
                                        last_group.push(itm)
                                        
                                        if (type.all_items == null) {
                                            type.all_items = []
                                        }
                                        type.all_items.push(itm)
                                    }
                                    else {
                                        if (type.items == null) {
                                            type.items = []
                                        }
                                        type.items.push(itm)
                                    }
                                // }
                            }
                        }
                    }
                }
                
                this.data = data
                this.ready.resolve(data)
                callback && callback()
            }))*/
        },
        
        load: function() {
            /*var r = this.ready
            if (!this.data) {
                this.load_site_data('data.json')
            }
            return this.ready.promise*/
            return true
        },
        
        get_page: function(name) {
            /*for (var i=0; i<this.data.pages.length; i++) {
                var p = this.data.pages[i]
                if (p.page == name) {
                    return p
                }
            }*/
        }
    }
}])