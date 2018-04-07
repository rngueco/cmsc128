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

var stage = new PIXI.Container();

var pascal = new pascal();
pascal.renderX = $(be).innerWidth()/2;
pascal.side = $(be).innerWidth();

stage.addChild(pascal.container);

var lastTime = 0;
var frameskip = 5;
var framecounter;

document.getElementById('display').appendChild(renderer.view);

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
	zoom *= 0.5;
	pascal.setZoom(zoom);

	var delta = time - lastTime; // in ms
	lastTime = time;
	
	pascal.update(delta);

	renderer.render(stage);

	// output fps
	// console.log((1000/delta)+' fps');
}
