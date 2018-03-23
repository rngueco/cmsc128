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
	me.altColor = 0xaaafff;
	me.disabledColor = 0xeeeeee;
	me.lineColor = 0xff0000;
	me.size = 100;
	me.lineWidth = 5;

	me.fontSize = 15;
	me.x = 0;
	me.y = 0;

	me.index = new hexindex();

	// Delegate
	me.delegate = null;

	me.changed = true;

	// Renderable
	me.graphics = new PIXI.Graphics();
	me.graphics.interactive = true;
	me.text = new PIXI.Text();
	me.text.anchor.x = 0.5;
	me.text.anchor.y = 0.5;

	me.state = 0;

	// 0 normal
	// 2 selected
	// 1 alternative

	// disabled

	// Some animation

	me.future = {};
	me.futureTime = null;

	me.disabled = false;

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
		me.graphics.beginFill(me.state === 0 ? me.bgColor : (me.state === 2? me.highlightColor : me.altColor));

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


		if (me.disabled) return;

		console.log('click');

		// notify delegate
		me.changed = true;

		if (me.state != 2) me.state = 2;
		else me.state = 0;

		if (me.delegate)
			me.delegate.notify(me.index, me.state == 2);
	};

	me.setup = function(stage) {
		stage.addChild(me.graphics);
		stage.addChild(me.text);
	};

	// set values after first render
	me.set = function(prop, val) {
		me[prop] = val;
		me.changed = true;
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

	me.setIndex = function(y,x) {
		me.index.row = y;
		me.index.column = x;
		me.changed = true;
	};

	me.setAlternative = function(bool) {
		if (bool && me.state === 0) {
			me.state = 1;
			me.changed = true;
		} else if (!bool && me.state == 1) {
			me.disabled = false;
			me.state = 0;

			me.changed = true;
		}
	};

	me.deselect = function() {
		me.disabled = false;
		me.state = 0;

		me.changed = true;
	};

	me.setDisabled = function(bool) {
		me.disabled = bool;
	};
}