//import * as PIXI from 'pixi.js';

function newTriangle(){
	var Tsize = document.getElementById('id').value;	// The input box should have an id of 'id'
	Tsize = Tsize.replace(/\D/g,'');	// Removes non-numeric characters (However the input box must only accept numbers)
	if(Tsize==""){	// Checks for user input and checks if it is a number
		return
	}
	//	Create triangle here
	for(var i=0;i<=Tsize;i++){
        alert(row(i));
    }
	alert("done");
}

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




/*

Algorithm for getting Pascal's Triangle values from: http://jsfiddle.net/FloydPink/555a6gso/

*/