var settings = {};

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

function applyColors() {
	// bgColorInput, txtColorInput, strkColorInput, slctColorInput, altColorInput, disColorInput

	var bg =   readColor( $('#bgColorInput').val() );
	var txt =  readColor( $('#txtColorInput').val() );
	var strk = readColor( $('#strkColorInput').val() );
	var slct = readColor( $('#slctColorInput').val() );
	var alt =  readColor( $('#altColorInput').val() );
	var dis =  readColor( $('#disColorInput').val() );

	pascal.setColor('bg', bg);
	pascal.setColor('text', txt);
	pascal.setColor('highlight', slct);
	pascal.setColor('alt', alt);
	pascal.setColor('disabled', dis);
	pascal.setColor('line', strk);
}

function readColor(string) {
	var colorString = string;

	if (colorString.startsWith("#")) 
		colorString = colorString.substring(1);

	if (colorString.length < 6) {
		var stringbuild = '';
		stringbuild += colorString.charAt(0)+colorString.charAt(0);
		stringbuild += colorString.charAt(1)+colorString.charAt(1);
		stringbuild += colorString.charAt(2)+colorString.charAt(2);

		colorString = stringbuild;
	}

	var num = parseInt(colorString, 16);

	return num;
}

// Resize
function adjustRenderSize() {
	var width = display.innerWidth();
	var height = $(window).height();
	renderer.resize(width, height);
}

function getQueryParams(qs) {
	if (!qs) qs = window.location.href;

    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]([^?=]+)=([^?&#]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

function loadPascalParameters() {
	var query = getQueryParams();
	pascal.loadSettings(query);

	var s = pascal.settings;

	$('#modeSelect').val(s.mystery);
	$('#heightInput').val(s.height);

	// bgColorInput, txtColorInput, strkColorInput, slctColorInput, altColorInput, disColorInput
	$('#bgColorInput').val('#'+s.bgColor.toString(16));
	$('#txtColorInput').val('#'+s.textColor.toString(16));
	$('#strkColorInput').val('#'+s.lineColor.toString(16));
	$('#slctColorInput').val('#'+s.highlightColor.toString(16));
	$('#altColorInput').val('#'+s.altColor.toString(16));
	$('#disColorInput').val('#'+s.disabledColor.toString(16));

	console.log(s);
}

// Stop an event from escaping outside
function unbubble(event) {
	event.preventDefault();
	event.stopPropagation();
}

// Setup Pascal
function setup() {
	pascal.setup();
	framecounter = 0;

	animate(0);
}

// Reload
function restart() {

	var str = $.param(pascal.settings);
	window.location.href = 'main.html?'+str;
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