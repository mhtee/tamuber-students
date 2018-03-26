window.onload = function() {
	var ros = new ROSLIB.Ros({
		ip: '166.155.203.130',
		port: '9090'
	});
	ros.on('connection', function() {
		console.log('Connected to ROS server.');
	});
	ros.on('error', function(error) {
		console.log('Error connecting to ROS server: ', error);
	});
	ros.on('close', function() {
		console.log('Closed connection to ROS server.');
	});
	console.log(ros);
	// TODO: Add ROS Queries
	
	
}
