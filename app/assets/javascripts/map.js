function initMap() {
  // Initialize Direction Services  
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;

  // Create a map.
  var map = new google.maps.Map(document.getElementById('mapid'), {
    zoom: 15,
    center: {lat: 30.6185, lng: -96.3365},
    mapTypeControl: false
  });
  directionsDisplay.setMap(map);

  // Add some markers to the map.
  map.data.setStyle(function(feature) {
    return {
      title: feature.getProperty('name'),
      optimized: false
    };
  });
    
  var waypts = [];
  waypts.push({
    location: new google.maps.LatLng(30.620071,-96.340747),
    stopover: false
  });

  waypts.push({
    location: new google.maps.LatLng(30.61998,-96.340193),
    stopover: false
  });

  directionsService.route({
    origin: new google.maps.LatLng(30.621284, -96.340388),
    destination: new google.maps.LatLng(30.6189722, -96.3387678),
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
// function calculateAndDisplayRoute(directionsService, directionsDisplay) {
// }
