var mysteries = {
	symmetry: {
		title: 'Symmetry',
		help: 'In the triangle, the numbers of the array are <b>symmetric</b>, i.e. if one were to fold the triangle across its altitude, it would be clear to the observer that the numbers match. Clicking a cell on the triangle reveals its symmetric cell.' },
	powersof2: {
		title: 'Powers of 2',
		help: '<b>Powers of Two</b> can be noticed by adding the numbers in each row. Clicking a cell reveals the formula for getting $2^{n-1}$ where $n$ is the row number.' },
	powersof11: {
		title: 'Powers of 11',
		help: '<b>Powers of Eleven</b> can be noticed by putting each number in a row together. Additional arithmetic is done for cells containing numbers greater than or equal to 10. Clicking a cell reveals the formula for getting $11^{n-1}$ where $n$ is the row number.' },
	divisiblebyprime: {
		title: 'Divisibility By Prime',
		help: 'For any row where the second element is a prime number, all the numbers in that row (excluding 1\'s) are <b>divisible by the prime</b>.' },
	countingNum: {
		title: 'Counting Numbers',
		help: 'The second diagonal shows the sequence of <b>counting numbers</b>. Clicking a cell reveals the sum of all counting numbers up to that cell.' },
	triangularNum: {
		title: 'Triangular Numbers',
		help: 'A <b>triangular number</b> is one that can be represented in the form of a triangular grid of points where the first row contains a single element and each subsequent row contains one more element than the previous one. The triangular numbers can be seen in the third diagonal. Clicking a cell reveals the sum of all triangular numbers up to that cell.' },
	tetrahedralNum: {
		title: 'Tetrahedral Numbers',
		help: 'The fourth diagonal contains the sequence of <b>tetrahedral numbers</b>. Tetrahedral numbers are obtained by summing up the first $n$ triangular numbers. Clicking a cell reveals the sum of all tetrahedral numbers up to that cell.' },
	hockey: {
		title: 'Hockey Stick Pattern',
		help: 'The diagonal of numbers of any length starting with any 1\'s bordering the sides of the triangle and ending on any number inside the triangle is equal to the number below the last number of the diagonal, thus forming a <b>Hockey Stick Pattern</b>. Clicking a cell reveals the diagonal of numbers corresponding to it.' },
	fibonacci: {
		title: 'Fibonacci Numbers',
		help: 'The <b>$n^{th}$ Fibonacci number</b> can be seen by taking the sum of the $n^{th}$ leftmost 1 and all numbers moving diagonally rightwards. To see this pattern, click any cell.' },
	combi: {
		title: 'Combinatorics',
		help: 'In the Pascal\'s Triangle, each number is equivalent to <b>$\\left(\\begin{array}{c} n-1 \\\\ e-1 \\end{array}\\right)$</b> where $n$ is the row number and $e$ is the element placement of the cell. Clicking a cell reveals this formula. The placement of the cell is counted from $1$ to $n$ in each row.' },
	modular: {
		title: 'Modular Arithmetic',
		help: 'Using <b>modular arithmetic</b> in the Pascal\'s Triangle reveals an art. This happens when each cell is colored according to their corresponding answers, i.e. using mod 3 addition generates three answers: 0, 1, and 2; thus, assigning colors to these answers reveal a pattern.',
		extra: '<div class="col-sm-12 col-md-8 col-lg-8 form-group">'
			  +'<label for="modularInput">Modulo</label>'
			  +'<input id="modularInput" min="1" name="modularInput" type="number" data-validation="number" class="form-control"></div>'
			  +'<div class="col-sm-12 col-md-4 col-lg-4 form-group">'
			  +'<label>&nbsp;</label>'
			  +'<button type="submit" class="btn btn-secondary d-block">Apply Modulo</button></div>', // html to be added
		apply: function(settings) {
			settings.extra = parseInt($('#modularInput').val() );
			restart();
		 } // function that process the input
		}
};

