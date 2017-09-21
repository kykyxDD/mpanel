mpanelApp.controller("patternController", ['$http', '$window','$scope', function($h, $w, $s){

	var parent = $s.$parent;

	// if(!parent.all_data['pattern']) {
	// 	var obj = parent.searchListPage('seams');
	// 	var id = parent.list_menu.indexOf(obj)
	// 	parent.updatePage(id)
	// 	return
	// }

	// if(PDFObject.supportsPDFs){
	// 	console.log("Yay, this browser supports inline PDFs.");
	// } else {
	// 	console.log("Boo, inline PDFs are not supported by this browser");
	// }
	$s.item_pattern = {};
	$s.url_svg = '';
	$s.dase_url_svg = false;
	$s.big_svg = false;
	$s.small_svg = false;
	var fun_cont_svg = false
	$s.openBig = function(){
		$s.big_svg = !$s.big_svg;
	}
	$s.view_pdf = false;
	var elem_view_pdf = document.querySelector('#view_pdf .view_pdf')

	$s.getPDF = function(argument) {
		if(!$s.id_project) return
		var id = $s.id_project;
		var url = $s.api + dataUrl.pattern.post+id;
		var data = {
			'objFileName': $w.localStorage.getItem('mpanel_obj')
		}
		console.log('data', data)
		return $h({
			method : "post",
			data: data,
			url : url
		}).then(function mySuccess(response) {
			var data = response.data
			if(!data.error){
				
				openPDF(data.data)
			} else {
				// $s.review_error = data.error;
				// parent.load_data = false
				console.log(data.error)
			}
			
		}, function myError(response) {
			var txt = response.data && response.data.message ? response.data.message : 'Error loading model';
			// $s.review_error = response.data && response.data.message ? response.data.message : 'Error loading model';
			console.log('txt', txt)
		});
	}

	function openPDF(name_file){
		console.log('openPDF', name_file);
		$s.view_pdf = true

		var url = $s.api + $s.folder_2 + name_file//'http://192.168.0.119:1234/api2/mp/modelLoad?fileName=2165babb-2992-4be8-97d6-956c68853876_20170919115759__report.pdf'//'example.pdf';

	    $s.pdf = {
	        src: url,  // get pdf source from a URL that points to a pdf
	        data: null // get pdf source from raw data of a pdf
	    };

	    getPdfAsArrayBuffer(url).then(function (response) {
	        $s.pdf.data = new Uint8Array(response.data);
	    }, function (err) {
	        console.log('failed to get pdf as binary:', err);
	    });

	    function getPdfAsArrayBuffer (url) {
	        return $h.get(url, {
	            responseType: 'arraybuffer',
	            headers: {
	                'foo': 'bar'
	            }
	        });
	    }
	}
	$s.closePDF = function(){
		console.log('closePDF');
		$s.view_pdf = false;

		if(elem_view_pdf){
			while(elem_view_pdf.children.length){
				elem_view_pdf.removeChild(elem_view_pdf.children[0])
			}
		}
	}

	$s.$on('child_start', function(event,args){
		$s.$emit('child_finish', args)
	});

	$s.cont_svg = false
	if(parent.all_data['pattern']){
		$s.item_pattern = parent.all_data['pattern'];
		$s.url_svg = $s.item_pattern.svgImage;
	}

	parent.load_data = false;
	
}])