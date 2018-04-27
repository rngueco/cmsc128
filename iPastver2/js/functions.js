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
var frameskip = 0;
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

    updatePosDisplay();
}

function onDragMove() {
	var here = pascal.container;

    if (here.dragging) {
    	moved = true;
    	var newPosition = here.data.getLocalPosition(here.parent);
    	here.position.x = newPosition.x;
    	here.position.y = newPosition.y;

    	updatePosDisplay();
    }
}

function updatePosDisplay() {
	var x = pascal.container.position.x - pascal.container.pivot.x;
	var y = pascal.container.position.y - pascal.container.pivot.y;
	$('#posValue').html('('+x.toFixed(0)+', '+y.toFixed(0)+')');
}

function resetPosition() {
	pascal.container.position.x = 0;
	pascal.container.position.y = 0;

	pascal.container.pivot.x = 0;
	pascal.container.pivot.y = 0;

	pascal.container.updateTransform();

	updatePosDisplay();
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

function formatHexColor(value) {
	var a = parseInt(value).toString(16);
	var p = "";
	for (var i = 0; i < 6-a.length; i++) 
		p += '0';
	a = '#' + p + a;
	return a;
}

function loadPascalParameters() {
	var query = getQueryParams();
	pascal.loadSettings(query);

	var s = pascal.settings;

	$('#modeSelect').val(s.mystery);
	$('#heightInput').val(s.height);

	// bgColorInput, txtColorInput, strkColorInput, slctColorInput, altColorInput, disColorInput
	$('#bgColorInput').val(formatHexColor(s.bgColor));
	$('#txtColorInput').val(formatHexColor(s.textColor));
	$('#strkColorInput').val(formatHexColor(s.lineColor));
	$('#slctColorInput').val(formatHexColor(s.highlightColor));
	$('#altColorInput').val(formatHexColor(s.altColor));
	$('#disColorInput').val(formatHexColor(s.disabledColor));

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


function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return Math.round(r * 255)*256*256+Math.round(g * 255)*256+Math.round(b * 255);
}

// Load new settings 
function applySettings() {
	pascal.settings.mystery = $('#modeSelect').val();
	pascal.settings.height = $('#heightInput').val();
	
	restart();
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