var directionsService;
var map = null;
var draw = null;
var infowindow;
var markerLive;
var route;
var stepSize = 0;
// var marker;
// var stmarker;
var showDirections = true;
var ACCESS_TOKEN = 'pk.eyJ1IjoiZ3Vsc2hhbmsiLCJhIjoiY2pvM3d1NGV3MTFydzN3cWlkZ2xjdmE1MSJ9.zQ1AATk2EOGJ4XMDyBV9vA';

function initMap() {
  
  // mapboxgl.accessToken = 'pk.eyJ1IjoiZ3Vsc2hhbmsiLCJhIjoiY2pvM3d1NGV3MTFydzN3cWlkZ2xjdmE1MSJ9.zQ1AATk2EOGJ4XMDyBV9vA';
  mapboxgl.accessToken = ACCESS_TOKEN
   var map = new mapboxgl.Map({
     container: 'mapid1', // HTML container id
     style: 'mapbox://styles/mapbox/streets-v9', // style URL
     center: [-96.3365,30.6185], // starting position as [lng, lat]
     zoom: 15
   });
   
}


function findMidPoint(start,end) {
  var lat1= start[1];
  var lon1= start[0];
  var lat2 = end[1];
  var lon2 = end[0];
  var dLon = (function (x) { return x * Math.PI / 180; })(lon2 - lon1);
  lat1 = (function (x) { return x * Math.PI / 180; })(lat1);
  lat2 = (function (x) { return x * Math.PI / 180; })(lat2);
  lon1 = (function (x) { return x * Math.PI / 180; })(lon1);
  var Bx = Math.cos(lat2) * Math.cos(dLon);
  var By = Math.cos(lat2) * Math.sin(dLon);
  var lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By * By));
  var lon3 = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);
  lat3 = lat3 * 180 / Math.PI;
  lon3 = lon3 * 180 / Math.PI;
  console.log("My lat long are:", lat3, lon3);
  return [lon3,lat3];
}


