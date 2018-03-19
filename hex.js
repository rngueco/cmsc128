var hexagonRadius = 50;
var hexagonHeight = hexagonRadius * Math.sqrt(3);
var height=20;

var app = new PIXI.Application(hexagonHeight*(height+2), 2*hexagonRadius*(height+2), {backgroundColor : 0x1099bb});
document.body.appendChild(app.view);

for (var i=0;i<=height;i++){
	
	var cont = row(i);
	
	for(var j=0;j<=i;j++){
		if(i%2==0){
			var hexaP = toHexagonPosition({
				x: app.renderer.width/2 + hexagonHeight*(j-(i/2)),
				y: hexagonRadius*2*(i+1)
			});
		}else{
			var hexaP = toHexagonPosition({
				x: app.renderer.width/2 + hexagonHeight*(0.5 + j-((i+1)/2)),
				y: hexagonRadius*2*(i+1)
			});
		}
		
		createBunny(hexaP.x,hexaP.y,cont[j]);
	}
}alert("done");

function createBunny(x,y,c){

    // create our little bunny friend..
    // var bunny = new PIXI.Sprite(texture);
  
//     var hexagon = new PIXI.Graphics();
//     hexagon.beginFill(0xFF0000);

//     hexagon.drawPolygon([
//         -64, 800,             //First point
//         64, 800,              //Second point
//         0, 0 
//     ])

//     hexagon.endFill();
//     hexagon.x = x;
//     hexagon.y = y;
	var cont = new PIXI.Text(c,{fontFamily : 'Arial', fontSize: 24, fill : "black", align : 'center'});
	cont.anchor.set(0.5,0.5);
  
    var bunny = new PIXI.Graphics();
	bunny.lineStyle(3,0x000000);
    bunny.beginFill(0xFF0000);
    bunny.drawPolygon([
      0, -hexagonRadius,
      hexagonHeight/2, -hexagonRadius/2,
      hexagonHeight/2, hexagonRadius/2,
      0, hexagonRadius,
      -hexagonHeight/2, hexagonRadius/2,
      -hexagonHeight/2, -hexagonRadius/2,
	  0, -hexagonRadius
    ]);
    bunny.endFill();
	
    bunny.x = x;
    bunny.y = y;
  
    // var bunny = new PIXI.Circle(0,0, 60);
    // bunny.mask = hexagon;
    
    // enable the bunny to be interactive... this will allow it to respond to mouse and touch events
    bunny.interactive = true;

    // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
    bunny.buttonMode = true;

    // center the bunny's anchor point
    // bunny.anchor.set(0.5);

    // make it a bit bigger, so it's easier to grab
    // bunny.scale.set(3);

    // setup events for mouse + touch using
    // the pointer events
    /*bunny
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);


    // move the sprite to its designated position
    bunny.x = x;
    bunny.y = y;*/

    // add it to the stage
	bunny.addChild(cont);
    app.stage.addChild(bunny);
    // app.stage.addChild(hexagon);
}

function onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
}

function onDragMove() {
  if (this.dragging) {
    var newPosition = this.data.getLocalPosition(this.parent);
    var hexaP = toHexagonPosition(newPosition);
    this.x = hexaP.x;
    this.y = hexaP.y;

    // this.mask.x = this.x;
    // this.mask.y = this.y;
  }
}

function toHexagonPosition(p) {
  var newP = {};
  var xIdx = Math.round(p.y / (hexagonRadius * (3 / 2)));
  newP.y = xIdx * (hexagonRadius * (3 / 2));
  if (xIdx % 2) {
    newP.x = Math.floor(p.x / (hexagonHeight)) * hexagonHeight + hexagonHeight / 2; 
  } else {
    newP.x = Math.round(p.x / (hexagonHeight)) * hexagonHeight;
  }
  
  return newP;
}

//		function for getting hexagon contents

function value(row, index) {
    if (index < 0 || index > row){
        return 0;
	}
    if (index === 1 || index === row){
        return 1;
	}
    return value(row - 1, index - 1) + value(row - 1, index);
}

function row(n) {
	var r = [];
    for(var i=0;i<=n;i++){
        r.push(value(n+1,i+1));
	}
    return r;
}