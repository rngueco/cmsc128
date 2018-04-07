function hexindex() {
	var me = this;
	// Location
	me.row = 0;
	me.column = 0;

	// Compare locations
	me.compare = function(index) {
		var i = me.row*me.row+me.column;
		var j = index.row*index.row+index.column;
		return i-j;
	};
}

function pascal() {
	var me = this;
	var hexagons = [];

	// me.optimize = false;
	// var textures = [];

	/**
	Generate textures about now

	**/

	me.container = new PIXI.Container();
	me.container.interactive = true;

	me.renderX = 0;

	me.size = 100;

	me.mystery = new mysteryFactory();

	me.setup = function(n) {
		
		var size = me.size;
		var fWid = n*size;

		var offX = me.renderX-size/2;
		var offY = size/2;

		var tempX = offX;
		for (var i = 0; i<=n; i++) {
			var row = [];
			var c = 1;

			offX = tempX-(i-1)*size/2;

			for (var j = 0; j<=i; j++) {
				var newhex = new hexagon();
				newhex.setup(me.container);
				newhex.size = size;

				newhex.x = offX;
				newhex.y = offY;

				newhex.delegate = me;

				newhex.setIndex(i,j);

				newhex.value = c;
				c = parseInt(c*((i+1)-(j+1))/(j+1));

				row.push(newhex);

				offX += size;
			}

			offY += size-10; // better make this editable

			hexagons.push(row);
		}

		me.mystery.setup(localStorage.getItem('mode'), hexagons);
	};

	me.update = function(delta) {
		for (var i = 0; i<hexagons.length; i++) {
			for (var j = 0; j<hexagons[i].length; j++) {
				hexagons[i][j].update(delta);
			}
		}
	};

	me.setZoom = function(value) {
		me.container.scale.x = me.container.scale.y = value;
		me.container.updateTransform();

		console.log('zooommmmmm');
	};

	me.scroll = function(x,y) {

	};

	me.notify = function(index, isAdd) {
		me.mystery.loadMystery(index, isAdd);
		// Send to mystery factory
	};

	me.container
	    .on('pointerdown', onDragStart)
	    .on('pointerup', onDragEnd)
	    .on('pointerupoutside', onDragEnd)
	    .on('pointermove', onDragMove);

	function onDragStart(event) {
	    // store a reference to the data
	    // the reason for this is because of multitouch
	    // we want to track the movement of this particular touch
	    me.container.data = event.data;
	    var position = event.data.getLocalPosition(me.container);
	    me.container.position.x += (position.x-me.container.pivot.x)*me.container.scale.x;
	    me.container.position.y += (position.y-me.container.pivot.y)*me.container.scale.y;
	    me.container.pivot.x = position.x;
	    me.container.pivot.y = position.y;
	    
	    console.log(position);

	    
	    me.container.dragging = true;
	    
	}

	function onDragEnd() {
	    me.container.dragging = false;
	    // set the interaction data to null
	    me.container.data = null;
	    me.container.oldPosition = null;
	    me.container.interactiveChildren = true;
	}

	function onDragMove() {
	    if (this.dragging) {
	    	me.container.interactiveChildren = false;
	    	var newPosition = this.data.getLocalPosition(this.parent);
	    	me.container.position.x = newPosition.x;
	    	me.container.position.y = newPosition.y;
	    	console.log(newPosition);
	    }
	}

	// me.requestTexture = function(texture) {

	// };
}
