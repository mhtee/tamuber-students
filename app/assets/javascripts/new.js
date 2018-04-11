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


