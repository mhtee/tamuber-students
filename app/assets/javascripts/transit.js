var cartMarker = new google.maps.Marker({
	map : map,
	strokeColor : "blue",
	name : "cart"
});

var ros = new ROSLIB.Ros({
	url : "ws://166.155.203.130:9090"
});

function addMarker(coordinates) {
	var mylatlng = new google.maps.LatLng(coordinates.latitude, coordinates.longitude);
	cartMarker.setPosition(mylatlng);
}

function trackCart() {
	console.log("Getting waypoint array...");
	var routeListener = new ROSLIB.Topic({
		ros : ros,
		name :'/waypoints_lla',
		messageType : 'visualization_msgs/Marker'
	});
	routeListener.subscribe(function(message) {
		console.log("Initial: " + message);
		routeListener.unsubscribe();
		var parsedWaypts = (message.points);
		console.log(parsedWaypts);
		calculateAndDisplayRoute(parsedWaypts);
	});
}

function endTrip() {
		window.location.href = "/end";
	var endTrip = new ROSLIB.Service({
		ros : ros,
		name : 'TBD',		// TODO: add ros service for ending trip
		serviceType : 'TBD'
	});
	var request = new ROSLIB.ServiceRequest();
	endTrip.callService(request, function(result) {
		ros.close();
		window.href = "/end";
	});
}

window.onload = function() {
	//document.getElementById("endbtn").style.display = "block";
	//document.getElementById("endbtn").disabled = false;
	ros.on('connection', function() {
		console.log("ROS is connected");
	});
	ros.on('error', function(error) {
		console.log("Error connecting to ROS: ", error);
	});
	ros.on('close', function() {
		console.log("Connection to ROS closed");
	});
	trackCart();
	setInterval(function() {
		var GPSListener = new ROSLIB.Topic({
			ros : ros,
			name : '/vectornav/fix',
			messageType : 'sensor_msgs/NavSatFix'
		});
		GPSListener.subscribe(function(message) {
			GPSListener.unsubscribe();
			addMarker(message);
		});
		var EndListener = new ROSLIB.Topic({
			ros : ros,
			name : 'TBD', // TODO: add ros topic
			messageType : 'std_msgs/Bool'
		});
		EndListener.subscribe(function(message) {
			if (message) {
				document.getElementById("endbtn").style.display = "block";
				document.getElementById("endbtn").disabled = false;
			};
		});
	}, 5000);
}

