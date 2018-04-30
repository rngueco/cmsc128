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
	var labels = [];
	var background = new PIXI.Graphics();

	var spaceY = -10;

	var labelSpace = 20;

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
		mystery: 'symmetry',
		labeled: true
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

			var text = new PIXI.Text();
			text.anchor.y = 0.5;

			me.container.addChild(text);
			labels.push(text);

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

			var text = labels[i];
			if (me.settings.labeled) {
				
				text.style.fontSize = parseInt(me.settings.fontsize, 10);
				text.style.fill = parseInt(me.settings.lineColor);

				text.x = offX - size/2 + labelSpace;
				text.y = offY;

				text.text = 'Row '+i;
			} else {
				text.text = '';
			}

			offY += size+spaceY;
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
		var x = 0;
		var y = 0;

		if ( !me.mystery.selectIsEmpty() ) {
			var a = me.container.toGlobal(new PIXI.Point(0,0));
			var hexp = hexagons[index.row][index.column];
			x = a.x + hexp.x * me.container.scale.x;
			y = a.y + hexp.y * me.container.scale.y;

			// Offset position
			y += me.settings.size * me.container.scale.y / 2;
		} else {
			result = null;
		}

		writeMessage(result, x, y);

	};

	// Initialize
	me.container.interactive = true;
	background.interactive = true;
}