function mysteryFactory () {
	var me = this;

	me.mystery = 'symmetry';

	me.loadMystery = function(triangle, selected) {

		me[me.mystery](triangle, selected);
	};

	me.symmetry = function (triangle, selected) {

		for (var i = 0; i<triangle.length; i++) {
			for (var j = 0; j<triangle[i].length; j++) {
				triangle[i][j].setAlternative(false);
			}
		}
		
		for (var i = 0; i < selected.length; i++) {
			var rowLast = selected[i].row;
			var select = rowLast - selected[i].column;
			triangle[rowLast][select].setAlternative(true);
			
			console.log('select '+select+' '+triangle[rowLast][select].value);
		}
	};
}