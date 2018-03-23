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

	//	Symmetry
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
	
	//	Powers Of 2
	me.powersof2 = function () {
		powersof();
		
		var rr = me.selection[me.selection.length-1].row;
		var a = "";
		var c = 1;
		var sum = 1;
		for(var i = 0; i < (rr + 1); i++){
			if(i<rr){
				a += c + " + ";
			} else {
				a += c;
			}
			c = parseInt(c*((rr+1)-(i+1))/(i+1));
			sum = sum + c;
		}
		alert("The sum of this row is equal to 2 raised to " + rr +" i.e: " + a + " = "+sum);
	};

	//	Powers Of 11
	me.powersof11 = function () {
		powersof();
		
		var rr = me.selection[me.selection.length-1].row;
		var b = [];
		var ctr = 1;
		if(rr == 8 || rr == 9){
			ctr = 2;
		}
		
		var c = 1;
		var sum = 1;
		for(var i = 0; i < (rr + 1); i++){
			b[i] = c;
			if(parseInt(b[i]/10) > 0){
				ctr++;
			}
			c = parseInt(c*((rr+1)-(i+1))/(i+1));
			sum = sum + c;
		}
		
		var p11 = "";
		var tmp = 0;
		while(ctr > 0){
			for(var i = 0; i < (rr + 1); i++){
				p11 += b[i] + " ";
			}
			p11 += '\n';
			for(var i = rr+1; i >= 0; i--){
				if(parseInt(b[i]/10)){
					tmp = parseInt(b[i]/10);
					b[i] = b[i]%10;
					b[i-1] = b[i-1] + tmp;
					break;
				}
			}
			ctr--;
		}
		alert("This row represents 11 raised to "+ rr + " i.e:\n" + p11);
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
	
	me.hockey = function () {
		reset();
		var len = me.selection.length;
		var row = me.selection[me.selection.length-1].row;
		var col = me.selection[me.selection.length-1].column;
		var hexas = [];
		for (var i = 0; i < len-1; i++) {
			me.triangle[me.selection[i].row][me.selection[i].column].deselect();
			me.selection.splice(i,1);
		}
		if(row/2<col){
			hexas.push([row-1,col-1]);
			var i = 0;
			while(row-i-1!=col-1){
				i++;
				hexas.push([row-i-1,col-1]);
			}
		}else{
			hexas.push([row-1,col]);
			var i = 0;
			while(hexas[i][1]!=0){
				i++;
				hexas.push([row-i-1,col-i]);
			}
		}
		for(i = 0;i<hexas.length;i++){
			me.triangle[hexas[i][0]][hexas[i][1]].setAlternative(true);
		}
	}
	
	me.combi = function (){
		reset();
		var len = me.selection.length;
		for (var i = 0; i < len-1; i++) {
			me.triangle[me.selection[i].row][me.selection[i].column].deselect();
			me.selection.splice(i,1);
		}
		var row = me.selection[me.selection.length-1].row;
		var col = me.selection[me.selection.length-1].column;
		alert("this cell is the value of "+row+" taken "+col);
	}


}