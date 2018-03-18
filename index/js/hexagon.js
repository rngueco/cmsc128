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

	// Location
	hex.row = 0;
	hex.column = 0;
	hex.x = 0;
	hex.y = 0;

	// Delegate
	hex.delegate = null;

	// Renderable
	hex.shape = new PIXI.Graphics();
	hex.shape.interactive = true;
	hex.text = new PIXI.Text();
	hex.text.anchor.x = 0.5;
	hex.text.anchor.y = 0.5;

	// Updater
	hex.update = function() {
		hex.shape.clear();

		var hexWidth = hex.size*0.866;

		hex.shape.lineStyle(hex.lineWidth, hex.lineColor);
		hex.shape.beginFill(hex.bgColor);

		hex.shape.moveTo(hex.x,              hex.y-hex.size*0.5);
		hex.shape.lineTo(hex.x+hexWidth*0.5, hex.y-hex.size*0.25);
		hex.shape.lineTo(hex.x+hexWidth*0.5, hex.y+hex.size*0.25);
		hex.shape.lineTo(hex.x,              hex.y+hex.size*0.5);
		hex.shape.lineTo(hex.x-hexWidth*0.5, hex.y+hex.size*0.25);
		hex.shape.lineTo(hex.x-hexWidth*0.5, hex.y-hex.size*0.25);
		hex.shape.lineTo(hex.x,              hex.y-hex.size*0.5);

		hex.shape.endFill();
		

		hex.interactive = hex.buttonMode = true;

		hex.text.text = hex.value;
		hex.text.style.fill = hex.textColor;
		hex.text.x = hex.x;
		hex.text.y = hex.y;
	};

	hex.shape.click = function(ev) {
		// notify delegate
		alert('clicked '+hex.row+' @ '+hex.column);
	};

	hex.setup = function(stage) {
		stage.addChild(hex.shape);
		stage.addChild(hex.text);
	};
}