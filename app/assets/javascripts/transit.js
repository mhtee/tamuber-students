Math.radians = (degrees) => degrees * Math.PI/180.0;

function points_distance(start, end) {
  let R = 20902231;
  let lat1 = Math.radians(start.lat);
  let lat2 = Math.radians(end.lat);
  let delta_lat = Math.radians(end.lat-start.lat);
  let delta_lon = Math.radians(end.lng-start.lng);
  let a = Math.sin(delta_lat/2.0)**2.0 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(delta_lon/2.0)**2.0;
  let c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0-a));
  return R * c;
}

function route_distance(points) {
  let total = 0.0;
  for (let i = 0; i < points.length-1; ++i) {
    let start = points[i];
    let end = points[i+1];
    let distance = points_distance(start, end);
    total += distance;
  }
  return total;
}

var eta = 0;

function calculate_eta(current, points) {
  /*let total = route_distance(points);
  console.log(`total: ${total.toFixed(0)} feet`);
  for (let i = 0; i < points.length; ++i) {
    points[i].i = i;
    points[i].distance = points_distance(current, points[i]);
  }
  let sorted_points = points.slice();
  sorted_points.sort((a, b) => a.distance-b.distance);
  let shortest = sorted_points[0];
  let second = sorted_points[1];
  let remaining = 0.0;
  if (shortest.i > second.i) {
    remaining += route_distance(points.slice(shortest.i));
    remaining += points_distance(current, shortest);
  } else {
    remaining += route_distance(points.slice(second.i));
    remaining += points_distance(current, second);
  }
  // console.log(`traveled: ${(total-remaining).toFixed(0)} feet (${(100.0-remaining/total*100.0).toFixed(0)}%)`);
  // console.log(`remaining: ${remaining.toFixed(0)} feet (${(remaining/total*100.0).toFixed(0)}%)`);
  */
  let speed = 5.0;
  // console.log(`eta: ${(remaining/speed).toFixed(0)} seconds`);
  var remaining = points_distance(current, points[points.length - 1]);
  
  eta = (remaining/speed/60.0).toFixed(0);
  $('#eta').html(eta+' minutes');
  /*setInterval(() => {
    if (eta >= 1) {
      eta -= 1;
      $('#eta').html(`${(eta).toFixed(0)} minutes`);
    }
  }, 60000);*/
}

var cartMarker = new google.maps.Marker({
	strokeColor : "blue",
	name : "cart",
	icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 10
    }
});

var ros = new ROSLIB.Ros({
	url : "ws://166.155.203.130:9090"
});

function addMarker(coordinates) {
	var mylatlng = new google.maps.LatLng(coordinates.lat, coordinates.lng);
	cartMarker.setPosition(mylatlng);
}

//PREVIEW CODE \/ \/ \/

function movePercentage(percent, coords) {
  var index = Math.floor((coords.length-1) * percent);
  var cur_spot = {lat: coords[index].lat, lng: coords[index].lng};
  addMarker(cur_spot);
  calculate_eta(cur_spot, coords)
}

function updateCart(coords) {
  //increase percentage
  if (cur_percentage >= 1) {
    document.getElementById("endbtn").style.display = "block";
		document.getElementById("endbtn").disabled = false;
    return;
  }
  cur_percentage = cur_percentage + 0.10;
  movePercentage(cur_percentage, coords)
}

//PREVIEW CODE /\ /\ /\

function endTrip() {
		//window.location.href = "/end";
	var endTrip = new ROSLIB.Service({
		ros : ros,
		name : 'TBD',		// TODO: add ros service for ending trip
		serviceType : 'TBD'
	});
	var request = new ROSLIB.ServiceRequest();
	/*endTrip.callService(request, function(result) {
		ros.close();
		window.location.href = "/end";
	});*/
	window.location.href = "/end";
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

  {
    const topic = new ROSLIB.Topic({
      ros: ros,
      name: '/vectornav/gps'
    });
    topic.subscribe(message => {
      console.log(topic.name, message);
      topic.unsubscribe();
      let pos = message.LLA;
      {
        const topic = new ROSLIB.Topic({
          ros: ros,
          name: '/waypoints_lla'
        });
        topic.subscribe(message => {
          console.log(topic.name, message);
          calculate_eta(pos, message.points);
          topic.unsubscribe();
        });
      }
    });
  }
}
