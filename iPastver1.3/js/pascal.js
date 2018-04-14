function hexindex() {
	var me = this;
	// Location
	me.row = 0;
	me.column = 0;

	// Compare locations
	me.compare = function(index) {
		var i = me.row*me.row+me.column;
		var j = index.row*index.row+index.column;
		return i-j;
	};
}

function pascal() {
	var me = this;
	var hexagons = [];

	me.container = new PIXI.Container();
	me.container.interactive = true;

	var background = new PIXI.Graphics();
	background.interactive = true;

	me.renderX = 0;

	me.size = 100;

	me.mystery = new mysteryFactory();

	me.setup = function(n, mystery) {
		
		var size = me.size;
		var fWid = n*size;

		var offX = me.renderX-size/2;
		var offY = size/2;

		var tempX = offX;
		for (var i = 0; i<=n; i++) {
			var row = [];
			var c = 1;

			offX = tempX-(i-1)*size/2;

			for (var j = 0; j<=i; j++) {
				var newhex = new hexagon();
				newhex.setup(me.container);
				newhex.size = size;

				newhex.x = offX;
				newhex.y = offY;

				newhex.delegate = me;

				newhex.setIndex(i,j);

				newhex.value = c;
				c = parseInt(c*((i+1)-(j+1))/(j+1));

				row.push(newhex);

				offX += size;
			}

			offY += size-10; // better make this editable

			hexagons.push(row);
		}

		me.mystery.setup(mystery, hexagons);
	};

	me.setMystery = function(mystery) {
		me.mystery.mystery = mystery;
	};

	me.update = function(delta) {
		for (var i = 0; i<hexagons.length; i++) {
			for (var j = 0; j<hexagons[i].length; j++) {
				hexagons[i][j].update(delta);
			}
		}
	};

	me.setZoom = function(value) {
		me.container.scale.x = me.container.scale.y = value;
		me.container.updateTransform();
	};

	me.notify = function(index, isAdd) {
		var result = me.mystery.loadMystery(index, isAdd); // Send to mystery factory

		var messagebox = $('#message');

		if (me.mystery.selectionEmpty() ) {
			messagebox.hide();
			return;
		}
		
		var a = me.container.toGlobal(new PIXI.Point(0,0));
		var hexp = hexagons[index.row][index.column];
		var x = a.x + hexp.x * me.container.scale.x;
		var y = a.y + hexp.y * me.container.scale.y;

		// offset position
		y += me.size * me.container.scale.y / 2;

		// Display message on html
		if (result) {
			var minwidth = parseInt(messagebox.css('min-width'),10);
			var windowWidth = messagebox.parent().innerWidth();

			console.log('canvas: '+minwidth);

			if (x+minwidth>windowWidth)
				x = windowWidth-minwidth;

			messagebox.html(result);
			messagebox.css('top', y).css('left', x).show();
		}
	};

}
