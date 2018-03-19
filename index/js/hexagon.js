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

	var hex = this;

	// Settings
	hex.textColor = 0xffffff;
	hex.bgColor = 0x222222;
	hex.lineColor = 0xff0000;
	hex.value = 1;
	hex.size = 100;
	hex.lineWidth = 5;
	hex.fontSize = 26;
	hex.x = 0;
	hex.y = 0;

	hex.future = {};
	hex.futureTime = null;

	// Location
	hex.row = 0;
	hex.column = 0;

	// Delegate
	hex.delegate = null;

	// Renderable
	hex.graphics = new PIXI.Graphics();
	hex.graphics.interactive = true;
	hex.text = new PIXI.Text();
	hex.text.anchor.x = 0.5;
	hex.text.anchor.y = 0.5;

	// Updater
	hex.update = function(delta) {

		if (delta === undefined)
			delta = 0;

		if (hex.futureTime !== null)
			hex._animate(delta);
		
		if (hex.futureTime < 0) {
			hex.futureTime = null;
		}

		hex.graphics.clear();

		var hexWidth = hex.size*0.866;

		hex.graphics.lineStyle(hex.lineWidth, hex.lineColor);
		hex.graphics.beginFill(hex.bgColor);

		hex.graphics.moveTo(hex.x,              hex.y-hex.size*0.5);
		hex.graphics.lineTo(hex.x+hexWidth*0.5, hex.y-hex.size*0.25);
		hex.graphics.lineTo(hex.x+hexWidth*0.5, hex.y+hex.size*0.25);
		hex.graphics.lineTo(hex.x,              hex.y+hex.size*0.5);
		hex.graphics.lineTo(hex.x-hexWidth*0.5, hex.y+hex.size*0.25);
		hex.graphics.lineTo(hex.x-hexWidth*0.5, hex.y-hex.size*0.25);
		hex.graphics.lineTo(hex.x,              hex.y-hex.size*0.5);

		hex.graphics.endFill();
		
		hex.interactive = hex.buttonMode = true;

		hex.text.text = hex.value;
		hex.text.style.fill = hex.textColor;
		hex.text.style.fontSize = hex.fontSize;
		hex.text.x = hex.x;
		hex.text.y = hex.y;
	};

	hex._animate = function(delta) {
		
		var set = hex.futureTime-delta <= 0;

		for (var key in hex.future) {

			if (hex.future[key] !== null && hex.future[key] !== undefined) {
				if (set)
					hex[key] = hex.future[key];
				else {
					hex[key] += delta*(hex.future[key]-hex[key])/hex.futureTime;
				}
			}
		}

		hex.futureTime -= delta;
	};

	hex.graphics.click = function(ev) {
		// notify delegate
		console.log('clicked '+hex.row+' @ '+hex.column);
		hex.bgColor = 0x000fff;
	};

	hex.setup = function(stage) {
		stage.addChild(hex.graphics);
		stage.addChild(hex.text);
	};

	hex.set = function(property, value) {
		hex[property] = value;
		
	};
}