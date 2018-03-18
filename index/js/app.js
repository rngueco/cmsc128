PIXI.utils.sayHello();

var renderer = PIXI.autoDetectRenderer(512, 512, {
	transparent: true,
	resolution: 1,
	antialias: true
});

document.getElementById('display').appendChild(renderer.view);

var stage = new PIXI.Container();
stage.interactive = true;

PIXI.loader.load(setup);

function setup() {

	animate();
}

function animate() {
	// input
	//requestAnimationFrame(animate);

	// update
	var thex = new hexagon();
	thex.setup(stage);
	thex.x = 200;
	thex.y = 200;
	thex.update();

	// render
	renderer.render(stage);
}
