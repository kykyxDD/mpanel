var dataUrl = {
	project: {
		get:  'api/mp/projectPagePopulate?id=',
		post: 'api/mp/projectPagePopulate?id=',
		new_project: 'api/mp/projectPagePopulate'
	},
	material: {
		get: 'api/mp/materialPagePopulate?id=',
		post: {
			commit: 'api/mp/materialPageCommit?id=',
			selectChange: 'api/mp/materialPageSelectChange?id=' //{id}&selectType={selectType}
		}
	},
	meas: {
		get: 'api/mp/measPagePopulate?id=',
		post: {
			newSide: 'api/mp/measPageNewSideNum?id=',//{id}&polyNum={polyNum}
			commit: 'api/mp/measPageCommit?id='
		}
	},
	calculate: {
		post: 'api/mp/calculateModel?id='
	},
	modelLoad : {
		get: 'api/mp/modelLoad?fileName='
	}
}