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
	//    Graphics
	me.graphics = new PIXI.Graphics();
	me.graphics.interactive = true;
	//    Text
	me.text = new PIXI.Text();
	me.text.anchor.x = 0.5;
	me.text.anchor.y = 0.5;

	me.stateType = {
		CUSTOM: -1,
		NORMAL: 0,
		ALTERNATIVE: 1,
		SELECTED: 2
	};

	// States
	me.state = 0;
	me.disabled = false;
	me.customColor = 0;

	// For animation
	me.future = {};
	me.futureTime = 0;

	/**
	Setup to given stage
	*/
	me.setup = function(stage) {
		stage.addChild(me.graphics);
		stage.addChild(me.text);
	};

	/**
	Allow rerendering next time
	*/
	me.hasChanged = function() {
		me.changed = true;
	}

	/**
	Change property triggering render
	*/
	me.set = function(prop, val) {
		me[prop] = val;
		me.hasChanged();
	};

	/**
	Change state
	*/
	me.setState = function(state) {
		me.state = state;
		me.hasChanged();
	}

	/**
	Store the hexagon position in the triangle
	*/
	me.setIndex = function(y,x) {
		me.index.row = y;
		me.index.column = x;
	};

	/**
	Set to program highlighted state otherwise reset
	*/
	me.setAlternative = function() {
		if (!me.is(me.stateType.SELECTED))
			me.setState(me.stateType.ALTERNATIVE);
	};

	/**
	*/
	me.setNormal = function() {
		me.setState(me.stateType.NORMAL);
	};

	/**
	*/
	me.setSelected = function() {
		me.setState(me.stateType.SELECTED);
	};

	/**
	Disable hexagon from interaction
	*/
	me.setDisabled = function(isDisabled) {
		me.disabled = isDisabled;
		me.hasChanged();
	};

	me.is = function(state) {
		return me.state == state;
	}

	/**
	Set custom color
	*/
	me.custom = function(color) {
		if (color == null) {
			me.state = me.stateType.NORMAL;
		} else {
			me.customColor = color;
			me.state = me.stateType.CUSTOM;
		}

		me.hasChanged();
	}
 
 	/**
 	Reset the state
 	*/
	me.deselect = function() {
		me.disabled = false;
		me.state = me.stateType.NORMAL;

		me.hasChanged();
	};

	/**
	Render the hexagon
	*/
	me.update = function(delta) {

		if (!delta) delta = 0; // Check if delta is good
		if (me.futureTime !== 0) animate(delta); // Animate values
		if (!me.delegate.forceRender && !me.changed) return; // Skip rendering if not required

		var settings = me.delegate.settings; // Point to settings

		var size = parseInt(settings.size); // Resolve size

		var hexWidth = size*0.866; // Calculate the supposed width

		me.graphics.clear(); // Clear the graphics instance

		// Set Stroke
		me.graphics.lineStyle(settings.lineWidth, settings.lineColor);

		// Resolve background color
		var color = null;
		var override = me.state == me.stateType.ALTERNATIVE || me.state == me.stateType.CUSTOM;
		if (me.disabled && !override)
			color = settings.disabledColor;
		else
			switch (me.state) {
				case me.stateType.NORMAL:
					color = settings.bgColor;
				break;
				case me.stateType.ALTERNATIVE:
					color = settings.altColor;
				break;
				case me.stateType.SELECTED:
					color = settings.highlightColor;
				break;
				default:
					color = me.customColor;
			}
		color = parseInt(color);
		me.graphics.beginFill(color); // Set Fill

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

	/**
	Handle clicks
	*/
	me.graphics.click = function(ev) {
		if (me.disabled) return;

		if (me.delegate)
			me.delegate.notify(me.index, !me.is(me.stateType.SELECTED));
	};

	/**
	Handle animating values
	*/
	var animate = function(delta) {
		var set = delta <= 0 || me.futureTime-delta <= 0;

		for (var key in me.future) {
			if (me.future[key] !== null && me.future[key] !== undefined) {
				if (set)
					me[key] = me.future[key];
				else {
					me[key] += delta*(me.future[key]-me[key])/me.futureTime;
				}
			}
		}

		if (set) 
			me.futureTime = 0;
		else
			me.futureTime -= delta;

		me.hasChanged();
	};
}