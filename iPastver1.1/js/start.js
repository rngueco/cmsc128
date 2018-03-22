function begin(){
	var inp = document.getElementById("id").value;
	localStorage.setItem("tmp",inp);
	window.location.href = "main.html";
}