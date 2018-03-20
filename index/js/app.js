var type = "WebGL";

if(!PIXI.utils.isWebGLSupported()){
  type = "canvas";
}

PIXI.utils.sayHello(type);

var renderer = PIXI.autoDetectRenderer(1024, 1024, {
	transparent: true,
	resolution: 1,
	antialias: true
});

document.getElementById('display').appendChild(renderer.view);

var stage = new PIXI.Container();
stage.interactive = true;

var n = 10;

var hexagons = [];
var size = 60;
var fWid = n*size;

var offX = fWid/2+100;
var offY = 100;

var tempX = offX;
for (var i = 0; i<n; i++) {
	var row = [];
	var c = 1;

	offX = tempX-(i-1)*size/2;

	for (var j = 0; j<=i; j++) {
		var newhex = new hexagon();
		newhex.setup(stage);
		newhex.size = size;

		newhex.x = offX;
		newhex.y = offY;

		newhex.row = i;
		newhex.column = j;

		newhex.value = c;
		c = parseInt(c*((i+1)-(j+1))/(j+1));

		row.push(newhex);

		offX += size;
	}

	offY += size;

	hexagons.push(row);
}

var lastTime = 0;
var frameskip = 2;
var framecounter;

PIXI.loader.load(setup);

function setup() {

	// update
	framecounter = 0;
	animate(0);
}

function animate(time) {
	// input
	requestAnimationFrame(animate);

	if (framecounter < frameskip) {
		framecounter++;
		return;
	}

	framecounter = 0;

	var delta = time - lastTime; // in ms
	lastTime = time;
	
	for (var i = 0; i<hexagons.length; i++) {
		for (var j = 0; j<hexagons[i].length; j++) {
			hexagons[i][j].update(delta);
		}
	}

	// render
	renderer.render(stage);

	console.log((1000/delta)+' fps');
}
