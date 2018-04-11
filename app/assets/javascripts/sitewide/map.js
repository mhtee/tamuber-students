
var directionsService;
var map = null;
var infowindow;
var marker;
var stmarker;
var showDirections = true;

function initMap() {
  //alert('init map'); //FIXME
  // Initialize Direction Services  
  directionsService = new google.maps.DirectionsService;
  //alert('directions service created'); //FIXME
  // Create a map.
  //alert(document.getElementById('mapid')); //FIXME
  //if (!map) {
    map = new google.maps.Map(document.getElementById('mapid'), {
      zoom: 15,
      center: {lat: 30.6185, lng: -96.3365},
      mapTypeControl: false
    });
  //}
  //alert('map initialized'); //FIXME
}

function initMapWithMarker(lat, lng, startPoint) {
  var mapEl = $('#map');
  var optimized = mapEl.data('test-env'); //so that marker elements show up for testing
  //alert(optimized);
  var myLatLng = {lat: lat, lng: lng};
  map = new google.maps.Map(document.getElementById('mapid'), {
    zoom: 16,
    center: {lat: lat, lng: lng},
    mapTypeControl: false
  });
  
  
  
  var address = ""
  //get human-readable address from given coordinates
  $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"&key=AIzaSyAD5o_wun4okt9SRxSFULafNoDBGGoq4Ac", function(data, status){
      var contentString = '<h3>'+startPoint+"</h3>"
      if(data.status == "OK") {
        address = data.results[0].formatted_address
        //contentString = contentString + "<p>Closest address: "+address+"</p>"
      }
      
      infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 250
      });
        
      marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: startPoint,
        optimized: optimized
      });
      //alert(marker.optimized);
      if (!marker.optimized) { //make markers show up as dom elements so we can test them with cucumber
        var myoverlay = new google.maps.OverlayView();

        myoverlay.draw = function () {
          this.getPanes().markerLayer.id = 'markers';
        };
  
        myoverlay.setMap(map);
      }
     // marker.MarkerOptions.optimized = false;
      
      marker.addListener('mouseover', function() {
        infowindow.open(map, marker);
      });
      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });
     
      google.maps.event.trigger(marker, 'click', {
        latLng: new google.maps.LatLng(0, 0)
      });
  });
    
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
  directionsDisplay.setMap(map);

}
function removeDirections() {
  directionsDisplay.setMap(null);
}
function calcRoute(lat, lng) {
  if (showDirections == false) {
    showDirections = !showDirections;
    directionsDisplay.setMap(null);
    //stmarker= new google.maps.Marker({map: null});
    return;
  }
  
 
  var start = {
    lat: 0,
    lng: 0
  };
  
  if (navigator.geolocation) {
    directionsDisplay.setMap(map)
    navigator.geolocation.getCurrentPosition(function(position) {
      start = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
        };
        
        var end = {
            lat: lat,
            lng: lng
        };

        var request = {
          origin: start,
          destination: end,
          travelMode: 'WALKING'
        };
        directionsService.route(request, function(result, status) {
          if (status == 'OK') {
            directionsDisplay.setDirections(result);
              stmarker = new google.maps.Marker({
              position: start,
              map: map,
              icon: '/if_Star_Gold_1398915.png',
              optimized: false
            });
            infowindow.close()
          }
        });
        
      }, function() {
            alert('Directions to pickup point not available');
          });
  } 
  else {
    alert("Directions to pickup point not available")
  }
  showDirections = !showDirections;
  
}


function calculateAndDisplayRoute(request, startPointName, endPointName, routeId) {
  //alert('reinit map');
  initMap();
  //alert('done init map');
  selectRoute(startPointName + " to " + endPointName);
  var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
  directionsDisplay.setMap(map);
  var startPoint;
  var endPoint;

  //alert("starting service callback");
	var service_callback = function(response, status) {
		if (status === 'OK') {
			directionsDisplay.setDirections(response);
		} else {
			window.alert('Directions request failed due to ' + status);
		}
	}
  //alert("servece callback done"); //FIXME
  //var jsonData = JSON.parse(request);
	for (var i = 0, parts = [], max = 22; i < request.length; i = i+max) {
		parts.push(request.slice(i, i + max + 1));
	}
	//alert(parseFloat(parts[0][0].lat)); //FIXME
	startPoint = new google.maps.LatLng(parseFloat(parts[0][0].lat), parseFloat(parts[0][0].lng));
	//alert('created startPoint'); //FIXME
    var startMark = new google.maps.Marker({
      position: startPoint,
      map: map,
      title: startPointName,
      icon: '/if_Star_Gold_1398915.png'
    });
    
    var startInfo = new google.maps.InfoWindow({
      content: '<h4>' + startPointName + '</h4>',
      maxWidth: 250
    });
    startMark.addListener('mouseover', function() {
      startInfo.open(map, startMark);
    });
    
    endPoint = new google.maps.LatLng(parseFloat(parts[0][parts[0].length-1].lat), parseFloat(parts[0][parts[0].length-1].lng))
    
    //add marker at end point
    var endMark = new google.maps.Marker({
      position: endPoint,
      map: map,
      title: endPointName,
    });
    var endInfo = new google.maps.InfoWindow({
      content: '<h4>' + endPointName + '</h4>',
      maxWidth: 250
    });
    endMark.addListener('mouseover', function() {
      endInfo.open(map, endMark);
    });
    
    //alert("markers added"); //FIXME
      
	//console.log(parts)
  for (var i = 0; i < parts.length; i++) {
		var waypts = [];
		for (var j = 0; j < parts[i].length - 1; j++) {
			waypts.push({
				location : new google.maps.LatLng(parseFloat(parts[i][j].lat), parseFloat(parts[i][j].lng)),
				stopover : false
			});
		}
		//alert(parts[i][parts[i].length-1].lat)
		var service_opts = {
			origin: new google.maps.LatLng(parseFloat(parts[i][0].lat), parseFloat(parts[i][0].lng)),
			destination: new google.maps.LatLng(parseFloat(parts[i][parts[i].length-1].lat), parseFloat(parts[i][parts[i].length-1].lng)),
			waypoints: waypts,
			optimizeWaypoints: true,
			travelMode: 'WALKING'
		};
		directionsService.route(service_opts, service_callback);
	}
}

function selectRoute(route) {
	$('#selectedRoute').text(route);
}

