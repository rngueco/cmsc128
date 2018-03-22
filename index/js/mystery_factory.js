function mysteryFactory () {
	var me = this;

	me.selection = [];

	me.mystery = 'powersof2';

	var reset = function(triangle) {
		for (var i = 0; i<triangle.length; i++) {
			for (var j = 0; j<triangle[i].length; j++) {
				triangle[i][j].setAlternative(false);
			}
		}
	};

	me.loadMystery = function(triangle, index, isAdd) {

		if (isAdd) me.selection.push(index);
		else for (var i = 0; i < me.selection.length; i++) {
			if (me.selection[i] === index) {
				me.selection.splice(i,1);
			}
		}
		me[me.mystery](triangle, me.selection);
	};

	me.symmetry = function (triangle, selected) {
		reset(triangle);
		
		for (var i = 0; i < selected.length; i++) {
			var rowLast = selected[i].row;
			var select = rowLast - selected[i].column;
			if (select != selected[i].column)
				triangle[rowLast][select].setDisabled(true);

			triangle[rowLast][select].setAlternative(true);
			
			console.log('select '+select+' '+triangle[rowLast][select].value);
		}
	};

	me.powersof2 = function (triangle, selected) {
		reset(triangle);

		var len = selected.length;
		for (var i = 0; i < len-1; i++) {
			triangle[selected[i].row][selected[i].column].deselect();
			selected.splice(i,1);
		}

		if (selected.length <= 0) return;

		var trg = selected[0];
		for (var j = 0; j < triangle[trg.row].length; j++) {
			triangle[trg.row][j].setAlternative(true);
		}
	};
}