function mysteryFactory (delegate) {
	var me = this;
	var next=true;

	me.delegate = delegate;

	me.selection = [];
	me.triangle = null;
	me.mystery = '';

	var select = function(index, bool) {
		var hexagon = me.triangle[index.row][index.column];
		if (bool) hexagon.setSelected();
		else hexagon.setNormal();
	}

	var selectOne = function(index) {
		if (index < 0 || index >= me.selection.length)
			return;

		var saved = me.selection[index];
		for (var i = 0; i < me.selection.length; i++) {
			var loc = me.selection[i];
			if (i != index)
				me.triangle[loc.row][loc.column].deselect();
		}
		me.selection = [saved];
	};

	var selectLast = function() {
		selectOne(me.selection.length-1);
	};

	var selectNone = function() {
		for (var i = 0; i < me.selection.length; i++) {
			var index = me.selection[i];
			me.triangle[index.row][index.column].deselect();
		}
		me.selection = [];
	};

	var alterReset = function() {
		for (var i = 0; i<me.triangle.length; i++) {
			for (var j = 0; j<me.triangle[i].length; j++) {
				var hexagon = me.triangle[i][j];
				if (hexagon.is(hexagon.stateType.ALTERNATIVE)){
					hexagon.setDisabled(false);
					hexagon.setNormal();
				}
			}
		}
	};

	me.selectIsEmpty = function() {
		return me.selection.length <= 0;
	};

	var selectRebuild = function() {
		var ret = [];

		for (var i = 0; i<me.triangle.length; i++) {
			for (var j = 0; j<me.triangle[i].length; j++) {
				if (me.triangle[i][j].state == me.triangle[i][j].stateType.ALTERNATIVE)
					ret.push(me.triangle[i][j].index);
			}
		}

		return ret;
	};

	var rowSelect = function () {
		selectLast();
		var trg = me.selection[0];
		for (var j = 0; j < me.triangle[trg.row].length; j++) {
			me.triangle[trg.row][j].setAlternative(true);
		}
	};

	me.runExtra = function() {
		var settings = me.delegate.settings;
		var run = mysteries[settings.mystery].apply;
		if (run) 
			run(settings);
	};

	me.loadMystery = function(index, isAdd) {

		if (isAdd) {
			select(index, true);
			me.selection.push(index);
		} else {
			for (var i = 0; i < me.selection.length; i++) {
				if (me.selection[i] === index) {
					me.selection.splice(i,1);
				}
			}
			select(index, false);
		}

		alterReset();
		
		var mystery = me.delegate.settings.mystery;
		if (me[mystery])
			return me[mystery]();
	};

	me.setup = function (triangle) {
		var mystery = me.delegate.settings.mystery;
		me.triangle = triangle;

		if (mysteries[mystery]) {
			var extra = mysteries[mystery].extra;
			if (extra)
				setExtraSettings(extra);
		}
		
		var setup = me.setupFunctions[mystery];
		if (setup)
			setup(triangle);
		else
			alterReset();

		setHelp(mysteries[mystery].help);
	};

	me.setupFunctions = {
		divisiblebyprime: function(triangle) {
			// Disable specific
			var allow = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199];
			for (var i = 0; i<triangle.length; i++) {
				var disrow = true;
				if (allow[0] == i) {
					disrow = false;
					allow.splice(0,1);
				}
				for (var j = 0; j<triangle[i].length; j++) {
					var disable = disrow || j===0 || j==triangle[i].length-1;
					triangle[i][j].setDisabled(disable);
				}
			}
		},
		countingNum: function(triangle) {
			for (var i = 0; i < triangle.length; i++) {
				for(var j = 0; j< i-1; j++){
					triangle[i][j].setDisabled(true);
				}
				triangle[i][i].setDisabled(true);
			}
		},
		triangularNum: function(triangle) {
			for (var i = 0; i < triangle.length; i++) {
				for(var j = 0; j< i-2; j++){
					triangle[i][j].setDisabled(true);
				}
				triangle[i][i].setDisabled(true);
				if(i>0)
					triangle[i][i-1].setDisabled(true);
			}
		},
		tetrahedralNum: function(triangle) {
			for (var i = 0; i < triangle.length; i++) {
				for(var j = 0; j< i-3; j++){
					triangle[i][j].setDisabled(true);
				}
				triangle[i][i].setDisabled(true);
				if(i>0)
					triangle[i][i-1].setDisabled(true);
				if(i>1)
					triangle[i][i-2].setDisabled(true);
			}
		},
		fibonacci: function(triangle) {
			for (var i = 0; i < triangle.length; i++){
				for (var j = 0; j <= i; j++){
					if (i+j>triangle.length-1)
						triangle[i][j].setDisabled(true);
				}
			}
		},
		modular: function(triangle) {
			me.delegate.settings.textColor = 0x000000;

			var mod = parseInt(me.delegate.settings.extra);
			$('#modularInput').val(mod);

			var colors = new Array(mod);
			for (var z = 0; z < mod; z++) {
				colors[z] = hslToRgb(z/mod, 1, 0.6);
			}
			for (var i = 0; i < triangle.length; i++){
				for (var j = 0; j <= i; j++){
					triangle[i][j].setDisabled(true);
					var value = triangle[i][j].value%mod;
					triangle[i][j].custom(colors[value]);
				}
			}
		}
	};

	

	/**
	*** MYSTERIES
	**/

	//	Symmetry
	me.symmetry = function () {
		
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
	
	//	Powers Of 2
	me.powersof2 = function () {

		if (me.selectIsEmpty()) return;
		rowSelect();

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
		return "The sum of this row is equal to $2^{" + (rr+1) +"-1}=2^{" + (rr) +"}$ i.e:$$" + a + " = "+sum+"$$";
	};

	//	Powers Of 11
	me.powersof11 = function () {

		if (me.selectIsEmpty()) return;
		rowSelect();

		var rr = me.selection[me.selection.length-1].row;
		var b = [];
		var ctr = 1;
		if(rr == 8 || rr == 9){
			ctr = 2;
		}
		
		var c = 1;
		var sum = 1;
		var i = 0;
		for(i = 0; i < (rr + 1); i++){
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
			for(i = 0; i < (rr + 1); i++){
				p11 += b[i] + "\\ ";
			}
			p11 += "$$";
			for(i = rr+1; i >= 0; i--){
				if(parseInt(b[i]/10)){
					tmp = parseInt(b[i]/10);
					b[i] = b[i]%10;
					b[i-1] = b[i-1] + tmp;
					break;
				}
			}
			ctr--;
		}
		return "This row represents $11^{"+ (rr+1) + "-1}=11^{"+ (rr) + "}$ i.e: " + p11;
	};

	me.divisiblebyprime = function () {

		if (me.selection.length <= 0) return;
		selectLast();

		var trg = me.selection[0];
		for (var j = 1; j < me.triangle[trg.row].length-1; j++) {
			me.triangle[trg.row][j].setAlternative();
		}

		return "The selected cells in this row is divisible by "+trg.row;
	};
	
	me.countingNum = function () {
		if (me.selection.length <= 0) return;
		selectLast();

		var index = me.selection[0];
		var i = index.row;
		var j = index.column;

		while (i >= 0 && j >= 0) {
			me.triangle[i][j].setAlternative();
			i--;
			j--;
		}

		var value = index.row*(index.row+1)/2;
		return "The sum of the first "+index.row+" counting numbers is $$\\frac{"+index.row+"("+index.row+"+1)}{2} = "+value+"$$";
	};
	
	me.triangularNum = function () {
		if (me.selection.length <= 0) return;
		selectLast();

		var index = me.selection[0];
		var r = index.row-1;

		var i = r;
		var j = index.column-1;

		while (i >= 0 && j >= 0) {
			me.triangle[i][j].setAlternative();
			i--;
			j--;
		}

		var value = r*(r+1)*(r+2)/6;
		return "The sum of the first "+r+" triangular numbers is $$\\frac{"+r+"("+r+"+1)("+r+"+2)}{6} = "+value+"$$";
	};
	
	me.tetrahedralNum = function () {
		if (me.selection.length <= 0) return;
		selectLast();

		var index = me.selection[0];
		var r = index.row-2;

		var i = index.row-1;
		var j = index.column-1;

		while (i >= 0 && j >= 0) {
			me.triangle[i][j].setAlternative();
			i--;
			j--;
		}

		var value = r*(r+1)*(r+2)*(r+3)/24;
		return "The sum of the first "+r+" tetrahedral numbers is $$ \\frac{"+r+"("+r+"+1)("+r+"+2)("+r+"+3)}{24} = "+value+"$$";
	};
	
	me.hockey = function () {
		if (me.selection.length <= 0) return;
		selectLast();

		var len = me.selection.length;
		var row = me.selection[0].row;
		var col = me.selection[0].column;
		var hexas = [];

		var startrow = row;
		var startcol = col;

		if (next){
			startrow--;
			while(startcol >= 0){
				hexas.push([startrow, startcol]);
				startrow--;
				startcol--;
			}
		} else{
			startrow--;
			startcol--;
			while(startrow >= startcol){
				hexas.push([startrow, startcol]);
				startrow--;
			}
		}
		next = !next;

		var arr = "";
		for(i = 0; i<hexas.length; i++){
			var hexa = me.triangle[hexas[i][0]][hexas[i][1]];
			hexa.setAlternative();
			arr =  hexa.value + (i===0?'':'+') + arr;
		}

		return "The value of this cell is the sum of previous cells e.g.$$"+arr+"="+me.triangle[row][col].value+"$$";


	};
	
	me.fibonacci = function () {
		if (me.selection.length <= 0) return;
		selectLast();

		var len = me.selection.length;
		var row = me.selection[0].row;
		var col = me.selection[0].column;
		var cont = ""+me.triangle[row][col].value+"";
		var hexas = [];
		var sum = me.triangle[row][col].value;

		//left of selection
		col--; row++;
		while(col>=0){
			hexas.push([row,col]);
			cont = me.triangle[row][col].value+" + "+cont;
			sum += me.triangle[row][col].value;
			col--;
			row++;
		}
		row = me.selection[me.selection.length-1].row;
		col = me.selection[me.selection.length-1].column;
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
		if (me.selection.length <= 0) return;
		selectLast();

		var len = me.selection.length;
		var row = me.selection[0].row;
		var col = me.selection[0].column;
		return "This cell is the value of $\\left( \\begin{array}{c}"+(row+1)+"-1\\\\"+(col+1)+"-1\\end{array} \\right)=\\left( \\begin{array}{c}"+(row)+"\\\\"+(col)+"\\end{array} \\right)$";
	};
	
	me.modular = function (){
		
	};


}