function initMapWithMarker(start, end, liveLocation) {
  
      console.log("in initMapwithMarker");
      var mapEl = $('#map');
      var optimized = mapEl.data('test-env'); //so that marker elements show up for testing
      // var myLatLng = {lat: lat, lng: lng};
     
      // mapboxgl.accessToken = 'pk.eyJ1IjoiZ3Vsc2hhbmsiLCJhIjoiY2pvM3d1NGV3MTFydzN3cWlkZ2xjdmE1MSJ9.zQ1AATk2EOGJ4XMDyBV9vA';
      mapboxgl.accessToken = ACCESS_TOKEN
      map = new mapboxgl.Map({
        container: 'mapid1', // HTML container id
        style: 'mapbox://styles/mapbox/streets-v9', // style URL
        center: findMidPoint(start,end),//[-96.3365,30.6185],
        //center: //[lat,lng], // starting position as [lng, lat]
        zoom: 14
      });
      
      //var start = [-96.340379, 30.620167]
      //var end = [-96.323706,30.609521]
      
      //var start = [-96.3409565,30.6189768];//start;
      //var end = [ -96.3425741,30.6213251];//end;
      console.log("travel time invoked from outside");
      // getTravelTime(start[1], start[0], end[1], end[0]);
      
      map.on('load', function() {
        getRoute(start,end);
      });

      function getRoute(start,end) {
        console.log("route enter");
        var directionsRequest = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?geometries=geojson&access_token=' + mapboxgl.accessToken;
        console.log(directionsRequest)
        $.ajax({
          method: 'GET',
          url: directionsRequest,
        }).done(function(data) {
            route = data.routes[0].geometry;
            var distancebtw = data.routes[0].distance*0.001*0.621371;//km to miles
            var durationbtw = data.routes[0].duration*60;
            var distDur = getDistanceDuration(start,end)
            console.log("distance is " + distancebtw);
            console.log("duration is " + durationbtw);
            if(distDur!=null){
              console.log("Live distance is " + distDur[0]);
              console.log("Live duration is " + distDur[1]);
            }
            document.getElementById('ETA').innerHTML = distancebtw;
            document.getElementById('ETT').innerHTML = durationbtw;
            
            if(route!=null && route.coordinates.length!=0){
            console.log("data " +route);
            console.log("data " + route.coordinates[0])
            console.log("fsdfsd"+route.coordinates.length);
            console.log("travel time invoked from outside");
            
            start = route.coordinates[0];
            if(markerLive!=null){
              markerLive.setLngLat(route.coordinates[1]);
            }
            end = route.coordinates[route.coordinates.length-1];
            console.log(route);
          }
          map.addLayer({
            id: 'route',
            type: 'line',
            source: {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: route
              }
            },
            paint: {
              'line-width': 2
            }
          });
          // this is where the code from the next step will go
          var message = null;
          if(start!=null){
            strtMessage = "Start:"+"HRBB"
            strtAddress = "Harvey R. \"Bum\" Bright Building, College Station, TX 77840..";
          }
          if(end!=null){
            endMessage = "End:"+"ZACH"
            endAddress = "Zachry Engineering Education Complex, College Station, TX 77840..";
          }
          var contentStartString = '<h5>'+strtMessage+"</h5>"
          contentStartString = contentStartString + "<p>Details : "+strtAddress+"</p>"
          var contenEndString = '<h5>'+endMessage+"</h5>"
          contenEndString = contenEndString + "<p>Details : "+strtAddress+"</p>"
          
          var popStart = new mapboxgl.Popup().setHTML(contentStartString);
          var popEnd = new mapboxgl.Popup().setHTML(contenEndString);
          
          // var myNewIcon = map.icon({
          //     iconUrl: '../../stylesheets/images/mapbox-icon.png'
          // });  
          
          var geojson = {
              "type": "FeatureCollection",
              "features": [
                  {
                      "type": "Feature",
                      "properties": {
                          "iconSize": [15, 15]
                      }
                  }
              ]
          };
          // var geojson = {
          //       "type": "circle",
          //       "features": [
          //           {
          //               "type": "Feature",
          //               "properties": {
          //                   width: 30px,
          //                   height: 22px,
          //                   icon: {
          //                     iconUrl: '/images/cart2.png',
          //                     iconSize: [30, 22], // size of the icon
          //                     iconAnchor: [15, 15], // point of the icon which will correspond to marker's location
          //                     className: 'dot'  
          //                   }
          //               }
          //           }
          //       ]
          //   };
          // var marker2 = geojson.features[0];
          // var e1 = document.createElement('div');
          // e1.className = 'marker';
          // e1.style.backgroundImage = 'images/mapbox-icon.png';
          // e1.style.width = marker.properties.iconSize[0] + 'px';
          // e1.style.height = marker.properties.iconSize[1] + 'px';
      
          // // e1.addEventListener('click', function() {
          // //     window.alert(marker.properties.message);
          // // });
          
          var startDiv = document.createElement('div');
          startDiv.className = 'markerStart';
          var endDiv = document.createElement('div');
          endDiv.className = 'markerEnd';
          var liveDiv = document.createElement('div');
          liveDiv.className = 'markerLive';
      
          
          
          // var e3 = document.createElement('div');
          // e3.className = 'marker';
          // e3.style.backgroundImage = 'images/cart.png';
          // e3.style.width = marker.properties.iconSize[0] + 'px';
          // e3.style.height = marker.properties.iconSize[1] + 'px';
          
          var markerStart = new mapboxgl.Marker(startDiv)
                .setLngLat(start)
                .setPopup(popStart)
                .addTo(map);
          var markerEnd = new mapboxgl.Marker(endDiv)
                .setLngLat(end)
                .setPopup(popEnd)
                .addTo(map);
          markerLive = new mapboxgl.Marker(liveDiv)
                .setLngLat(liveLocation)
                .addTo(map);
          
        }).always(function(){
                    // map.addLayer({
                    //   id: 'start',
                    //   type: 'circle',
                    //   source: {
                    //     type: 'geojson',
                    //     data: {
                    //       type: 'Feature',
                    //       geometry: {
                    //         type: 'Point',
                    //         coordinates: start
                    //       }
                    //     }
                    //   }
                      
                    // });
                    // map.setPaintProperty('start', 'fill-color', '#ff0000');
                    // map.addLayer({
                    //   id: 'end',
                    //   type: 'circle',
                    //   source: {
                    //     type: 'geojson',
                    //     data: {
                    //       type: 'Feature',
                    //       geometry: {
                    //         type: 'Point',
                    //         coordinates: end
                    //       }
                    //     }
                    //   }
                    // });
                    // map.setPaintProperty('end', 'fill-color', '#ff0000');
        });
      }
      setInterval(function(){
        console.log("Hello");
        if(markerLive!= null && stepSize<route.coordinates.length){
          console.log("Iteration "+stepSize);
          console.log("Coordinates:"+route.coordinates[stepSize])
          markerLive.setLngLat(route.coordinates[stepSize++]);
          console.log("Change");
        }
      }, 3000);
      console.log("Hi!!!");
}    

