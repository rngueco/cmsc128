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

	var nextRenderValue = false;

	var resolve = function(i,j) {
		return ((i+1)-(j+1))/(j+1);
	};

	

	// Public Properties
	me.settings = $.extend(
	{
		size: 100,

		textColor: 0xffffff,
		bgColor: 0x343a40,
		highlightColor: 0x007bff,
		altColor: 0x28a745,
		disabledColor: 0x6c757d,
		lineColor: 0x17a2b8,

		background: 0xffffff,

		fontsize: 20,
		lineWidth: 5,

		height: 0,
		mystery: 'symmetry',
		extra: 4,
		labeled: true

	}, settings);
	me.container = new PIXI.Container();
	me.renderX = 0;
	me.forceRender = false;
	me.mystery = new mysteryFactory(me);

	var addRow = function() {
		var row = [];
		var c = 1;
		var i = hexagons.length;

		for (var j = 0; j<=i; j++) {
			var newhex = new hexagon(me);

			newhex.setup(me.container);

			newhex.setIndex(i,j);

			if( j==0 || j==i ){
				c=1;
			}else{
				c=hexagons[i-1][j-1].value+hexagons[i-1][j].value;
			}
			
			newhex.value = c;
			//c = parseInt(c*resolve(i,j));

			row.push(newhex);
		}

		var text = new PIXI.Text();
		text.anchor.y = 0.5;

		me.container.addChild(text);
		labels.push(text);

		hexagons.push(row);
	};

	var deleteRow = function() {
		if (hexagons.length <= 0) return;
		var i = hexagons.length-1;

		var row = hexagons[i];
		var label = labels[i];
		hexagons.splice(i,1);
		labels.splice(i,1);

		for (var j = 0; j < row.length; j++) {
			row[j].dispose(me.container);
			delete row[j];
		}

		me.container.removeChild(label);
		label.destroy({children: true, texture:true, baseTexture:true });

		row = null;
		label = null;
	};

	// Functions
	me.setup = function(a, b) {

		var n = a?a:me.settings.height;
		var mystery = b?b:me.settings.mystery;

		hexagons = [];
		
		for (var i = 0; i<n; i++) {
			addRow();
		}

		me.settings.mystery = mystery;
		me.mystery.setup(hexagons);
	};

	

	me.render = function() {
		nextRenderValue = true;
	};

	me.loadSettings = function(settings) {
		me.settings = $.extend(me.settings, settings);
		$('#display').css('background', formatHexColor(me.settings.background) );
	};

	me.applyBackground = function(background) {
		me.settings.background = background;
		$('#display').css('background', formatHexColor(me.settings.background) );
	};

	me.changeMystery = function(mystery) {
		if (me.settings.mystery == mystery) return;
		me.settings.mystery = mystery;
		me.mystery.changed();

		writeMessage();
	};

	me.changeHeight = function(height) {
		var newheight = parseInt(height);
		if (newheight == me.settings.height) return;
		var i = me.settings.height;
		var diff = newheight - i;
		if (diff > 0) {

			for (; i < newheight; i++) {
				addRow();
			}
		} else {
			for (; diff < 0; diff++) {
				deleteRow();
			}
		}
		me.settings.height = newheight;
		me.mystery.changed();

		writeMessage();
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

				text.text = 'Row '+(i+1);
			} else {
				text.text = '';
			}

			offY += size+spaceY;
		}
		me.forceRender = nextRenderValue;
		nextRenderValue = false;
	};

	me.setMystery = function(mystery) {
		me.settings.mystery = mystery;
	};

	me.setColor = function(tag, color) {
		me.settings[tag+'Color'] = color;
		me.render();
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

	me.extra = function() {
		me.mystery.runExtra();
	};

	// Initialize
	me.container.interactive = true;
	background.interactive = true;
}