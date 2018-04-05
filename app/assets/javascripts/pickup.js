indow.onload = function() {
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
	ros.on('close', function() {
		console.log("Connection to ROS closed");
	});
	
}

