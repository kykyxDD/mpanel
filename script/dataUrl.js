var dataUrl = {
	material_db: 'data/material_db.json',
	// material_db: 'data/material_db_1.json',
	project: {
		//projectPageCommit?id={id}
		get:  'mp/projectPagePopulate?id=',
		post: 'mp/projectPageCommit?id=',
		new_project: 'mp/projectPageCommit'
	},
	material: {
		get: 'mp/materialPagePopulate?id=',
		post: {
			commit: 'mp/materialPageCommit?id=',
			selectChange: 'mp/materialPageSelectChange?id=' //{id}&selectType={selectType}
		}
	},
	meas: {
		get: 'mp/measPagePopulate?id=',
		demo: 'mp/measPageLoadDefault?id=', //{id}&polyNum={polyNum}'
		post: {
			newSide: 'mp/measPageNewSideNum?id=',//{id}&polyNum={polyNum}
			commit: 'mp/measPageCommit?id='
		}
	},
	calculate: {
		post: 'mp/calculateModel?id=',
		update: 'mp/updateSeams?id='
	},
	modelLoad : {
		get: 'mp/modelLoad?fileName='
	},
	seams: {
		post: 'mp/calculatePanel?id=',

	},
	getIsFileExist: {
		get: 'mp/isFileExist?fileName='
	},
	pattern: {
		post: 'mp/createPdf?id='
	}
}