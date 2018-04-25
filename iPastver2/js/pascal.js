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

function pascal(settings) {

	// Private Properties
	var me = this;
	var hexagons = [];
	var background = new PIXI.Graphics();

	// Public Properties
	me.settings = $.extend(
	{
		size: 100,

		textColor: 0xffffff,
		bgColor: 0x222222,
		highlightColor: 0x000fff,
		altColor: 0xaaafff,
		disabledColor: 0x777777,
		lineColor: 0xff0000,

		fontsize: 15,
		lineWidth: 5,

		height: 0,
		mystery: 'symmetry'
	}, settings);
	me.container = new PIXI.Container();
	me.renderX = 0;
	me.forceRender = false;
	me.mystery = new mysteryFactory(this);

	// Functions
	me.setup = function(a, b) {

		var n = a?a:me.settings.height;
		var mystery = b?b:me.settings.mystery;

		hexagons = [];
		
		for (var i = 0; i<n; i++) {
			var row = [];
			var c = 1;

			for (var j = 0; j<=i; j++) {
				var newhex = new hexagon(this);

				newhex.setup(me.container);

				newhex.setIndex(i,j);

				newhex.value = c;
				c = parseInt(c*((i+1)-(j+1))/(j+1));

				row.push(newhex);
			}

			hexagons.push(row);
		}

		me.settings.mystery = mystery;
		me.mystery.setup(hexagons);
	};

	me.loadSettings = function(settings) {
		me.settings = $.extend(me.settings, settings);
	};

	me.update = function(delta) {
		var size = parseInt(me.settings.size);
		var half = size/2;

		var offX = me.renderX-half;
		var offY = half;

		var tempX = offX;

		for (var i = 0; i<hexagons.length; i++) {

			offX = tempX-(i-1)*half;

			for (var j = 0; j<hexagons[i].length; j++) {
				var hex = hexagons[i][j];

				hex.x = offX;
				hex.y = offY;

				hex.update(delta);

				offX += size;
			}

			offY += size-10; // better make this editable
		}
		me.forceRender = false;
	};

	me.setMystery = function(mystery) {
		me.settings.mystery = mystery;
	};

	me.setColor = function(tag, color) {
		me.settings[tag+'Color'] = color;
		me.forceRender = true;
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
		y += me.settings.size * me.container.scale.y / 2;

		// Display message on html
		if (result) {
			var minwidth = parseInt(messagebox.css('min-width'),10);
			var windowWidth = messagebox.parent().innerWidth();

			if (x+minwidth>windowWidth)
				x = windowWidth-minwidth;

			messagebox.html(result);
			messagebox.css('top', y).css('left', x).show();
		}


	};

	// Initialize
	me.container.interactive = true;
	background.interactive = true;
}