/**
hexWidth = hexSize*0.866;
p1 = offset+hexWidth*0.5, offset;
p2 = offset+hexWidth, offset+hexSize*0.25;
p3 = offset+hexWidth, offset+hexSize*0.75;
p4 = offset+hexWidth*0.5, offset+hexSize;
p5 = offset, offset+hexSize*0.75;
p6 = offset, offset+hexSize*0.25;
**/


function hexagon () {

	var me = this;

	// Settings
	me.textColor = 0xffffff;
	me.value = 1;

	me.bgColor = 0x222222;
	me.highlightColor = 0x000fff;
	me.lineColor = 0xff0000;
	me.size = 100;
	me.lineWidth = 5;

	me.fontSize = 15;
	me.x = 0;
	me.y = 0;

	// Location
	me.row = 0;
	me.column = 0;

	// Delegate
	me.delegate = null;

	me.changed = true;

	// Renderable
	me.graphics = new PIXI.Graphics();
	me.graphics.interactive = true;
	me.text = new PIXI.Text();
	me.text.anchor.x = 0.5;
	me.text.anchor.y = 0.5;

	me.interactive = me.buttonMode = true;

	me.selected = false;

	// disabled
	// alternative

	// Some animation

	me.future = {};
	me.futureTime = null;

	// Updater
	me.update = function(delta) {

		if (delta === undefined)
			delta = 0;

		if (me.futureTime !== null)
			me._animate(delta);
		else 
			if (!me.changed)
				return;
		
		if (me.futureTime < 0) 
			me.futureTime = null;

		me.graphics.clear();

		var hexWidth = me.size*0.866;

		me.graphics.lineStyle(me.lineWidth, me.lineColor);
		me.graphics.beginFill(me.selected ? me.highlightColor : me.bgColor);

		me.graphics.moveTo(me.x,              me.y-me.size*0.5);
		me.graphics.lineTo(me.x+hexWidth*0.5, me.y-me.size*0.25);
		me.graphics.lineTo(me.x+hexWidth*0.5, me.y+me.size*0.25);
		me.graphics.lineTo(me.x,              me.y+me.size*0.5);
		me.graphics.lineTo(me.x-hexWidth*0.5, me.y+me.size*0.25);
		me.graphics.lineTo(me.x-hexWidth*0.5, me.y-me.size*0.25);
		me.graphics.lineTo(me.x,              me.y-me.size*0.5);

		me.graphics.endFill();

		me.text.text = me.value;
		me.text.style.fill = me.textColor;
		me.text.style.fontSize = me.fontSize;
		me.text.x = me.x;
		me.text.y = me.y;

		me.changed = false;
	};

	me.graphics.click = function(ev) {
		// notify delegate
		me.selected = !me.selected;
		me.changed = true;

		if (me.delegate)
			me.delegate.notify(me.row, me.column);
	};

	me.setup = function(stage) {
		stage.addChild(me.graphics);
		stage.addChild(me.text);
	};

	// set values after first render
	me.set = function(prop, val) {
		me.changed = true;
		me[prop] = val;
	};

	// animate value transition
	me._animate = function(delta) {
		var set = me.futureTime-delta <= 0;

		for (var key in me.future) {

			if (me.future[key] !== null && me.future[key] !== undefined) {
				if (set)
					me[key] = me.future[key];
				else {
					me[key] += delta*(me.future[key]-me[key])/me.futureTime;
				}
			}
		}
		me.futureTime -= delta;
	};
}