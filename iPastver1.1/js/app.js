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

document.getElementById('display').appendChild(renderer.view);

var stage = new PIXI.Container();
stage.interactive = true;

var pascal = new pascal();



pascal.renderX = $(be).innerWidth()/2;
console.log(pascal.renderX);

var lastTime = 0;
var frameskip = 5;
var framecounter;

PIXI.loader.load(setup);

function setup() {
	pascal.setup(10, stage);
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
