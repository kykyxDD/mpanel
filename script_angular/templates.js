angular.module("mpanelApp").run(["$templateCache", function($templateCache) {$templateCache.put("fabric.html","<div class=\"cont_info page_fabric\"><div class=\"left_path\"><div class=\"cont_img_texture\"><div class=\"item_texture\" style=\"background-image: url({{folder_fabric + material_db.fabRelations[data_fabric.fabricSelectedIndex].fabTypeRelations[data_fabric.fabricTypeSelectedIndex].fabricColorItemsLinks[data_fabric.fabricColorSelectedIndex]}})\" ng-if=\"material_db\"></div></div></div><div class=\"right_path\"><div class=\"cont_list cont_list_select\"><div class=\"cont_select cont_database\"><div class=\"txt\">FABRIC DATABASE</div><select class=\"select_database\" ng-model=\"data_fabric.fabricSelectedIndex\" ng-change=\'updateSelect(\"fabricSelectedIndex\")\' fancy-select=\"\" fancy-default-text=\"FABRIC DATABASE\" fancy-list=\"material_db.fabricItems\"></select></div><div class=\"cont_select cont_brand\"><div class=\"txt\">BRAND SELECTOR</div><select class=\"select_brand\" ng-model=\"data_fabric.fabricTypeSelectedIndex\" fancy-select=\"\" ng-change=\'updateSelect(\"fabricTypeSelectedIndex\")\' fancy-default-text=\"BRAND SELECTOR\" fancy-dependence=\"true\" fancy-list=\"material_db.fabRelations[data_fabric.fabricSelectedIndex].fabricTypeItems\"></select></div><div class=\"cont_select cont_colour\"><div class=\"txt\">COLOUR CHOICE</div><select class=\"select_colour\" ng-model=\"data_fabric.fabricColorSelectedIndex\" fancy-select=\"\" fancy-default-text=\"COLOUR CHOICE\" fancy-dependence=\"true\" fancy-list=\"material_db.fabRelations[data_fabric.fabricSelectedIndex].fabTypeRelations[data_fabric.fabricTypeSelectedIndex].fabricColorItems\"></select></div></div><div class=\"cont_list cont_list_input\"><div class=\"cont_input poll\"><div class=\"cont_name\"><div class=\"name\">Roll width ({{reduction[id_unit]}})</div></div><div class=\"cont_val\"><input class=\"val input_text\" type=\"text\" name=\"poll\" ng-model=\"data_fabric.rollWidthText\" valid-num=\"\" watch-value=\"objUpdateSel.fabricSelectedIndex || objUpdateSel.fabricTypeSelectedIndex ? fabRelations[data_fabric.fabricSelectedIndex].fabTypeRelations[data_fabric.fabricTypeSelectedIndex].rollWidthText : null\"></div></div><div class=\"cont_input override\"><div class=\"cont_name\"><div class=\"name\">Override stretch values</div></div><div class=\"cont_val cont_check\"><input class=\"val input_checkbox\" type=\"checkbox\" name=\"override\" id=\"override\" ng-checked=\"data_fabric.override\" ng-model=\"data_fabric.override\"> <label class=\"label_checkbox\" for=\"override\"></label></div></div><div class=\"cont_input warp_str\"><div class=\"cont_name\"><div class=\"name\">Warp Stretch %</div></div><div class=\"cont_val\"><input class=\"val input_text\" type=\"text\" name=\"warp_str\" disabled=\"\" ng-model=\"data_fabric.warpStretch\" valid-num=\"\" watch-value=\"objUpdateSel.fabricSelectedIndex || objUpdateSel.fabricTypeSelectedIndex ? fabRelations[data_fabric.fabricSelectedIndex].fabTypeRelations[data_fabric.fabricTypeSelectedIndex].warpStretch : null\"></div><div class=\"cont_val\" ng-if=\"data_fabric.override\"><div class=\"name\">Override</div><input class=\"val input_text\" type=\"text\" name=\"warp_str\" ng-model=\"data_fabric.warpStretchOverride\" valid-num=\"\"></div></div><div class=\"cont_input waft_str\"><div class=\"cont_name\"><div class=\"name\">Waft Stretch %</div></div><div class=\"cont_val\"><input class=\"val input_text\" type=\"text\" name=\"waft_str\" disabled=\"\" ng-model=\"data_fabric.weftStretch\" valid-num=\"\" watch-value=\"objUpdateSel.fabricSelectedIndex || objUpdateSel.fabricTypeSelectedIndex ? fabRelations[data_fabric.fabricSelectedIndex].fabTypeRelations[data_fabric.fabricTypeSelectedIndex].weftStretch : null\"></div><div class=\"cont_val\" ng-if=\"data_fabric.override\"><input class=\"val input_text\" type=\"text\" name=\"waft_str\" ng-model=\"data_fabric.weftStretchOverride\" valid-num=\"\"></div></div></div></div></div>");
$templateCache.put("fitting.html","<div class=\"page_fittings\"><div class=\"left_path\"><div class=\"cont_layer\"><div class=\"layer layer_1\"><div class=\"cont_view_color\"><div class=\"cont_color\"><div class=\"color\"></div></div></div><div class=\"cont_all_select\"><div class=\"cont_values\"><div class=\"cont_select cont_hardware\"><div class=\"txt\">HARDWARE DATABASE</div><div class=\"cont_val_select\"><select class=\"select_hardware\" ng-model=\"data_fitting.hardwareSelectedIndex\" fancy-select=\"\" ng-change=\'updateSelect(\"hardwareSelectedIndex\")\' fancy-default-text=\"HARDWARE DATABASE\" fancy-list=\"material_db.hardwareItems\"></select></div></div><div class=\"cont_select cont_webbing\"><div class=\"txt\">EDGE TYPE</div><div class=\"cont_val_select\"><select class=\"select_edge_type\" ng-model=\"data_fitting.hardEdgeTypeSelectedIndex\" fancy-select=\"\" ng-change=\'updateSelect(\"hardEdgeTypeSelectedIndex\")\' fancy-dependence=\"true\" fancy-default-text=\"EDGE TYPE\" fancy-list=\"material_db.hardwareRelations[data_fitting.hardwareSelectedIndex].hardEdgeTypeItems\"></select></div></div><div class=\"cont_select cont_colour\"><div class=\"txt\">COLOUR</div><div class=\"cont_val_select\"><select class=\"select_colour\" ng-model=\"data_fitting.hardColorSelectedIndex\" fancy-select=\"\" fancy-dependence=\"true\" fancy-default-text=\"COLOUR\" fancy-list=\"material_db.hardwareRelations[data_fitting.hardwareSelectedIndex].hardEdgeTypeIRelations[data_fitting.hardEdgeTypeSelectedIndex].hardColorItems\"></select></div></div><div class=\"cont_hem\"><div class=\"cont_color\" style=\"display:none\"><div class=\"color\"></div></div><div class=\"cont_input\"><div class=\"txt\">Hem ({{reduction[id_unit]}})</div><div class=\"cont_val\"><input class=\"input_hem\" type=\"text\" disabled=\"\" ng-model=\"data_fitting.hemText\" valid-num=\"\" watch-value=\"objUpdateSel.hardwareSelectedIndex || objUpdateSel.hardEdgeTypeSelectedIndex ? data_db.hardwareRelations[data_fitting.hardwareSelectedIndex].hardEdgeTypeIRelations[data_fitting.hardEdgeTypeSelectedIndex].hemText : null\"></div></div></div></div></div></div><div class=\"layer layer_2\"><div class=\"cont_view_corner\"><div class=\"cont_img_corn\"><div class=\"img_corn\" ng-if=\"material_db.hardwareRelations[data_fitting.hardwareSelectedIndex].hardEdgeTypeIRelations[data_fitting.hardEdgeTypeSelectedIndex].hardCornerRelations[data_fitting.hardCornorSelectedIndex].exampleImageLinks[data_fitting.exampleImageSelectedIndex]\" style=\"background-image: url({{folder_fitting + material_db.hardwareRelations[data_fitting.hardwareSelectedIndex].hardEdgeTypeIRelations[data_fitting.hardEdgeTypeSelectedIndex].hardCornerRelations[data_fitting.hardCornorSelectedIndex].exampleImageLinks[data_fitting.exampleImageSelectedIndex]}})\"></div></div><div class=\"cont_select cont_corner\"><div class=\"txt\">EXAMPLE CORNER IMAGE</div><select class=\"select_corner\" ng-model=\"data_fitting.exampleImageSelectedIndex\" fancy-select=\"\" fancy-dependence=\"true\" fancy-default-text=\"EXAMPLE CORNER IMAGE\" fancy-list=\"material_db.hardwareRelations[data_fitting.hardwareSelectedIndex].hardEdgeTypeIRelations[data_fitting.hardEdgeTypeSelectedIndex].hardCornerRelations[data_fitting.hardCornorSelectedIndex].exampleImageItems\"></select></div></div><div class=\"cont_all_select\"><div class=\"cont_values\"><div class=\"cont_select cont_finish\"><div class=\"txt\">CORNER HARDWARE</div><div class=\"cont_val_select\"><select class=\"select_finish\" ng-model=\"data_fitting.hardCornorSelectedIndex\" fancy-select=\"\" fancy-dependence=\"true\" fancy-default-text=\"CORNER FINISH\" fancy-list=\"material_db.hardwareRelations[data_fitting.hardwareSelectedIndex].hardEdgeTypeIRelations[data_fitting.hardEdgeTypeSelectedIndex].hardCornorItems\"></select></div></div><div class=\"cont_info_hardware\"><div class=\"cont_input cont_lenght\"><div class=\"txt\">Hardware length ({{reduction[id_unit]}})</div><div class=\"cont_val\"><input class=\"input_lenght\" disabled=\"\" type=\"text\" ng-model=\"data_fitting.cornerLengthText\" valid-num=\"\" watch-value=\"objUpdateSel.hardwareSelectedIndex || objUpdateSel.hardEdgeTypeSelectedIndex || objUpdateSel.hardCornorSelectedIndex ? data_db.hardwareRelations[data_fitting.hardwareSelectedIndex].hardEdgeTypeIRelations[data_fitting.hardEdgeTypeSelectedIndex].hardCornerRelations[data_fitting.hardCornorSelectedIndex].cornerLengthText : null\"></div></div><div class=\"cont_input cont_width\"><div class=\"txt\">Hardware width ({{reduction[id_unit]}})</div><div class=\"cont_val\"><input class=\"input_width\" disabled=\"\" type=\"text\" ng-model=\"data_fitting.cornerWidthText\" valid-num=\"\" watch-value=\"objUpdateSel.hardwareSelectedIndex || objUpdateSel.hardEdgeTypeSelectedIndex || objUpdateSel.hardCornorSelectedIndex ? data_db.hardwareRelations[data_fitting.hardwareSelectedIndex].hardEdgeTypeIRelations[data_fitting.hardEdgeTypeSelectedIndex].hardCornerRelations[data_fitting.hardCornorSelectedIndex].cornerWidthText : null\"></div></div><div class=\"cont_checkbox_circle\"><div class=\"txt\">Fit hardware circle in corner</div><div class=\"cont_check\"><input class=\"checkbox_circle\" type=\"checkbox\" id=\"checkbox_circle\" name=\"checkbox_circle\" disabled=\"\"> <label class=\"label_circle\" for=\"checkbox_circle\"></label></div></div></div><div class=\"cont_select cont_shackle\"><div class=\"txt\">CORNER LINK</div><div class=\"cont_val_select\"><select class=\"select_corner_link\" ng-model=\"data_fitting.hardLinkSelectedIndex\" fancy-select=\"\" ng-change=\'updateSelect(\"hardLinkSelectedIndex\")\' fancy-dependence=\"true\" fancy-default-text=\"CORNER LINK\" fancy-list=\"material_db.hardwareRelations[data_fitting.hardwareSelectedIndex].hardLinkItems\"></select></div></div><div class=\"cont_input cont_link\"><div class=\"txt\">Link length({{reduction[id_unit]}})</div><div class=\"cont_val\"><input class=\"input_link\" type=\"text\" ng-model=\"data_fitting.linkLengthText\" ng-class=\"{disabled: !data_db.hardwareRelations[data_fitting.hardwareSelectedIndex].hardLinkRelations[data_fitting.hardLinkSelectedIndex].linkLengthAllowToChange}\" valid-num=\"\" watch-value=\"objUpdateSel.hardwareSelectedIndex || objUpdateSel.hardLinkSelectedIndex ? data_db.hardwareRelations[data_fitting.hardwareSelectedIndex].hardLinkRelations[data_fitting.hardLinkSelectedIndex].linkLengthText : null\"></div></div></div></div></div></div></div><div class=\"right_path\"><div class=\"cont_details\"><div class=\"title_details\">DETAILS</div><div class=\"cont_input cont_thread\"><div class=\"txt\">Thread</div><div class=\"cont_val\"><input class=\"input_thread\" type=\"text\" ng-model=\"data_fitting.thread\"></div></div><div class=\"cont_input cont_accessories\"><div class=\"txt\">Accessories</div><div class=\"cont_val\"><input class=\"input_accessories\" type=\"text\" ng-model=\"data_fitting.accessories\"></div></div><div class=\"cont_input cont_internal\"><div class=\"txt\">Internal seam width ({{reduction[id_unit]}})</div><div class=\"cont_val\"><input class=\"input_internal\" type=\"text\" ng-model=\"data_fitting.seamText\" valid-num=\"\"><div class=\"btn_help\">?<div class=\"popup\"><div class=\"cont_popup\">This allowance will be added to both sides of each seam</div></div></div></div></div><div class=\"cont_input cont_reinfo\"><div class=\"txt\">Corner reinforcement size ({{reduction[id_unit]}})</div><div class=\"cont_val\"><input class=\"input_reinfo\" type=\"text\" ng-model=\"data_fitting.reoText\" valid-num=\"\"></div></div><div class=\"cont_input cont_diameter\"><div class=\"txt\">Pole diameter ({{reduction[id_unit]}})</div><div class=\"cont_val\"><input class=\"input_diameter\" type=\"text\" ng-model=\"data_fitting.poleDiameterText\" valid-num=\"\"></div></div><div class=\"cont_input cont_angle\"><div class=\"txt\">Pole lean angle degress</div><div class=\"cont_val\"><input class=\"input_angle\" type=\"text\" ng-model=\"data_fitting.poleAngle\" valid-num=\"\"></div></div><div class=\"cont_input cont_height\"><div class=\"txt\">Pole added height ({{reduction[id_unit]}})</div><div class=\"cont_val\"><input class=\"input_height\" type=\"text\" ng-model=\"data_fitting.poleExtraHeight\" valid-num=\"\"><div class=\"btn_help\">?<div class=\"popup\"><div class=\"cont_popup\">This wiil extend the post above the connection height for visualisation purposes only</div></div></div></div></div></div></div></div>");
$templateCache.put("home.html","<div class=\"logo\"></div><div class=\"form\"><div class=\"left\"><div class=\"title\">Get started with</div><div class=\"cont_btn\"><div class=\"my_btn btn_home grad_orange\"><a class=\"link\" href=\"http://mpanel.com/\"></a></div><div class=\"my_btn btn_open grad_blue\"><a class=\"link\">Open</a></div></div></div><div class=\"right\"><div class=\"cont_btn\"><div class=\"my_btn learn grad_blue\"><a class=\"link\" href=\"https://www.youtube.com/playlist?list=PLlFQftmRED8vTFU01XcvMzOGieBj-IGWJ\">Learn</a></div><div class=\"my_btn setting\"><a class=\"link\" href=\"#user\"></a></div></div><div class=\"cont_btn\"><div class=\"my_btn news grad_blue\"><a class=\"link\" href=\"http://mpanel.com/news/\">news</a></div><div class=\"my_btn help\"><a class=\"link\" ng-href=\"{{host_helper}}/source/html/hs10.htm\"></a></div></div></div></div><div class=\"btn_start grad_orange\"><a class=\"link\" ng-click=\"$parent.updatePage(0)\">start</a></div>");
$templateCache.put("pattern.html","<div class=\"cont_info page_pattern\"><div class=\"left_path\"><div class=\"cont_view\" ng-class=\"{big_svg: big_svg}\"><div class=\"cont_svg\" ng-model=\"url_svg\" scroll-svg=\"\"></div></div></div><div class=\"right_path\"><div class=\"cont_table_info\"><table class=\"table_info table_bill\"><thead class=\"thead\"><tr><td class=\"item\">Item</td><td class=\"qty\">Qty</td><td class=\"unit\">Unit</td><td class=\"desc\">Description</td><td class=\"unit_cost\">Unit Cost</td><td class=\"exit_cost\">Ext Cost</td><td class=\"unit_weight\">Unit Weight</td><td class=\"exit_weight\">Ext Weight</td></tr></thead><tbody class=\"tbody\"><tr ng-repeat=\"itm in item_pattern.estimateBillInfo\"><td class=\"td_item\">{{itm.name}}</td><td class=\"td_qty\">{{itm.quantity}}</td><td class=\"td_unit\">{{itm.units}}</td><td class=\"td_desc\">{{itm.description}}</td><td class=\"td_unit_cost\">{{itm.unitCost}}</td><td class=\"td_exit_cost\">{{itm.extCost}}</td><td class=\"td_unit_weight\">{{itm.unitWeight}}</td><td class=\"td_exit_weight\">{{itm.extWeight}}</td></tr></tbody></table></div><div class=\"cont_last_info\"><div class=\"cont_table_edges\"><div class=\"title_info\">EDGES</div><table class=\"table_info table_edges\"><thead class=\"thead\"><tr><td class=\"edge\">Edge</td><td class=\"lenght\">Edge length</td><td class=\"cable\">Cable length</td></tr></thead><tbody class=\"tbody\"><tr ng-repeat=\"itm in item_pattern.estimateEdgeInfo\"><td class=\"td_edge\">{{itm.name}}</td><td class=\"td_lenght\">{{itm.edgeLength}}</td><td class=\"td_cable\">{{itm.cableLength}}</td></tr></tbody></table></div><div class=\"cont_btn\"><div class=\"my_btn make_pdf grad_blue\" ng-click=\"getPDF()\" ng-class=\"{disabled: pdf && pdf.error}\">Make PDF</div><div ng-if=\"pdf.error\" class=\"text_error\"><div class=\"text\">{{pdf.error.text || pdf.error}}</div><div ng-if=\"pdf.error.page\" class=\"next_page\">Go to the page<div class=\"page\" ng-click=\"updatePage(pdf.error.index)\">{{pdf.error.page}}</div></div></div><div class=\"my_btn save_pattern grad_orange disabled\">Save Pattern</div></div></div></div><div id=\"view_pdf\" ng-class=\"{view: view_pdf }\"><div class=\"cont_view\"><div class=\"itm_pdf\"><div class=\"close_pdf my_btn\" ng-click=\"closePDF()\"></div><div class=\"view_pdf\" id=\"pdfRendered\" ng-if=\"pdf && pdf.src\"><pdfjs-viewer sidebar-toggle=\"false\" view-bookmark=\"false\" print=\"false\" open=\"false\" view-find=\"false\" data=\"pdf.data\"></pdfjs-viewer></div></div></div></div></div>");
$templateCache.put("project.html","<div class=\"cont_info page_project\"><div class=\"cont_form\"><div class=\"left_path\"><div class=\"cont_val_input client\"><div class=\"txt\">client <span class=\"star\"></span></div><div class=\"cont_input\"><input type=\"text\" name=\"client\" ng-class=\"{error: data_error.clientName}\" ng-model=\"data_project.clientName\" ng-focus=\'focusText(\"clientName\")\' ng-blur=\'blurText(\"clientName\", data_project.clientName)\'></div></div><div class=\"cont_val_input project\"><div class=\"txt\">project name <span class=\"star\"></span></div><div class=\"cont_input\"><input type=\"text\" name=\"project\" ng-class=\"{error: data_error.projectName}\" ng-model=\"data_project.projectName\" ng-focus=\'focusText(\"projectName\")\' ng-blur=\'blurText(\"projectName\", data_project.projectName)\'></div></div><div class=\"cont_list_input\"><div class=\"cont_val_input quantity\"><div class=\"txt\">quantity required</div><div class=\"cont_input\"><input type=\"text\" name=\"quantity\" ng-model=\"data_project.quantity\" ng-change=\'validNum(\"quantity\")\'></div></div><div class=\"cont_val_input date_required\"><div class=\"txt\">date required</div><div class=\"cont_input cont_date\"><input type=\"text\" id=\"date_required\" ng-model=\"data_project.requestDate\" calendar=\"\"> <label for=\"date_required\"></label><div class=\"label_date\"></div></div></div><div class=\"cont_val_input sail\"><div class=\"txt\">sail number</div><div class=\"cont_list_val\"><div class=\"cont_input\"><input type=\"text\" name=\"sail_if\" ng-model=\"data_project.sailNumber\" ng-change=\'validNum(\"sailNumber\")\'></div><div class=\"text\">of</div><div class=\"cont_input\"><input type=\"text\" name=\"sail_of\" ng-model=\"data_project.sailOf\" ng-change=\'validNum(\"sailOf\")\'></div></div></div></div></div><div class=\"right_path\"><div class=\"cont_val_input proj_num\"><div class=\"txt\">project number</div><div class=\"cont_input\"><input type=\"text\" name=\"proj_num\" ng-model=\"data_project.projectNumber\" ng-change=\'validNum(\"projectNumber\")\'></div></div><div class=\"cont_val_input date_entered\"><div class=\"txt\">date entered</div><div class=\"cont_input cont_date\"><input type=\"text\" id=\"date_entered\" ng-model=\"data_project.enteredDate\" calendar=\"\"> <label for=\"date_entered\"></label><div class=\"label_date\"></div></div></div><div class=\"cont_val_input entered_by\"><div class=\"txt\">entered by</div><div class=\"cont_input\"><input type=\"text\" name=\"entered_by\" ng-model=\"data_project.enteredBy\"></div></div></div></div><div class=\"cont_form_bottom\"><div class=\"cont_val_textarea desc\"><div class=\"txt\">description</div><div class=\"cont_textarea\"><textarea name=\"description\" ng-model=\"data_project.description\"></textarea></div></div><div class=\"cont_units\"><div class=\"txt\">UNITS</div><select class=\"select_units\" id=\"select_units\" fancy-select=\"\" fancy-default-text=\"Units\" fancy-list=\"data_project.units\" fancy-index=\"data_project.unitIndex\" ng-model=\"data_project.unitIndex\"></select></div></div></div>");
$templateCache.put("review.html","<div class=\"info page_review\"><div class=\"info_text\"><div class=\"cont_result\"><div ng-if=\"review_error || data_error\" class=\"text_error_list\">{{data_error || review_error}}</div><div ng-if=\"!review_error && data_review.messages.length\" class=\"mCustomScrollbar _mCS_1\" id=\"content-3dtd\" custom-scroll=\"\" ng-model=\"data_review.messages\"><div class=\"text\"><span ng-repeat=\"mess in data_review.messages\" ng-class=\"arr_class[data_review.messageTypes[$index]]\">{{mess}}</span></div></div></div><div class=\"cont_color_key\"><div class=\"title_color_key\">colour key<div class=\"btn_help\">?<div class=\"popup\"><div class=\"cont_popup\">Orange comments are design advice and indicate that some elements of the design may be less than optimal - it does not prevent you progressing with the design.<br>Red warnings on the other hand, prevent progress and require that dimensions be checked in order to correct.</div></div></div></div><div class=\"text green\"><span class=\"text_green\">Green text:</span> Design progress is OK</div><div class=\"text orange\"><span class=\"text_orange\">Orange text:</span> Warnings about the design</div><div class=\"text red\"><span class=\"text_red\">Red text:</span> A problem that prevents the design from completing</div></div></div><div class=\"graphics\"><div class=\"cont_button top\"><div class=\"my_btn isometric\" ng-class=\"{disabled: data_error || review_error }\" ng-click=\"isometricClick()\">isometric</div><div class=\"my_btn right\" ng-class=\"{disabled: data_error || review_error }\" ng-click=\"rightClick()\">right</div><div class=\"my_btn front\" ng-class=\"{disabled: data_error || review_error }\" ng-click=\"frontClick()\">front</div><div class=\"my_btn top\" ng-class=\"{disabled: data_error || review_error }\" ng-click=\"topClick()\">top</div><div ng-if=\"arr_url.length > 1\" ng-click=\"editNumModel(0)\" ng-class=\"{active :index_model == 0, disabled: data_error || review_error }\" class=\"my_btn model_1\">1</div><div ng-if=\"arr_url.length > 1\" ng-click=\"editNumModel(1)\" ng-class=\"{active :index_model == 1, disabled: data_error || review_error }\" class=\"my_btn model_2\">2</div><div class=\"cont_btn_screen\"><div class=\"btn screen my_btn grad_blue\" ng-click=\"getScreen()\" ng-class=\"{disabled: !data_review || !data_review.objModelName || review_error}\">screen capture</div><div class=\"btn_help\">?<div class=\"popup\"><div class=\"cont_popup\">This will save the current visualization to your downloads folder</div></div></div></div></div><div class=\"word\"><div id=\"threejs\" class=\"threejs\" ng-class=\"{error: review_error}\"><div ng-if=\"review_error\" class=\"text_error\">Error loading model</div></div></div></div></div>");
$templateCache.put("seams.html","<div class=\"cont_info page_seams\"><div class=\"left_path\"><div class=\"cont_view\"><div class=\"load_img\" ng-class=\"{show: load_img && !seams_error}\"></div><div class=\"view\" ng-if=\"!seams_error && src_imageModelName\" style=\"background-image:url({{src_imageModelName}})\"></div><div class=\"seams_error\" ng-if=\"seams_error\">{{seams_error}}</div></div><div class=\"cont_num_panels\"><div class=\"cont_count\"><div class=\"text\">number of panels</div><div class=\"elem_count\"><div class=\"btn_minus\" ng-click=\"prevPanels()\" ng-class=\"{off: item_seams.selectedNPanels == 0 }\"></div><div class=\"val_num\">{{item_seams.nPanels[item_seams.selectedNPanels]}}</div><div class=\"btn_plus\" ng-click=\"nextPanels()\" ng-class=\"{off: item_seams.selectedNPanels == item_seams.nPanels.length-1 }\"></div></div></div></div></div><div class=\"right_path\"><div class=\"info\"><div class=\"info_text\"><div class=\"cont_result\"><div class=\"preload\" ng-class=\"{show:load_pattern}\"></div><div ng-if=\"pattern_error || data_error\" class=\"text_error_list\">{{data_error || pattern_error}}</div><div ng-if=\"!pattern_error && data_pattern.messages.length\" class=\"mCustomScrollbar _mCS_1\" id=\"content-3dtd\" custom-scroll=\"\" ng-model=\"data_pattern.messages\"><div class=\"text\"><span ng-repeat=\"mess in data_pattern.messages track by $index\" ng-class=\"arr_class[data_pattern.messageTypes[$index]]\">{{mess}}</span></div></div></div></div></div><div class=\"cont_info_select\"><div class=\"cont_select cont_warp\"><div class=\"txt\">WARP DIRECTION</div><select class=\"select_warp\" ng-change=\"updateSeams()\" id=\"select_warp\" fancy-select=\"\" fancy-default-text=\"WARP DIRECTION\" fancy-list=\"item_seams.warpDir\" ng-model=\"item_seams.selectedWarpDir\"></select></div><div class=\"btn_help\">?<div class=\"popup\"><div class=\"cont_popup\">Warp is direction of fabric coming off the roll</div></div></div></div><div class=\"cont_straight\"><div class=\"cont_check\"><input class=\"straight\" type=\"checkbox\" id=\"straight\"> <label for=\"straight\"></label></div><div class=\"text\">Straighten Seams<div class=\"btn_help\">?<div class=\"popup\"><div class=\"cont_popup\">Check this to straighten seams</div></div></div></div></div><div class=\"cont_info_select\"><div class=\"cont_select cont_tag\"><div class=\"txt\">TAG CORNER</div><select class=\"select_tag\" id=\"select_tag\" ng-change=\"updateSeams()\" fancy-select=\"\" fancy-default-text=\"TAG CORNER\" fancy-list=\"item_seams.tagCorner\" ng-model=\"item_seams.selectedTagCorner\"></select></div></div><div class=\"cont_btn_make\"><div class=\"my_btn grad_blue btn_make\" ng-click=\"getMake()\" ng-class=\"{disabled: !item_seams.tagCorner}\">make panels</div><div class=\"btn_help\">?<div class=\"popup\"><div class=\"cont_popup\">This button creates the pattern - you cannot proceed without pressing this</div></div></div></div></div></div>");
$templateCache.put("shape.html","<div class=\"page_shape\"><div class=\"left_path\"><div class=\"cont_text_hind\"><div class=\"cont_check\"><input class=\"tension\" type=\"checkbox\" id=\"tension\"> <label class=\"tension\" for=\"tension\"></label></div><div class=\"txt_tension\">Same tension on all edges (required if continuous cable)</div><div class=\"btn_help\">?<div class=\"popup\"><div class=\"cont_popup\">Check this for all cable edge sails with any corner hardware which allows the cable slip around the corner (i.e. one continuous cable)</div></div></div></div><div class=\"cont_figure\"><canvas class=\"canvas\" id=\"canvas_shape\" height=\"430\" width=\"430\" style=\"background: rgb(255, 255, 255);\"></canvas></div><div class=\"cont_count\"><div class=\"text\">number of sides</div><div class=\"elem_count\"><div class=\"btn_minus\" ng-click=\"minusNum()\" ng-class=\"{off: item_num == min_edge}\"></div><div class=\"val_num\">{{item_num}}</div><div class=\"btn_plus\" ng-click=\"plusNum()\" ng-class=\"{off: item_num == max_edge}\"></div></div></div></div><div class=\"right_path\"><div class=\"cont_sides_diagonals\"><div class=\"cont_sides\"><div class=\"title_cont\">sides<div class=\"btn_help\">?<div class=\"popup\"><div class=\"cont_popup\">Dimensions taken directly between sail connection points</div></div></div></div><div class=\"cont_table_sides\"><table class=\"table_info table_sides\"><thead class=\"thead thead_sides\"><tr><td class=\"side\">Side</td><td class=\"measurement\">Measurement</td><td class=\"type\">Type</td><td class=\"dip\"><div class=\"txt\">Dip/ Span %</div><div class=\"cont_btn_help\"><div class=\"btn_help\">?<div class=\"popup\"><div class=\"cont_popup\">Edge curve depth as % of span e.g. for edge length of 10m and d/s of 8% will give a curve depth of approx 800mm. NB this will vary when using very long link lengths.</div></div></div></div></td><td class=\"fixed\">Fixed</td><td class=\"mid\">Mid support</td></tr></thead><tbody class=\"tbody tbody_sides\"><tr ng-repeat=\"side in item_shape.sideParameters\"><td class=\"td_side\">{{side.name}}</td><td class=\"td_meas td_input_red\"><input class=\"input_meas\" type=\"text\" ng-model=\"side.pointToPointSize\" valid-num=\"\" ng-focus=\"focus(side.name)\" ng-blur=\'blur(side, \"size\")\' focus-me=\"side.focus\"> <label class=\"label\" ng-class=\"{error: side.negative}\"></label><div class=\"val_red\">{{reduction[id_unit]}}</div></td><td class=\"td_type\"><select class=\"td_select select_type\" fancy-select=\"\" fancy-default-text=\"\" fancy-list=\"item_shape.hemItems\" fancy-index=\"side.selectedHemType\" ng-model=\"side.selectedHemType\"></select></td><td class=\"td_dip\"><select class=\"td_select select_dip\" fancy-select=\"\" fancy-default-text=\"\" fancy-list=\"item_shape.dipItems\" fancy-index=\"side.selectedDip\" ng-model=\"side.selectedDip\"></select></td><td class=\"td_fixed\"><div class=\"cont_check\"><input class=\"fixed\" type=\"checkbox\" id=\"fixed_{{side.name}}\" ng-checked=\"side.isFixed\" ng-model=\"side.isFixed\"> <label for=\"fixed_{{side.name}}\"></label></div></td><td class=\"td_mid\"><div class=\"cont_check\"><input class=\"mid\" type=\"checkbox\" id=\"mid_{{side.name}}\" ng-checked=\"side.isMidSupport\" ng-model=\"side.isMidSupport\"> <label for=\"mid_{{side.name}}\"></label></div></td></tr></tbody></table></div></div><div class=\"cont_diagonals\" ng-show=\"item_shape.diagonalParameters.length\"><div class=\"title_cont\">diagonals</div><div class=\"cont_table_diagonals\"><table class=\"table_info table_diagonals\"><thead class=\"thead thead_diagonals\"><tr><td class=\"diagonal\">Diagonal</td><td class=\"measurement\">Measurement</td></tr></thead><tbody class=\"tbody tbody_diagonals\"><tr ng-repeat=\"diagonal in item_shape.diagonalParameters\"><td class=\"td_diag\">{{diagonal.name}}</td><td class=\"td_meas td_input_red\"><input class=\"input_meas_diag\" type=\"text\" ng-model=\"diagonal.value\" ng-focus=\"focus(diagonal.name)\" ng-blur=\'blur(diagonal, \"diag\")\' valid-num=\"\" focus-me=\"diagonal.focus\"> <label class=\"label\" ng-class=\"{error: diagonal.negative}\"></label><div class=\"div_m_red val_red\">{{reduction[id_unit]}}</div></td></tr></tbody></table></div></div></div><div class=\"cont_corners\"><div class=\"title_cont\">corners</div><div class=\"cont_table_corners\"><table class=\"table_info table_corners\"><thead class=\"thead thead_corners\"><tr><td class=\"corner\">Corner</td><td class=\"height\">Height</td><td class=\"finish\">Finish</td><td class=\"link\">Link</td><td class=\"length\">Link Length</td></tr></thead><tbody class=\"tbody tbody_corners\"><tr ng-repeat=\"corner in item_shape.cornerParameters\"><td class=\"td_corner\">{{corner.name}}</td><td class=\"td_height td_input_red\"><input class=\"input_h\" type=\"text\" ng-model=\"corner.height\" ng-blur=\'blur(corner, \"corn\")\' valid-num=\"\" focus-me=\"corner.focus\"> <label class=\"label\" ng-class=\"{error: corner.negative}\"></label><div class=\"div_h_red val_red\">{{reduction[id_unit]}}</div></td><td class=\"td_finish\"><select class=\"td_select select_finish\" ng-model=\"corner.selectedHardware\" fancy-select=\"\" fancy-default-text=\"\" fancy-list=\"item_shape.hardwareItems\" fancy-index=\"corner.selectedHardware\"></select></td><td class=\"td_link\"><select class=\"td_select select_link\" ng-model=\"corner.selectedLink\" fancy-select=\"\" fancy-default-text=\"\" fancy-list=\"item_shape.linkItems\" fancy-index=\"corner.selectedLink\"></select></td><td class=\"td_length td_input_red\"><input class=\"input_l\" type=\"text\" ng-model=\"corner.linkLength\" valid-num=\"\"> <label class=\"label\"></label></td></tr></tbody></table></div></div></div></div>");
$templateCache.put("user.html","<div class=\"cont_info page_user\"><div class=\"left_path\"><div class=\"elem_name\"><input class=\"input_name\" type=\"text\" name=\"name\" placeholder=\"COMPANY NAME\"></div><div class=\"drag\"></div><div class=\"set_image\"><span class=\"text\">Add your Company Logo</span> <label class=\"my_btn label_img\">Browse<input class=\"browse\" type=\"file\" accept=\"image/*\"></label></div><div class=\"small_title\">UNITS</div><div class=\"change_units\"><select class=\"select_units\" id=\"select_units\" fancy-select=\"\" fancy-default-text=\"Units\" fancy-list=\"units\" fancy-index=\"\" ng-model=\"model_units\"></select></div><div class=\"set_file_name\"><input class=\"file_name\" type=\"text\" name=\"file_name\" placeholder=\"FILE NAME\"></div><div class=\"cont_save\"><input class=\"my_btn btn_save\" type=\"submit\" value=\"Save\"></div></div><div class=\"right_path\"><div class=\"change_units\"><select class=\"select_units\" id=\"select_units\" fancy-select=\"\" fancy-default-text=\"PLOTTER EXPORT STYLE\" fancy-list=\"styles\" fancy-index=\"\" ng-model=\"model_styles\"></select></div></div></div>");}]);