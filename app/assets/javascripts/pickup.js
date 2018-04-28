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

function startTrip() {
	window.location.href = "/transit";
	var StartTrip = new ROSLIB.Service({
		ros : ros,
		name : 'TBD',		// TODO: add ros service for starting trip
		serviceType : 'TBD'
	});
	var request = new ROSLIB.ServiceRequest();
	endTrip.callService(request, function(result) {
		window.location.href = "/transit";
	});
}

window.onload = function() {
	ros.on('connection', function() {
		console.log("ROS is connected");
	});
	ros.on('error', function(error) {
		console.log("Error connecting to ROS: ", error);
	});
	ros.on('close', function() {
		console.log("Connection to ROS closed");
	});
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
	}, 5000);
	var StartListener = new ROSLIB.Topic({
	ros : ros,
		name : 'TBD', // TODO: add ros topic
		messageType : 'std_msgs/Bool'
	});
	StartListener.subscribe(function(message) {
		if (message) {
			document.getElementById("startbtn").style.display = "block";
			document.getElementById("startbtn").disabled = false;
			StartListener.unsubscribe();
		};
	});
}

