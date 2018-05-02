Math.radians = (degrees) => degrees * Math.PI/180.0;

function points_distance(start, end) {
  let R = 20902231;
  let lat1 = Math.radians(start.lat);
  let lat2 = Math.radians(end.lat);
  let delta_lat = Math.radians(end.lat-start.lat);
  let delta_lng = Math.radians(end.lng-start.lng);
  let a = Math.sin(delta_lat/2.0)**2.0 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(delta_lng/2.0)**2.0;
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

let eta = 0;
let speed = 25.0;

function calculate_eta(current, points) {
  let total = route_distance(points);
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
  eta = remaining/speed;
  $('#eta').html(`${Math.floor(eta/60.0).toFixed(0)}:${Math.floor(eta%60).toFixed(0).toString().padStart(2, '0')}`);
  setInterval(() => {
    if (eta >= 1) {
      eta -= 1;
      $('#eta').html(`${Math.floor(eta/60.0).toFixed(0)}:${Math.floor(eta%60).toFixed(0).toString().padStart(2, '0')}`);
    } else {
      if (window.location.href.endsWith('/pickup')) {
        $('#startbtn').css('visibility', 'visible');
      } else {
        $('#endbtn').css('visibility', 'visible');
      }
    }
  }, 1e3);
}

var ros = new ROSLIB.Ros({
	url : "ws://166.155.203.130:9090"
});

function addMarker(coordinates) {
	var mylatlng = new google.maps.LatLng(coordinates.latitude, coordinates.longitude);
	cartMarker.setPosition(mylatlng);
}

function endTrip() {
	// var endTrip = new ROSLIB.Service({
		// ros : ros,
		// name : 'TBD',		// TODO: add ros service for ending trip
		// serviceType : 'TBD'
	// });
	// var request = new ROSLIB.ServiceRequest();
	// endTrip.callService(request, function(result) {
		// ros.close();
		// window.location.href = "/end";
	// });
  window.location.href = "/end";
}

var cartMarker;

function update(start, waypoints, foo=true) {
	// ros.on('connection', function() {
		// console.log("ROS is connected");

    // setInterval(function() {
      // var GPSListener = new ROSLIB.Topic({
        // ros : ros,
        // name : '/vectornav/fix',
        // messageType : 'sensor_msgs/NavSatFix'
      // });
      // GPSListener.subscribe(function(message) {
        // GPSListener.unsubscribe();
        // addMarker(message);
      // });
      // var EndListener = new ROSLIB.Topic({
        // ros : ros,
        // name : 'TBD', // TODO: add ros topic
        // messageType : 'std_msgs/Bool'
      // });
      // EndListener.subscribe(function(message) {
        // if (message) {
          // document.getElementById("endbtn").style.display = "block";
          // document.getElementById("endbtn").disabled = false;
        // };
      // });
    // }, 5000);

    // {
      // const topic = new ROSLIB.Topic({
        // ros: ros,
        // name: '/vectornav/gps'
      // });
      // topic.subscribe(message => {
        // console.log(topic.name, message);
        // topic.unsubscribe();
        // let pos = message.LLA;
        // {
          // const topic = new ROSLIB.Topic({
            // ros: ros,
            // name: '/waypoints_lla'
          // });
          // topic.subscribe(message => {
            // console.log(topic.name, message);
            // calculate_eta(pos, message.points);
            // topic.unsubscribe();
          // });
        // }
      // });
    // }
	// });

	// ros.on('error', function(error) {
		// console.log("Error connecting to ROS: ", error);
	// });

	// ros.on('close', function() {
		// console.log("Connection to ROS closed");
	// });

  let end = waypoints[1];

  if (foo) {
    let route = new google.maps.Polyline({
      map: map,
      path: waypoints,
      geodesic: true,
      strokeColor: '#73b9ff',
      strokeOpacity: 1.0,
      strokeWeight: 4
    });

    let end_marker = new google.maps.Marker({
      name: "end",
      map: map,
      position: new google.maps.LatLng(end.lat, end.lng)
    });
  }

  let cart_image = new google.maps.MarkerImage('/car-small.png',
                  new google.maps.Size(32, 32),
                  new google.maps.Point(0, 0),
                  new google.maps.Point(16, 24));

  cartMarker = new google.maps.Marker({
    name: "cart",
    icon: cart_image,
    map: map,
    position: new google.maps.LatLng(start.lat, start.lng)
  });

  calculate_eta(start, waypoints);
  let interval = 1000;
  setInterval(() => {
    let delta = {lat: end.lat-cartMarker.position.lat(), lng: end.lng-cartMarker.position.lng()};
    let distance = points_distance({lat: cartMarker.position.lat(), lng: cartMarker.position.lng()}, end);
    console.log(distance);
    if (distance > speed) {
      let lat = delta.lat*speed/distance*interval/1000 + cartMarker.position.lat();
      let lng = delta.lng*speed/distance*interval/1000 + cartMarker.position.lng();
      cartMarker.setPosition(new google.maps.LatLng(lat, lng));
    } else {
      cartMarker.setPosition(new google.maps.LatLng(end.lat, end.lng));
    }
  }, interval);
}
