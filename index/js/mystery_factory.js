function mysteryFactory () {
	var me = this;

	me.selection = [];
	me.triangle = null;
	me.mystery = 'nan';

	var reset = function() {
		for (var i = 0; i<me.triangle.length; i++) {
			for (var j = 0; j<me.triangle[i].length; j++) {
				me.triangle[i][j].setAlternative(false);
			}
		}
	};

	var forceGetSelect = function() {
		var ret = [];

		for (var i = 0; i<me.triangle.length; i++) {
			for (var j = 0; j<me.triangle[i].length; j++) {
				if (me.triangle[i][j].state == 2)
					ret.push(me.triangle[i][j].index);
			}
		}

		return ret;
	};

	me.nan = function() {};

	me.loadMystery = function(index, isAdd) {

		if (isAdd) me.selection.push(index);
		else for (var i = 0; i < me.selection.length; i++) {
			if (me.selection[i] === index) {
				me.selection.splice(i,1);
			}
		}
		me[me.mystery]();
	};

	me.setup = function (mystery, triangle) {
		me.mystery = mystery;
		me.triangle = triangle;

		switch (mystery) {
			case 'divisiblebyprime':
			// Disable specific
			var allow = [1,2,3,5,7,11,13,17,19];
			for (var i = 0; i<triangle.length; i++) {
				var disrow = true;
				if (allow[0] == i) {
					disrow = false;
					allow.splice(0,1);
					console.log('for '+i);
				}
				for (var j = 0; j<triangle[i].length; j++) {
					var disable = disrow || j===0 || j==triangle[i].length-1;
					triangle[i][j].setDisabled(disable);
				}
			}
			break;
			default:
			// Remove disables
			for (var y = 0; y<triangle.length; y++) {
				for (var z = 0; z<triangle[y].length; z++) {
					triangle[y][z].setDisabled(false);
				}
			}
		}
	};



	/**
	*** MYSTERIES
	**/

	me.symmetry = function () {
		reset();
		
		for (var i = 0; i < me.selection.length; i++) {
			var rowLast = me.selection[i].row;
			var select = rowLast - me.selection[i].column;
			if (select != me.selection[i].column)
				me.triangle[rowLast][select].setDisabled(true);

			me.triangle[rowLast][select].setAlternative(true);
			
			console.log('select '+select+' '+me.triangle[rowLast][select].value);
		}
	};

	var powersof = function () {
		reset();

		var len = me.selection.length;
		for (var i = 0; i < len-1; i++) {
			me.triangle[me.selection[i].row][me.selection[i].column].deselect();
			me.selection.splice(i,1);
		}

		if (me.selection.length <= 0) return;

		var trg = me.selection[0];
		for (var j = 0; j < me.triangle[trg.row].length; j++) {
			me.triangle[trg.row][j].setAlternative(true);
		}
	};

	me.powersof2 = function () {
		powersof();
		// write specific text
	};

	me.powersof11 = function () {
		powersof();
		// write specific text
	};

	me.divisiblebyprime = function () {
		reset();

		var len = me.selection.length;
		for (var i = 0; i < len-1; i++) {
			me.triangle[me.selection[i].row][me.selection[i].column].deselect();
			me.selection.splice(i,1);
		}

		if (me.selection.length <= 0) return;

		var trg = me.selection[0];
		for (var j = 1; j < me.triangle[trg.row].length-1; j++) {
			me.triangle[trg.row][j].setAlternative(true);
		}
		// write specific text
	};


}