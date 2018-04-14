var type = "WebGL";

if(!PIXI.utils.isWebGLSupported()){
  type = "canvas";
}

PIXI.utils.sayHello(type);

var be = document.getElementById('display');

var renderer = PIXI.autoDetectRenderer($(be).innerWidth(), $(be).innerWidth(), {
	transparent: true,
	resolution: 1,
	antialias: true
});
var interaction = renderer.plugins.interaction;

var stage = new PIXI.Container();

var pascal = new pascal();
pascal.renderX = $(be).innerWidth()/2;
pascal.side = $(be).innerWidth();

stage.addChild(pascal.container);

var lastTime = 0;
var frameskip = 1;
var framecounter;

$('#display').append(renderer.view);

var unbubble = function(event) {
	event.preventDefault();
	event.stopPropagation();
};
$(renderer.view).mousedown(unbubble).mousemove(unbubble);


PIXI.loader.load(setup);

var zoom = 1.0;

function setup() {
	pascal.setup(localStorage.getItem('height'), stage);
	framecounter = 0;

	animate(0);
}

function animate(time) {

	requestAnimationFrame(animate);

	if (framecounter < frameskip) {
		framecounter++;
		return;
	}
	framecounter = 0;

	var delta = time - lastTime; // in ms
	lastTime = time;
	
	pascal.update(delta);

	renderer.render(stage);

	// output fps
	// console.log((1000/delta)+' fps');
}

var zoomDiff = 0.1;
var zoomValue = 1.0;

function framezoom(zoom) {
	zoomValue += zoom?zoomDiff:-zoomDiff;
	pascal.setZoom(zoomValue);
}
