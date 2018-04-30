var type = "WebGL";

if(!PIXI.utils.isWebGLSupported()){
  type = "canvas";
}

PIXI.utils.sayHello(type);

loadMysteryMenu();
loadPascalParameters();

pascal.renderX = display.innerWidth()/2;
pascal.side = display.innerWidth();

stage.addChild(pascal.container);

$('#display').append(renderer.view);

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

$(renderer.view).mousedown(unbubble).mousemove(unbubble);
$(window).resize(adjustRenderSize);

PIXI.loader.load(setup);
updatePosDisplay();