function removeDirections() {
  // directionsDisplay.setMap(null);
}
function calcRoute(lat, lng) {
  // if (showDirections == false) {
  //   showDirections = !showDirections;
  //   directionsDisplay.setMap(null);
  //   return;
  // }
  
 
  // var start = {
  //   lat: 0,
  //   lng: 0
  // };
  
  // if (navigator.geolocation) {
  //   directionsDisplay.setMap(map)
  //   navigator.geolocation.getCurrentPosition(function(position) {
  //     start = {
  //       lat: position.coords.latitude,
  //       lng: position.coords.longitude
  //       };
        
  //       var end = {
  //           lat: lat,
  //           lng: lng
  //       };

  //       var request = {
  //         origin: start,
  //         destination: end,
  //         travelMode: 'WALKING'
  //       };
  //       directionsService.route(request, function(result, status) {
  //         if (status == 'OK') {
  //           directionsDisplay.setDirections(result);
  //             stmarker = new google.maps.Marker({
  //             position: start,
  //             map: map,
  //             icon: '/if_Star_Gold_1398915.png',
  //             optimized: false
  //           });
  //           infowindow.close()
  //         }
  //       });
        
  //     }, function() {
  //           alert('Directions to pickup point not available');
  //         });
  // } 
  // else {
  //   alert("Directions to pickup point not available")
  // }
  // showDirections = !showDirections;
  
}


function calculateAndDisplayRoute(request, startPointName, endPointName, routeId) {
//   initMap();
//   selectRoute(startPointName + " to " + endPointName);
//   var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
//   directionsDisplay.setMap(map);
//   var startPoint;
//   var endPoint;

// 	var service_callback = function(response, status) {
// 		if (status === 'OK') {
// 			directionsDisplay.setDirections(response);
// 		} else {
// 			window.alert('Directions request failed due to ' + status);
// 		}
// 	}
  
//   //var jsonData = JSON.parse(request);
// 	for (var i = 0, parts = [], max = 22; i < request.length; i = i+max) {
// 		parts.push(request.slice(i, i + max + 1));
// 	}
	
// 	startPoint = new google.maps.LatLng(parseFloat(parts[0][0].lat), parseFloat(parts[0][0].lng));
	
//     var startMark = new google.maps.Marker({
//       position: startPoint,
//       map: map,
//       title: startPointName,
//       icon: '/if_Star_Gold_1398915.png'
//     });
    
//     var startInfo = new google.maps.InfoWindow({
//       content: '<h4>' + startPointName + '</h4>',
//       maxWidth: 250
//     });
//     startMark.addListener('mouseover', function() {
//       startInfo.open(map, startMark);
//     });
    
//     endPoint = new google.maps.LatLng(parseFloat(parts[0][parts[0].length-1].lat), parseFloat(parts[0][parts[0].length-1].lng))
    
//     //add marker at end point
//     var endMark = new google.maps.Marker({
//       position: endPoint,
//       map: map,
//       title: endPointName,
//     });
//     var endInfo = new google.maps.InfoWindow({
//       content: '<h4>' + endPointName + '</h4>',
//       maxWidth: 250
//     });
//     endMark.addListener('mouseover', function() {
//       endInfo.open(map, endMark);
//     });
    
//   for (var i = 0; i < parts.length; i++) {
// 		var waypts = [];
// 		for (var j = 0; j < parts[i].length - 1; j++) {
// 			waypts.push({
// 				location : new google.maps.LatLng(parseFloat(parts[i][j].lat), parseFloat(parts[i][j].lng)),
// 				stopover : false
// 			});
// 		}
// 		//alert(parts[i][parts[i].length-1].lat)
// 		var service_opts = {
// 			origin: new google.maps.LatLng(parseFloat(parts[i][0].lat), parseFloat(parts[i][0].lng)),
// 			destination: new google.maps.LatLng(parseFloat(parts[i][parts[i].length-1].lat), parseFloat(parts[i][parts[i].length-1].lng)),
// 			waypoints: waypts,
// 			optimizeWaypoints: true,
// 			travelMode: 'WALKING'
// 		};
// 		directionsService.route(service_opts, service_callback);
// 	}
//delete this comment
}

function selectRoute(route) {
	$('#selectedRoute').text(route);
}

// function getCartLiveLoc(){q
  
// }

