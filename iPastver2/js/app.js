var type = "WebGL";

if(!PIXI.utils.isWebGLSupported()){
  type = "canvas";
}

PIXI.utils.sayHello(type);

pascal.renderX = display.innerWidth()/2;
pascal.side = display.innerWidth();

stage.addChild(pascal.container);

$('#display').append(renderer.view);

renderer.plugins.interaction.on('pointerdown', onDragStart);
renderer.plugins.interaction.on('pointerup', onDragEnd);
renderer.plugins.interaction.on('pointerupoutside', onDragEnd);
renderer.plugins.interaction.on('pointermove', onDragMove);

$(renderer.view).mousedown(unbubble).mousemove(unbubble);
$(window).resize(adjustRenderSize);

loadPascalParameters();

PIXI.loader.load(setup);

