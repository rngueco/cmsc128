function mysteryFactory (delegate) {
	var me = this;

	me.delegate = delegate;

	me.selection = [];
	me.triangle = null;
	me.mystery = '';

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

	me.selectionEmpty = function() {
		return me.selection.length <= 0;
	};

	me.loadMystery = function(index, isAdd) {

		if (isAdd) me.selection.push(index);
		else 
			for (var i = 0; i < me.selection.length; i++) {
				if (me.selection[i] === index) {
					me.selection.splice(i,1);
				}
			}

		var mystery = me.delegate.settings.mystery;

		if (me[mystery])
			return me[mystery]();
	};

	me.setup = function (triangle) {
		var mystery = me.delegate.settings.mystery;
		me.triangle = triangle;

		switch (mystery) {

			case 'divisiblebyprime':
			// Disable specific
			var allow = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199];
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
			
			case 'countingNum':
			for (var i = 0; i < me.triangle.length; i++) {
				for(var j = 0; j< i-1; j++){
					triangle[i][j].setDisabled(true);
				}
				me.triangle[i][i].setDisabled(true);
			}
			break;
			
			case 'triangularNum':
			for (var i = 0; i < me.triangle.length; i++) {
				for(var j = 0; j< i-2; j++){
					triangle[i][j].setDisabled(true);
				}
				triangle[i][i].setDisabled(true);
				if(i>0)
					triangle[i][i-1].setDisabled(true);
			}
			break;
			
			case 'tetrahedralNum':
			for (var i = 0; i < me.triangle.length; i++) {
				for(var j = 0; j< i-3; j++){
					triangle[i][j].setDisabled(true);
				}
				triangle[i][i].setDisabled(true);
				if(i>0)
					triangle[i][i-1].setDisabled(true);
				if(i>1)
					triangle[i][i-2].setDisabled(true);
			}
			break;
			
			case 'fibonacci':
			for (var i = 0; i < me.triangle.length; i++){
				for (var j = 0; j <= i; j++){
					if (i+j>me.triangle.length-1)
						triangle[i][j].setDisabled(true);
				}
			}
			break;
			
			case 'modular':
			var mod = 4;
			var colors = new Array(mod);
			for (var z = 0; z < mod; z++) {
				colors[z] = hslToRgb(z/mod, 1, 0.5);
			}
			for (var i = 0; i < me.triangle.length; i++){
				for (var j = 0; j <= i; j++){
					triangle[i][j].setDisabled(true);
					var value = me.triangle[i][j].value%mod;
					me.triangle[i][j].custom(colors[value]);
				}
			}
			break;
			
			default:
			// Remove disables
			reset();
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
			
			// find selection
			// console.log('select '+select+' '+me.triangle[rowLast][select].value);
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

		if (me.selection.length === 0) return;

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
		return "The sum of this row is equal to $2^{" + (rr+1) +"-1}$ i.e:$$" + a + " = "+sum+"$$";
	};

	//	Powers Of 11
	me.powersof11 = function () {
		powersof();
		if (me.selection.length === 0) return;
		// write specific text
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
			p11 += "$$";
			for(var i = 0; i < (rr + 1); i++){
				p11 += b[i] + "\\ ";
			}
			p11 += "$$";
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
		return "This row represents $11^{"+ (rr+1) + "-1}$ i.e: " + p11;
	};

	me.divisiblebyprime = function () {
		reset();
		var row = me.selection[me.selection.length-1].row;
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
		return "All cells in this row is divisible by "+row;
	};
	
	var specialNum = function () {
		reset();
		var rowLast = me.selection[me.selection.length-1].row;
		for (var i = 0; i < me.selection.length-1; i++) {
			me.triangle[me.selection[i].row][me.selection[i].column].deselect();
			me.selection.splice(i,1);
		}
	};
	
	me.countingNum = function () {
		if (me.selection.length === 0) return;
		specialNum();
		rowLast = me.selection[me.selection.length-1].row;
		var value = rowLast*(rowLast+1)/2;
		return "The sum of the first "+rowLast+" counting numbers is $$\\frac{"+rowLast+"("+rowLast+"+1)}{2} = "+value+"$$";
	};
	
	me.triangularNum = function () {
		if (me.selection.length === 0) return;
		specialNum();
		rowLast = me.selection[me.selection.length-1].row-1;
		var value = rowLast*(rowLast+1)*(rowLast+2)/6;
		return "The sum of the first "+rowLast+" triangular numbers is $$\\frac{"+rowLast+"("+rowLast+"+1)("+rowLast+"+2)}{6} = "+value+"$$";
	};
	
	me.tetrahedralNum = function () {
		if (me.selection.length === 0) return;
		specialNum();
		rowLast = me.selection[me.selection.length-1].row-2;
		var value = rowLast*(rowLast+1)*(rowLast+2)*(rowLast+3)/24;
		return "The sum of the first "+rowLast+" tetrahedral numbers is $$ \\frac{"+rowLast+"("+rowLast+"+1)("+rowLast+"+2)("+rowLast+"+3)}{24} = "+value+"$$";
	};
	
	me.hockey = function () {
		reset();
		if (me.selection.length === 0) return;
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
	};
	
	me.fibonacci = function () {
		reset();
		if (me.selection.length === 0) return;
		var len = me.selection.length;
		var row = me.selection[me.selection.length-1].row;
		var col = me.selection[me.selection.length-1].column;
		var cont = ""+me.triangle[row][col].value+"";
		var hexas = [];
		var sum = me.triangle[row][col].value;
		for (var i = 0; i < len-1; i++) {
			me.triangle[me.selection[i].row][me.selection[i].column].deselect();
			me.selection.splice(i,1);
		}
		//left of selection
		col--; row++;
		while(col>=0){
			hexas.push([row,col]);
			cont = me.triangle[row][col].value+" + "+cont;
			sum += me.triangle[row][col].value;
			col--;
			row++;
		}
		var row = me.selection[me.selection.length-1].row;
		var col = me.selection[me.selection.length-1].column;
		row--; col++;
		//right of selection
		while(row>=col){
			hexas.push([row,col]);
			cont = cont+" + "+me.triangle[row][col].value;
			sum += me.triangle[row][col].value;
			col++;
			row--;
		}
		var tmp = (me.selection[me.selection.length-1].row+me.selection[me.selection.length-1].column+1);
		var preFix = "The $"+tmp+"^{";
		switch(tmp%10){
			case 1:
				preFix += "st";
				break;
			case 2:
				preFix += "nd";
				break;
			case 3:
				preFix += "rd";
				break;
			default:
				preFix += "th";
		}
		
		cont =  preFix+"}$ in the Fibonacci sequence is:$$"+cont+"$$ $$ = "+sum+"$$";
		for(i = 0;i<hexas.length;i++){
			me.triangle[hexas[i][0]][hexas[i][1]].setAlternative(true);
		}
		return cont;
	};
	
	me.combi = function (){
		reset();
		if (me.selection.length === 0) return;
		var len = me.selection.length;
		for (var i = 0; i < len-1; i++) {
			me.triangle[me.selection[i].row][me.selection[i].column].deselect();
			me.selection.splice(i,1);
		}
		var row = me.selection[me.selection.length-1].row;
		var col = me.selection[me.selection.length-1].column;
		return "This cell is the value of $\\left( \\begin{array}{c}"+(row+1)+"-1\\\\"+(col+1)+"-1\\end{array} \\right)$";
		//return "This cell is the value of $\\binom{"+row+"}{"+col+"}$";
	};
	
	me.modular = function (){
		
	};


}