// function getTravelTime(startGPSLat, startGPSLon,endGPSLat, endGPSLon){
//   console.log("travel time invoked")
//   startGPS = [startGPSLat,startGPSLon];
//   console.log("travel time invoked2")
//   endGPS = [endGPSLat,endGPSLon];
//   console.log("travel time invoked3")
//   listOfPoints = startGPS + ";" + endGPS;
//   pointList = new ArrayList<>();
//   console.log("travel time invoked4")
//   var directionsMatrixClient = MapboxMatrix.builder()
//     .accessToken('pk.eyJ1IjoiZ3Vsc2hhbmsiLCJhIjoiY2pvM3d1NGV3MTFydzN3cWlkZ2xjdmE1MSJ9.zQ1AATk2EOGJ4XMDyBV9vA')
//     .profile(DirectionsCriteria.PROFILE_DRIVING)
//     .coordinates(listOfPoints)
//     .build()
       
//     //console.log( "My travel times are:", directionsMatrixClient[0][0], directionsMatrixClient[0][1], directionsMatrixClient[1][0], directionsMatrixClient[1][1])
// }

// // function calculateDistance(strtLat, strtLong, endLat, endLong){
 
// // }


// function calculateEstimatedArrival(startGPSLat, startGPSLon){
//   // getTravelTime()
// }

// //Public API
// function plotMap( start_id, end_id){
  
// }
// function getClosestVehicleCartID(start_id){
  
// }
// function getVehicleGPS(cart_id){
  
// }


// Manvitha changes 


function mockCoordinates(){
  console.log("mock invoked");
  var Lat = [30.6211, 30.6102, 30.6123, 30.6213251, 30.609521];
  var Long = [-96.3404, -96.3410, -96.3413, -96.3425741, -96.323706];
  var i;
 
    for (i = 0; i < Lat.length-1; i++) {
      updateRoute([Long[i],Lat[i]], [Long[i+1],Lat[i+1]])
    } 

  
}


function updateRoute(source, destination) {
  console.log("invoked update route");
  removeRoute(); // overwrite any existing layers
  var data = draw.getAll();
  var answer = document.getElementById('calculated-line');
  /*
  var lastFeature = data.features.length - 1;
  var coords = data.features[lastFeature].geometry.coordinates;
  var newCoords = coords.join(';')
  console.log("newCoords are " + newCoords);*/
  var newCoords = source[0]+','+source[1]+';'+destination[0]+','+destination[1];
   console.log("newCoords are " + newCoords);
  //var newCoords = "-96.340379,30.620167;-96.323706,30.609521";
   
   setTimeout(getMatch, 10000, newCoords);
  //getMatch(newCoords);
}

function removeRoute () {
  console.log("invoked remove route");
  if (map.getSource('route')) {
    map.removeLayer('route');
    map.removeSource('route');
    document.getElementById('calculated-line').innerHTML = '';
    console.log("found route and deleted");
  } else  {
    console.log("no route found");
    return;
  }
  
}

function getDistanceDuration(start, end){
    var e = start[0] +","+start[1] +";" + end[0] + "," + end[1];
    mapboxgl.accessToken = ACCESS_TOKEN
    var url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + e +'?geometries=geojson&steps=true&&access_token=' + mapboxgl.accessToken;
    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', url, true);
    req.onload  = function() {
      var jsonResponse = req.response;
      var distance = jsonResponse.routes[0].distance*0.001*0.621371; // convert to km
      var duration = jsonResponse.routes[0].duration/60; // convert to minutes
      return [distance,duration];
    };
    var data = req.send();
    return data;
}



function getMatch(e) {
    // https://www.mapbox.com/api-documentation/#directions
    console.log("match route invoked");
    mapboxgl.accessToken = ACCESS_TOKEN
    var directionsRequest = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + e +'?geometries=geojson&steps=true&&access_token=' + mapboxgl.accessToken;
    
    $.ajax({
          method: 'GET',
          url: directionsRequest,
        }).done(function(data) {
            var geo = data.routes[0].geometry;
            //addRoute(geo);
            var distancebtw = data.routes[0].distance*0.001;
            var durationbtw = data.routes[0].duration*60;
            
            console.log("distance is " + distancebtw);
            console.log("duration is " + durationbtw);
            
            var route = geo;
            if(geo!=null && geo.coordinates.length!=0){
              start = geo.coordinates[0];
              end = geo.coordinates[geo.coordinates.length-1];
              // setTimeout(addRoute(geo), 10000);
              
                setTimeout(getMatch(e), 10000);
              
          }
        })
}
    
function abc(){
  console.log("hello hello");
}
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    /*
    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', url, true);
    console.log('received json data ' + req.response)
    
   
    req.onload  = function() {
      var jsonResponse = req.response;
      var distance = jsonResponse.routes[0].distance*0.001*0.621371; // convert to km
      var duration = jsonResponse.routes[0].duration/60; // convert to minutes
      console.log("distance is " + distance)
      console.log("duration is " + duration)
      // add results to info box
      document.getElementById('calculated-line').innerHTML = 'Distance: ' + distance.toFixed(2) + ' mi<br>Duration: ' + duration.toFixed(2) + ' minutes';
      var coords = jsonResponse.routes[0].geometry;
      // add the route to the map
      
      
      addRoute(coords);
    };
    
    req.send();
     setTimeout(function() {
        console.log("timeout");
      }, 10000);
    
}*/


