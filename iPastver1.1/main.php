<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title></title>
	<link href="css/bootstrap.min.css" rel="stylesheet">
	<link href="css/simple-sidebar.css" rel="stylesheet">
	<link href="css/style.css" rel="stylesheet">
	<script type="text/javascript" src="js/pixi.min.js"></script>
	<script type="text/javascript" src="js/pascal.js"></script>
	<script type="text/javascript" src="js/hexagon.js"></script>
</head>
<body>
	<div id="wrapper">
		<?php include 'sidebar.php' ?>

		<nav class="navbar navbar-default navbar-static-top">
            <div class="container">
                <a href="#menu-toggle" class="navbar-brand" id="menu-toggle"><span class="glyphicon glyphicon-menu-hamburger"></span> iPasT</a>
                <p class="navbar-text navbar-right">A Pascal's Triangle Application</p>
            </div>
        </nav>

        <div id="page-content-wrapper">
        	<div class="container-fluid">
                <div class="col-lg-12 col-md-12" id="display">
    
                </div>
            </div>
        </div>
	</div>

	<!-- Bootstrap core JavaScript -->
	<script src="js/jquery.min.js"></script>
	<script src="js/bootstrap.bundle.min.js"></script>

    <!-- Menu Toggle Script -->
	<script>
	$("#menu-toggle").click(function(e) {
		e.preventDefault();
		$("#wrapper").toggleClass("toggled");
	});
	</script>

	<script type="text/javascript" src="js/app.js"></script>
</body>
</html>