mpanelApp.directive('focusMe', function () {
	return {
		link: function(scope, el, attrs) {
			var parent = scope.$parent;

			scope.$watch(attrs.focusMe, function(value) {
				if(value === true) {
					el[0].focus();
					// el[0].select();
				} else {
					el[0].blur();
				}
			});
			angular.element(el[0]).on('keydown', function(e){
				if(e.keyCode == 13 || e.keyCode == 9) {
					e.preventDefault();
					if(scope.side){
						parent.blurSide(scope.side)
					} else if(scope.diagonal){
						parent.blurDiagonal(scope.diagonal);
					} else if(scope.corner){
						parent.blurCorner(scope.corner);
					}
				}
			})
		}
	};
});