function addRoute (coords) {
  // check if the route is already loaded
  
  console.log('route addition has been invoked ');
  
  if (map.getSource('route')) {
    console.log("In add route if part");
    map.removeLayer('route')
    map.removeSource('route')
  }
  /*else*/{
    map.addLayer({
      "id": "route",
      "type": "line",
      "source": {
        "type": "geojson",
        "data": {
          "type": "Feature",
          "properties": {},
          "geometry": coords
        }
      },
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      "paint": {
        "line-color": "#3b9ddd",
        "line-width": 8,
        "line-opacity": 0.8
      }
    });
    console.log("before markers " + coords[0] + ',' + coords[1]);
    var el = document.createElement('div');
      el.className = 'marker';
      
    var start = [-96.340379, 30.620167]
    var end = [-96.323706,30.609521]
    
    var message = null;
    if(start!=null){
      strtMessage = "Start:"+"HRBB"
      strtAddress = "Harvey R. \"Bum\" Bright Building, College Station, TX 77840..";
    }
    if(end!=null){
      endMessage = "End:"+"ZACH"
      endAddress = "Zachry Engineering Education Complex, College Station, TX 77840..";
    }
    var contentStartString = '<h5>'+strtMessage+"</h5>"
    contentStartString = contentStartString + "<p>Details : "+strtAddress+"</p>"
    var contenEndString = '<h5>'+endMessage+"</h5>"
    contenEndString = contenEndString + "<p>Details : "+strtAddress+"</p>"
    
    var popStart = new mapboxgl.Popup().setHTML(contentStartString);
    var popEnd = new mapboxgl.Popup().setHTML(contenEndString);
    
    // var markerStart = new mapboxgl.Marker()
    //       .setLngLat(start)
    //       .setPopup(popStart)
    //       .addTo(map);
          

    // var markerEnd = new mapboxgl.Marker()
    //       .setLngLat(end)
    //       .setPopup(popEnd)
    //       .addTo(map);
          
        
    
   /*
     var el = document.createElement('div');
      el.className = 'marker';
      
       var markerStart = new mapboxgl.Marker()
                .setLngLat([-96.340379, 30.620167])
                .setPopup(new mapboxgl.Popup({ offset: 25 }))
                .addTo(map);
    
    
    console.log("marker prop " + marker.geometry.coordinates)
    var mar = new mapboxgl.Marker()
  .setLngLat([-96.340379, 30.620167])
  .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
  .setHTML('<h3>hello</h3>')
  .addTo(map)*/
  
  }
}

function reload(){
  window.location.reload(true);
}






function newInitMapWithMarker() {
      
      console.log("in new initMapwithMarker");
      mapboxgl.accessToken = ACCESS_TOKEN
      map = new mapboxgl.Map({
        container: 'mapid1',
        style: 'mapbox://styles/mapbox/streets-v9', 
        center: [-96.3365,30.6185],
        zoom: 15,
        minZoom: 11
      });
      
      console.log("map is " + map);
      
      
      draw = new MapboxDraw({
          displayControlsDefault: false,
          controls: {
              line_string: true,
              trash: true
      },
      styles: [
        {
            "id": "gl-draw-line",
            "type": "line",
            "filter": ["all", ["==", "$type", "LineString"], ["!=", "mode", "static"]],
            "layout": {
              "line-cap": "round",
              "line-join": "round"
            },
            "paint": {
              "line-color": "#5184e1",
              "line-dasharray": [0.2, 2],
              "line-width": 4,
              "line-opacity": 0.7
            }
        },
        // vertex point halos
        {
          "id": "gl-draw-polygon-and-line-vertex-halo-active",
          "type": "circle",
          "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
          "paint": {
            "circle-radius": 10,
            "circle-color": "#FFF"
          }
        },
        // vertex points
        {
          "id": "gl-draw-polygon-and-line-vertex-active",
          "type": "circle",
          "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
          "paint": {
            "circle-radius": 6,
            "circle-color": "#3b9ddd",
          }
        },
      ]
});
console.log("problem arose after this");
map.addControl(draw);
console.log("control has been added");
//map.on('draw.create', updateRoute);
//map.on('draw.update', updateRoute);
//map.on('draw.delete', removeRoute);
    
}    

//Manvitha changes