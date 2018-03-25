
var directionsService;
var map;

function initMap() {
  // Initialize Direction Services  
  directionsService = new google.maps.DirectionsService;

  // Create a map.
  map = new google.maps.Map(document.getElementById('mapid'), {
    zoom: 15,
    center: {lat: 30.6185, lng: -96.3365},
    mapTypeControl: false
  });

}

function initMapWithMarker(lat, lng, startPoint) {
  
  
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
        contentString = contentString + "<p>Closest address: "+address+"</p>"
      }
      
      var infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 250
      });
        
      var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: startPoint
      });
      
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
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);

}
function calcRoute(lat, lng) {
  var start = {
    lat: 0,
    lng: 0
  };
  
  if (navigator.geolocation) {
    
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
          }
        });
      }, function() {
            alert('Directions to pickup point not available');
          });
  } 
  else {
    alert("Directions to pickup point not available")
  }
  
  
}


function calculateAndDisplayRoute(request) {
  
  var directionsDisplay = new google.maps.DirectionsRenderer;
  directionsDisplay.setMap(map);
  var waypts = [];
  var startPoint;
  var endPoint;
  //var jsonData = JSON.parse(request);
  for (var i = 0; i < request.length; i++) {
    var counter = request[i];
    if (i === 0) {
      startPoint = new google.maps.LatLng(counter.lat, counter.lng);
      continue;
    }
    if (i === request.length - 1) {
      endPoint = new google.maps.LatLng(counter.lat, counter.lng);
      continue;
    }
    waypts.push({
      location: new google.maps.LatLng(counter.lat, counter.lng),
      stopover: false
    });
  }
  if (startPoint != null && endPoint != null) {
    directionsService.route({
    origin: startPoint,
    destination: endPoint,
    waypoints: waypts,
    optimizeWaypoints: true,
    travelMode: 'BICYCLING'}, 
    function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }
}