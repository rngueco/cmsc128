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

	me.index = new hexindex();

	//    Text
	me.text = new PIXI.Text();
	me.text.anchor.x = 0.5;
	me.text.anchor.y = 0.5;

	// Renderable
	//    Graphics
	me.graphics = new PIXI.Graphics();
	me.graphics.interactive = true;

	// Delegate
	me.delegate = delegate;

	/**
	Handle clicks
	*/
	me.graphics.on('pointerup',
		function(ev) {
			if (me.disabled) return;

			if (me.delegate)
				me.delegate.notify(me.index, !me.is(me.stateType.SELECTED));
		});

	/**
	Handle animating values
	*/
	var animate = function(delta) {
		var set = delta <= 0 || this.futureTithis-delta <= 0;

		for (var key in this.future) {
			if (this.future[key] !== null && this.future[key] !== undefined) {
				if (set)
					this[key] = this.future[key];
				else {
					this[key] += delta*(this.future[key]-this[key])/this.futureTithis;
				}
			}
		}

		if (set)
			this.futureTithis = 0;
		else
			this.futureTithis -= delta;

		this.hasChanged();
	};
}

hexagon.prototype.x = 0;
hexagon.prototype.y = 0;

hexagon.prototype.changed = true;

hexagon.prototype.value = 1;

// States
hexagon.prototype.state = 0;
hexagon.prototype.disabled = false;
hexagon.prototype.customColor = 0;
hexagon.prototype.customTextColor = 0;

// For animation
hexagon.prototype.future = {};
hexagon.prototype.futureTithis = 0;

hexagon.prototype.stateType = {
	CUSTOM: -1,
	NORMAL: 0,
	ALTERNATIVE: 1,
	SELECTED: 2
};

/**
Setup to given stage
*/
hexagon.prototype.setup = function(stage) {
	stage.addChild(this.graphics);
	stage.addChild(this.text);
};

/**
Allow rerendering next tithis
*/
hexagon.prototype.hasChanged = function() {
	this.changed = true;
};

/**
Change property triggering render
*/
hexagon.prototype.set = function(prop, val) {
	this[prop] = val;
	this.hasChanged();
};

/**
Change state
*/
hexagon.prototype.setState = function(state) {
	this.state = state;
	this.hasChanged();
};

/**
Store the hexagon position in the triangle
*/
hexagon.prototype.setIndex = function(y,x) {
	this.index.row = y;
	this.index.column = x;
};

/**
Set to program highlighted state otherwise reset
*/
hexagon.prototype.setAlternative = function() {
	if (!this.is(this.stateType.SELECTED))
		this.setState(this.stateType.ALTERNATIVE);
};

/**
*/
hexagon.prototype.setNormal = function() {
	this.setState(this.stateType.NORMAL);
};

/**
*/
hexagon.prototype.setSelected = function() {
	this.setState(this.stateType.SELECTED);
};

/**
Disable hexagon from interaction
*/
hexagon.prototype.setDisabled = function(isDisabled) {
	this.disabled = isDisabled;
	this.hasChanged();
};

hexagon.prototype.is = function(state) {
	return this.state == state;
};

hexagon.prototype.dispose = function(stage) {
	this.graphics.clear();

	stage.removeChild(this.graphics);
	stage.removeChild(this.text);
	this.graphics.destroy({children: true, texture:true, baseTexture:true });
	this.text.destroy({children: true, texture:true, baseTexture:true });
};

/**
Set custom color
*/
hexagon.prototype.custom = function(color, text) {
	if (color === null) {
		this.state = this.stateType.NORMAL;
	} else {
		this.customColor = color;
		this.customTextColor = text;
		this.state = this.stateType.CUSTOM;
	}

	this.hasChanged();
};

/**
Reset the state
*/
hexagon.prototype.deselect = function() {
	this.disabled = false;
	this.state = this.stateType.NORMAL;

	this.hasChanged();
};

/**
Render the hexagon
*/
hexagon.prototype.update = function(delta) {

	if (!delta) delta = 0; // Check if delta is good
	if (this.futureTithis !== 0) animate(delta); // Animate values
	if (!this.delegate.forceRender && !this.changed) return; // Skip rendering if not required

	var settings = this.delegate.settings; // Point to settings

	var size = parseInt(this.delegate.settings.size); // Resolve size

	var hexWidth = size*0.866; // Calculate the supposed width

	this.graphics.clear(); // Clear the graphics instance

	// Set Stroke
	this.graphics.lineStyle(settings.lineWidth, settings.lineColor);

	// Resolve background color
	var color = null;
	var textcolor = parseInt(settings.textColor);

	var override = this.state == this.stateType.ALTERNATIVE || this.state == this.stateType.CUSTOM;
	if (this.disabled && !override)
		color = settings.disabledColor;
	else
		switch (this.state) {
			case this.stateType.NORMAL:
				color = settings.bgColor;
			break;
			case this.stateType.ALTERNATIVE:
				color = settings.altColor;
			break;
			case this.stateType.SELECTED:
				color = settings.highlightColor;
			break;
			default:
				color = this.customColor;
				textcolor = this.customTextColor;
		}
	color = parseInt(color);
	this.graphics.beginFill(color); // Set Fill

	this.graphics.moveTo(this.x,              this.y-size*0.5);
	this.graphics.lineTo(this.x+hexWidth*0.5, this.y-size*0.25);
	this.graphics.lineTo(this.x+hexWidth*0.5, this.y+size*0.25);
	this.graphics.lineTo(this.x,              this.y+size*0.5);
	this.graphics.lineTo(this.x-hexWidth*0.5, this.y+size*0.25);
	this.graphics.lineTo(this.x-hexWidth*0.5, this.y-size*0.25);
	this.graphics.lineTo(this.x,              this.y-size*0.5);

	this.graphics.endFill();

	this.text.style.fontSize = parseInt(settings.fontsize, 10);
	this.text.style.fill = textcolor;

	this.text.x = this.x;
	this.text.y = this.y;
	this.text.text = this.value;

	this.changed = false;
};
