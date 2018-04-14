var pascalMode = 'symmetry';
var pascalHeight = 0;

var display = $('#display');

var renderer = PIXI.autoDetectRenderer(display.innerWidth(), $(window).height(), {
	transparent: true,
	resolution: 1,
	antialias: true
});

var stage = new PIXI.Container();

var pascal = new pascal();

var lastTime = 0;
var frameskip = 1;
var framecounter;

var zoom = 1.0;

var zoomDiff = 0.1;
var zoomValue = 1.0;

var moved = false;

function onDragStart(event) {
	var here = pascal.container;

    here.data = event.data;

    var position = event.data.getLocalPosition(here);
    here.position.x += (position.x-here.pivot.x)*here.scale.x;
    here.position.y += (position.y-here.pivot.y)*here.scale.y;
    here.pivot.x = position.x;
    here.pivot.y = position.y;

    here.dragging = true;
}

function onDragEnd() {
	var here = pascal.container;

    here.dragging = false;
    delete here.data;
    if (moved)
    	$('#message').hide();
    moved = false;
}

function onDragMove() {
	var here = pascal.container;

    if (here.dragging) {
    	moved = true;
    	var newPosition = here.data.getLocalPosition(here.parent);
    	here.position.x = newPosition.x;
    	here.position.y = newPosition.y;
    }
}

// Resize
function adjustRenderSize() {
	var width = display.innerWidth();
	var height = $(window).height();
	renderer.resize(width, height);
}

// Take URL Parameters
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function loadPascalParameters() {
	var setMode = getParameterByName('mystery');
	var setHeight = getParameterByName('height');

	$('#modeSelect').val(setMode);
	$('#heightInput').val(setHeight);

	pascalMode = setMode ? setMode : pascalMode;
	pascalHeight = setHeight%1===0 ? setHeight : pascalHeight;
}

// Stop an event from escaping outside
function unbubble(event) {
	event.preventDefault();
	event.stopPropagation();
}

// Setup Pascal
function setup() {
	pascal.setup(pascalHeight, pascalMode);
	framecounter = 0;

	animate(0);
}

// Reload
function restart(mode, height) {
	var nextMode = mode?mode:pascalMode;
	var nextHeight = height%1===0?height:pascalHeight;

	window.location.href = 'main.html?height='+nextHeight+'&mystery='+nextMode;
}

// Load new settings 
function applySettings() {
	var nextMode = $('#modeSelect').val();
	var nextHeight = $('#heightInput').val();

	restart(nextMode, nextHeight);
}

// The LOOP
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

// Zoom in and out of canvas
function framezoom(willZoom) {
	zoomValue += willZoom?zoomDiff:-zoomDiff;
	pascal.setZoom(zoomValue);

	$('#zoomValue').html(zoomValue.toFixed(2)+'x');
}