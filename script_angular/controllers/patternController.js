mpanelApp.controller("patternController", ['$scope', '$sce', function($s, $sce){

	var parent = $s.$parent;

	// if(!parent.all_data['pattern']) {
	// 	var obj = parent.searchListPage('seams');
	// 	var id = parent.list_menu.indexOf(obj)
	// 	parent.updatePage(id)
	// 	return
	// }

	if(PDFObject.supportsPDFs){
		console.log("Yay, this browser supports inline PDFs.");
	} else {
		console.log("Boo, inline PDFs are not supported by this browser");
	}
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

	$s.openPDF = function(){
		console.log('openPDF');
		$s.view_pdf = true

		var options = {
			// page: 2,
			pdfOpenParams: {
				view: "FitV",
				pagemode: "thumbs" //,
				// search: "lorem ipsum"
			}
		}
		// PDFObject.embed("/pdf/file.php?item=sample-3pp", elem_view_pdf, options);

	}
	$s.closePDF = function(){
		console.log('closePDF');
		$s.view_pdf = false;
		//console.log(elem_view_pdf)
		while(elem_view_pdf.children.length){
			elem_view_pdf.removeChild(elem_view_pdf.children[0])
		}
	}

	$s.$on('child_start', function(event,args){
		$s.$emit('child_finish', args)
	})

	// $s.$watch('big_svg', function(){
	// 	if(!$s.cont_svg || $s.small_svg) return false
	// 	if($s.big_svg){
	// 		// fun_cont_svg = new iScroll($s.cont_svg)
	// 		// setTimeout(function(){
	// 		// 	fun_cont_svg.refresh()
	// 		// }, 100)
			
	// 	} else if(fun_cont_svg){
	// 		// fun_cont_svg.destroy()
	// 	}
	// })
	$s.cont_svg = false
	if(parent.all_data['pattern']){
		$s.item_pattern = parent.all_data['pattern'];
		$s.url_svg = $s.item_pattern.svgImage;
	}

	parent.load_data = false
	
}])