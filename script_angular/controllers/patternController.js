mpanelApp.controller("patternController", ['conts','$http', '$window','$scope', function(conts,$h, $w, $s){

	var parent = $s.$parent;

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
	];

	parent.load_data = false;

	$s.item_pattern = {};
	$s.url_svg = '';

	$s.view_pdf = false;
	var elem_view_pdf = document.querySelector('#view_pdf .view_pdf');

	$s.getPDF = function(argument) {
		if(!$s.id_project) return
		var id = $s.id_project;
		var url = $s.api + dataUrl.pattern.post+id;
		var data = {
			'objFileName': $w.localStorage.getItem(conts.obj)
		}

		return $h({
			method : "post",
			data: data,
			url : url
		}).then(function mySuccess(response) {
			var data = response.data
			if(!data.error){
				$w.open('#/pdf?files='+data.data, "_blank");
			} else {
				var error = data.error
				if(error.code){
					$s.pdf.error = {
						code: error.code,
						text: error.message ? error.message : $s.info_error[error.code].text,
						page: $s.info_error[error.code].page.name,
						index: $s.info_error[error.code].page.index

					}
				} else {
					$s.pdf.error = error
				}
			}
		}, function myError(response) {
			var txt = response.data && response.data.message ? response.data.message : 'Error loading model';

			$s.pdf.error = txt
		});
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