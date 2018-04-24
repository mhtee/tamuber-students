//set up handlers for selecting a route
function rowColorChanger(numRoutes) {
	for (var i = 0; i < numRoutes; i++) {
		$('#route_'+ (i + 1).toString()).click(function() {
			
			//reset all rows to normal color
			for (var j = 0; j < numRoutes; j++) {
				$('#route_'+ (j + 1).toString()).css('background', '');
			}
			
			//make selected row yellow 
			$(this).css('background', '#FFFF87');
			
			//put this route's id into the form
			$('#trip_cart_route_id').attr('value', $(this).attr('id')[$(this).attr('id').length - 1]);
			
			//display the "start trip" button
			$('#startTrip').slideDown("slow");
		});
	}

}




function formCheck(form_id) {
 if (document.getElementById("trip_cart_route_id").value == '') {
		alert("Please select a route");
	} else {
		document.getElementById(form_id).submit();
	}
}


function publish_routes() {
	
	var routes = [
		{start : "Cyclotron", end : "HRBB",
        waypoints : [{lat : "30.620407", lng : "-96.341469"},
        {lat : "30.6192385", lng : "-96.33849499999999"}]},
        {start : "HRBB", end : "ETB",
        waypoints : [{lat : "30.6192385", lng : "-96.33849499999999"},
        {lat : "30.620428", lng : "-96.337775"}, {lat : "30.622837", lng : "-96.33939699999999"}]},
        {start : "HRBB", end : "EIC",
        waypoints : [{lat : "30.6192385", lng : "-96.33849499999999"},
        {lat : "30.61856569999999", lng : "-96.34146819999999"}]},
        {start : "RDMC", end : "SBISA",
        waypoints : [{lat : "30.618236", lng : "-96.341011"},
        {lat : "30.616504", lng : "-96.342961"}, {lat : "30.6172110", lng : "-96.3437860"}]},
        {start : "EIC", end : "SBISA",
        waypoints : [{lat : "30.61856569999999", lng : "-96.34146819999999"},
        {lat : "30.616504", lng : "-96.342961"}, {lat : "30.6172110", lng : "-96.3437860"}]}];
        
    var num_of_routes = Math.floor(Math.random() * 4);
        
    var routes_to_return = [];
        
    if (num_of_routes == 0) {
	    routes_to_return = [];
	} else if (num_of_routes == 1) {
	    routes_to_return.push(routes[Math.floor(Math.random() * 5)]);
	} else if (num_of_routes == 2) {
	    routes_to_return.push(routes[Math.floor(Math.random() * 2)]);
	    routes_to_return.push(routes[Math.floor(Math.random() * 3) + 2]);
	} else {
	    routes_to_return.push(routes[Math.floor(Math.random() * 2)]);
	    routes_to_return.push(routes[Math.floor(Math.random() * 3) + 1]);
	    routes_to_return.push(routes[4]);
	}
	
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
	
	var routesTopic = new ROSLIB.Topic({
		ros: ros,
		name: '/routes_info', // use a sensible namespace
		messageType: 'std_msgs/String'
	});
	
	var msg = new ROSLIB.Message({
    	data: JSON.stringify(routes_to_return)
	});
	
	console.log("MSG: ", JSON.stringify(routes_to_return));
	
	routesTopic.publish(msg);
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
	
	publish_routes()

}

