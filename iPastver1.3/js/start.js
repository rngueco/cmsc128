function begin(){
	var inp = document.getElementById("id").value;
	localStorage.setItem("height",inp);
	localStorage.setItem("mode","symmetry");
	window.location.href = "main.html";
}

function CHeight(){
	localStorage.setItem("height",document.getElementById("id").value);
	location.reload();
}

function CMode(md){
	localStorage.setItem("mode",md);
	location.reload();
}