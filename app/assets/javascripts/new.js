function formCheck(form_id) {
 if (document.getElementById("trip_cart_route_id").value == '') {
		alert("Please select a route");
	} else {
		document.getElementById(form_id).submit();
	}
}

window.onload = function() {
	var ros = new ROSLIB.Ros({
		url : "ws://166.155.203.130:9090"
	});
	console.log(ros);
	ros.on('connection', function() {
		console.log("ROS is connected");
	});
	ros.on('error', function(error) {
		console.log("Error connecting to ROS: ", error);
	});

}

