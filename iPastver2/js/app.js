var type = "WebGL";

if(!PIXI.utils.isWebGLSupported()){
  type = "canvas";
}

PIXI.utils.sayHello(type);

loadMysteryMenu();
loadPascalParameters();

pascal.side = display.innerWidth()/resolution;
pascal.renderX = pascal.side/2;

stage.addChild(pascal.container);

// initialize on multiple elements with jQuery
$('.color-input').each( function( i, elem ) {
  var hueb = new Huebee( elem, {
    // options
  });
});

renderer.plugins.interaction.on('pointerdown', onDragStart);
renderer.plugins.interaction.on('pointerup', onDragEnd);
renderer.plugins.interaction.on('pointerupoutside', onDragEnd);
renderer.plugins.interaction.on('pointermove', onDragMove);

mc.add(new Hammer.Pinch({ threshold: 0 }));
mc.on("pinchstart pinchmove", onPinch);


$(renderer.view).mousedown(unbubble).mousemove(unbubble);

$(window).resize(adjustRenderSize);

PIXI.loader.load(setup);

updatePosDisplay();
