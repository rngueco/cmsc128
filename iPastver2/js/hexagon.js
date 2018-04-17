/**
hexWidth = hexSize*0.866;
p1 = offset+hexWidth*0.5, offset;
p2 = offset+hexWidth, offset+hexSize*0.25;
p3 = offset+hexWidth, offset+hexSize*0.75;
p4 = offset+hexWidth*0.5, offset+hexSize;
p5 = offset, offset+hexSize*0.75;
p6 = offset, offset+hexSize*0.25;
**/


function hexagon (delegate) {

	var me = this;

	me.value = 1;

	me.x = 0;
	me.y = 0;

	me.index = new hexindex();

	// Delegate
	me.delegate = delegate;

	me.changed = true;

	// Renderable
	me.graphics = new PIXI.Graphics();
	me.graphics.interactive = true;

	me.text = new PIXI.Text();
	me.text.anchor.x = 0.5;
	me.text.anchor.y = 0.5;

	me.state = 0;

	// For animation
	me.future = {};
	me.futureTime = null;

	me.disabled = false;

	// Updater
	me.update = function(delta) {

		if (delta === undefined)
			delta = 0;

		if (me.futureTime !== null){
			me._animate(delta);
			if (me.futureTime < 0) me.futureTime = null;
		}

		if (!me.delegate.forceRender && !me.changed)
			return;

		var settings = me.delegate.settings;
		var size = parseInt(settings.size);

		var hexWidth = size*0.866;

		me.graphics.clear();
		me.graphics.lineStyle(settings.lineWidth, settings.lineColor);

		var color = null;

		if (me.disabled && me.state != 1)
			color = settings.disabledColor;
		else
			switch (me.state) {
				case 0: color = settings.bgColor;
				break;
				case 1: color = settings.altColor;
				break;
				case 2: color = settings.highlightColor;
			}

		color = parseInt(color);

		me.graphics.beginFill(color);

		me.graphics.moveTo(me.x,              me.y-size*0.5);
		me.graphics.lineTo(me.x+hexWidth*0.5, me.y-size*0.25);
		me.graphics.lineTo(me.x+hexWidth*0.5, me.y+size*0.25);
		me.graphics.lineTo(me.x,              me.y+size*0.5);
		me.graphics.lineTo(me.x-hexWidth*0.5, me.y+size*0.25);
		me.graphics.lineTo(me.x-hexWidth*0.5, me.y-size*0.25);
		me.graphics.lineTo(me.x,              me.y-size*0.5);

		me.graphics.endFill();

		me.text.style.fontSize = parseInt(settings.fontsize, 10);
		me.text.style.fill = parseInt(settings.textColor);
		
		me.text.x = me.x;
		me.text.y = me.y;
		me.text.text = me.value;

		me.changed = false;
	};

	me.graphics.click = function(ev) {
		if (me.disabled) return;

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

	me.setIndex = function(y,x) {
		me.index.row = y;
		me.index.column = x;
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
		if (bool) me.state = 0;
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
}