//set up handlers for selecting a route
function updateSelectedRoute(routes) {
	for (var i = -1; i < routes.length; i++) {
		$('#route_'+ (i + 1).toString()).click(function() {
			
			//reset all rows to normal color
			for (var j = -1; j < routes.length; j++) {
				$('#route_'+ (j + 1).toString()).css('background', '');
			}
			
			//make selected row yellow 
			$(this).css('background', '#FFFF87');
			
			//put this route's info into the form
			$('#trip_cart_route_id').attr('value', $(this).attr('id')[$(this).attr('id').length - 1]);
			$('#startPoint').attr('value', routes[$(this).attr('id')[$(this).attr('id').length - 1]].startPoint);
			$('#endPoint').attr('value', routes[$(this).attr('id')[$(this).attr('id').length - 1]].endPoint);
			$('#routeCartID').attr('value', routes[$(this).attr('id')[$(this).attr('id').length - 1]].cartID);
			console.log(routes[$(this).attr('id')[$(this).attr('id').length - 1]].cartID); //FIXME
			var coordsString = coordsToString(routes[$(this).attr('id')[$(this).attr('id').length - 1]].waypoints);
			$('#wayPoints').attr('value', coordsString);
			
			//display the "start trip" button
			$('#startTrip').slideDown("slow");
		});
	}
	
	//set the form fields
	//$('#startPoint').attr('value', routes[])

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
		url : "ws://166.155.203.130:9090" //this shouldn't be hardcoded, would be good to get it from tripscontroller @cartIPs
	});
	console.log(ros);
	ros.on('connection', function() {
		console.log("ROS is connected");
	});
	ros.on('error', function(error) {
		console.log("Error connecting to ROS: ", error);
	});
}

function coordsToString(coords) {
	var coordsString = '';
	for (var i = 0; i < coords.length; i++) {
		coordsString = coordsString + coords[i].lat + "," + coords[i].lng + ";";
	}
	return coordsString;
}

