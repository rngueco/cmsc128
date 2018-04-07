
function hexagonFactory() {
	var me = this;

	me.bgColor = 0x222222;
	me.lineColor = 0xff0000;
	me.size = 100;
	me.lineWidth = 5;

	me.texture = null;

	me.graphics = new PIXI.Graphics();

	me.render = function(renderer) {
		me.texture = new PIXI.RenderTexture(renderer, me.size, me.size);

		me.graphics.clear();

		var meWidth = me.size*0.866;

		me.graphics.lineStyle(me.lineWidth, me.lineColor);
		me.graphics.beginFill(me.bgColor);

		me.graphics.moveTo(meWidth*0.5, 0);
		me.graphics.lineTo(meWidth,     me.size*0.25);
		me.graphics.lineTo(meWidth,     me.size*0.75);
		me.graphics.lineTo(meWidth*0.5, me.size);
		me.graphics.lineTo(0,            me.size*0.75);
		me.graphics.lineTo(0,            me.size*0.25);
		me.graphics.lineTo(meWidth*0.5, 0);

		me.graphics.endFill();

		me.texture.render(me.graphics);
	};

	me.makeSprite = function() {
		return new PIXI.Sprite(me.texture);
	};
}