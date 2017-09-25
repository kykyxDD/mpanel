mpanelApp.controller("pdfController", ['$http', '$window', '$location', '$scope', function($h, $w, $l, $s){


	var parent = $s.$parent;

	parent.pdf_page = true;
	$s.index_page = 5;


	$s.$on("$destroy", function() {
		return parent.pdf_page = false
	});

	$s.pdf = {
		src: false,  // get pdf source from a URL that points to a pdf
		data: false, // get pdf source from raw data of a pdf
		error: false
	};

	$s.info_error = [
		{
			text: 'Value cannot be null. Parameter name: text',
			page: {
				name: 'Project', 
				index: 0
			}
		}
	]

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

		return $h({
			method : "post",
			data: data,
			url : url
		}).then(function mySuccess(response) {
			var data = response.data
			if(!data.error){
				parent.all_data['pdf_files'] = data.data
				openPDF(data.data)
			} else {
				$s.pdf.error = data.error
			}
		}, function myError(response) {
			$s.pdf.error = response.data.message;
		});
	}
	var pdf_files = parent.all_data['pdf_files'] || ($l.$$search && $l.$$search.files)

	if(pdf_files && pdf_files.indexOf('.pdf') != -1){
		openPDF(pdf_files)
	} else {
		$s.getPDF()
	}

	function openPDF(name_file){
		$s.view_pdf = true

		var url = $s.api + $s.folder_2 + name_file

		$s.pdf.src = url;  // get pdf source from a URL that points to a pdf
		$s.pdf.data = null; // get pdf source from raw data of a pdf
		$s.pdf.error = false;

		getPdfAsArrayBuffer(url).then(function (response) {
			$s.pdf.data = new Uint8Array(response.data);
		}, function (err) {
			console.log('failed to get pdf as binary:', err);

			$s.pdf.error = err
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
	$s.$on('child_start', function(event,args){
		$s.$emit('child_finish', args)
	});

	parent.load_data = false;
	
}])