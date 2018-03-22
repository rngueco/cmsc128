function pascal() {
	var me = this;
	var hexagons = [];

	me.size = 100;

	me.setup = function(n, stage) {
		
		var size = me.size;
		var fWid = n*size;

		var offX = fWid/2;
		var offY = size/2;

		var tempX = offX;
		for (var i = 0; i<=n; i++) {
			var row = [];
			var c = 1;

			offX = tempX-(i-1)*size/2;

			for (var j = 0; j<=i; j++) {
				var newhex = new hexagon();
				newhex.setup(stage);
				newhex.size = size;

				newhex.x = offX;
				newhex.y = offY;

				newhex.delegate = me;

				newhex.row = i;
				newhex.column = j;

				newhex.value = c;
				c = parseInt(c*((i+1)-(j+1))/(j+1));

				row.push(newhex);

				offX += size;
			}

			offY += size-10; // better make this editable

			hexagons.push(row);
		}
	};

	me.update = function(delta) {
		for (var i = 0; i<hexagons.length; i++) {
			for (var j = 0; j<hexagons[i].length; j++) {
				hexagons[i][j].update(delta);
			}
		}
	};

	me.notify = function(row, column) {
		console.log('clicked '+row+' @ '+column+' selected: '+hexagons[row][column].selected);
	};
}