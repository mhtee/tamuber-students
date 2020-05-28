var map = null;
var markerLive;
var route;
var stepSize = 0;
var ACCESS_TOKEN = 'pk.eyJ1IjoiZ3Vsc2hhbmsiLCJhIjoiY2pvM3d1NGV3MTFydzN3cWlkZ2xjdmE1MSJ9.zQ1AATk2EOGJ4XMDyBV9vA';
var booked = false;
var started = false;
var ended = false;
var vehicleId = "";

function initMap() {
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

// function initMapMarkerCart3(start,end, startName, startAddress, endName, endAddress){
//     console.log("Start is:"+start);
//     console.log("End is:"+end);
//     var getNearestVehicleUrl = 'https://tamuber-mock-server.herokuapp.com/api/vehicles/nearest?lattitude='+ start[1]+'&longitude='+start[0];
//     $.ajax({
//         method: 'GET',
//         url: getNearestVehicleUrl,
//         error: function() {
//             console.log('No vehicles nearby...');
//             document.getElementById("ETA").innerHTML = "All vehicles busy. Reload!";
//             document.getElementById("ETT").innerHTML = "All vehicles busy. Reload!";
//             document.getElementById('bookB').style.display = 'block';
//             // document.getElementById('go_bak_btn').style.display = 'block';
//             // document.getElementById('go_bak_btn').style.visibility = 'hidden'
//             document.getElementById('bookB').disabled = true; 
//         }
//     }).done(function(nearestVehicle) {
//         if(nearestVehicle == null){
//             return;
//         }
//         var nearLong = nearestVehicle.currentLocation.longitude;
//         var nearLat = nearestVehicle.currentLocation.lattitude;
//         var nearLoc = [nearLong,nearLat];
//         var nearId = nearestVehicle.id;
//         vehicleId = nearId;
//         initMapMarkerCart(start,end,nearLoc,nearId, startName, startAddress, endName, endAddress)
//         // var fetchLiveUrl = 'https://api.myjson.com/bins/o0td6';
//         // // 'https://jsonbin.io/5c03821b1deea01014bbb72f';
//         // //'http://tamuber-mock-server.herokuapp.com/api/vehicles/'+vehicleId;
//         /*var fetchLiveUrl = 'https://raw.githubusercontent.com/rohan54/tamuber-students/master/myjson.json';
//         $.getJSON(fetchLiveUrl, function(vehicle){
//             // vehicle = JSON.parse(vehicle);
//             console.log("vehicle");
//             console.log(vehicle);
//             var liveLong = vehicle.currentLocation.longitude;
//             var liveLat = vehicle.currentLocation.lattitude;
//             var liveLoc = [liveLong,liveLat];
//             var liveId = vehicle.id;
//             initMapMarkerCart(start,end,liveLoc,nearId)
//         }).always(function(){
//         });*/
//     });
// }

function initMapMarkerCart3(src, dest){
    // console.log("Start is:"+start);
    // console.log("End is:"+end);
    var srcname = src.name
    var srclat = src.latitude
    var srclong = src.longitude
    var srcaddr = src.address
    var srccoord = [srclong, srclat]
    
    var destname = dest.name
    var destlat = dest.latitude
    var destlong = dest.longitude
    var destaddr = dest.address
    var destcoord = [destlong, destlat]
    
    var getNearestVehicleUrl = 'https://tamuber-mock-server.herokuapp.com/api/vehicles/nearest?lattitude='+ srclat+'&longitude='+srclong;
    $.ajax({
        method: 'GET',
        url: getNearestVehicleUrl,
        error: function() {
            console.log('No vehicles nearby...');
            document.getElementById("ETA").innerHTML = "All vehicles busy. Reload!";
            document.getElementById("ETT").innerHTML = "All vehicles busy. Reload!";
            document.getElementById('bookB').style.display = 'block';
            // document.getElementById('go_bak_btn').style.display = 'block';
            // document.getElementById('go_bak_btn').style.visibility = 'hidden'
            document.getElementById('bookB').disabled = true; 
        }
    }).done(function(nearestVehicle) {
        if(nearestVehicle == null){
            return;
        }
        var nearLong = nearestVehicle.currentLocation.longitude;
        var nearLat = nearestVehicle.currentLocation.lattitude;
        var nearLoc = [nearLong,nearLat];
        var nearId = nearestVehicle.id;
        vehicleId = nearId;
        initMapMarkerCart(srccoord, destcoord, nearLoc, nearId,
                          srcname, srcaddr, destname, destaddr)
        // var fetchLiveUrl = 'https://api.myjson.com/bins/o0td6';
        // // 'https://jsonbin.io/5c03821b1deea01014bbb72f';
        // //'http://tamuber-mock-server.herokuapp.com/api/vehicles/'+vehicleId;
        /*var fetchLiveUrl = 'https://raw.githubusercontent.com/rohan54/tamuber-students/master/myjson.json';
        $.getJSON(fetchLiveUrl, function(vehicle){
            // vehicle = JSON.parse(vehicle);
            console.log("vehicle");
            console.log(vehicle);
            var liveLong = vehicle.currentLocation.longitude;
            var liveLat = vehicle.currentLocation.lattitude;
            var liveLoc = [liveLong,liveLat];
            var liveId = vehicle.id;
            initMapMarkerCart(start,end,liveLoc,nearId)
        }).always(function(){
        });*/
    });
}



function initMapMarkerCart2(start,end,vehicleId){
    // var fetchLiveUrl = 'https://api.myjson.com/bins/o0td6';
    // // 'https://jsonbin.io/5c03821b1deea01014bbb72f';
    // //'http://tamuber-mock-server.herokuapp.com/api/vehicles/'+vehicleId;
    var fetchLiveUrl = 'https://raw.githubusercontent.com/rohan54/tamuber-students/master/myjson.json';
    var getNearestVehicleUrl = 'https://tamuber-mock-server.herokuapp.com/api/vehicles/nearest?lattitude='+ start[1]+'&longitude='+start[0];
    $.ajax({
        method: 'GET',
        url: getNearestVehicleUrl
    }).success(function(vehicle){
    // $.getJSON(fetchLiveUrl, function(vehicle) {
        console.log("vehicle");
        console.log(vehicle);
        var liveLong = vehicle.currentLocation.longitude;
        var liveLat = vehicle.currentLocation.lattitude;
        var liveLoc = [liveLong,liveLat];
        var liveId = vehicle.id;
        initMapMarkerCart(start,end,liveLoc,liveId)
    }).error(function(){
        console.log('No vehicles nearby...');
    }).
    always(function(){});
}

function initMapMarkerCart(start, end, liveLocation, liveVehicleId, startName, startAddress, endName, endAddress) {

    console.log("in initMapwithMarker");
    var mapEl = $('#map');
    var optimized = mapEl.data('test-env');
    mapboxgl.accessToken = ACCESS_TOKEN
    map = new mapboxgl.Map({
        container: 'mapid1', // HTML container id
        style: 'mapbox://styles/mapbox/streets-v9', // style URL
        center: findMidPoint(start,end),
        zoom: 14
    });

    console.log("travel time invoked from outside");
    document.getElementById('CARD').innerHTML = liveVehicleId;

    map.on('load', function() {
        getRoute(start,end,liveLocation, startName, startAddress, endName, endAddress);
    });

    function getRoute(start,end,liveLocation, startName, startAddress, endName, endAddress) {
        console.log("route enter");
        var directionsRequest = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?geometries=geojson&access_token=' + mapboxgl.accessToken;
        console.log(directionsRequest)
        $.ajax({
            method: 'GET',
            url: directionsRequest,
        }).done(function(data) {
            route = data.routes[0].geometry;
            updateETT(data);
            updateEstimatedTimes(liveLocation, start, 'ETA');

            if(route!=null && route.coordinates.length!=0){
                console.log("data " +route);
                console.log("data " + route.coordinates[0])
                console.log("fsdfsd"+route.coordinates.length);
                console.log("travel time invoked from outside");

                start = route.coordinates[0];
                end = route.coordinates[route.coordinates.length-1];
                if(markerLive!=null){
                    // markerLive.setLngLat(route.coordinates[1]);
                    markerLive.setLngLat(liveLocation);
                }
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
            addMarkers(start, end, liveLocation, startName, startAddress, endName, endAddress);

        }).always(function(){
        });
    }
    setInterval(function(){
        console.log("Hello");
        if(markerLive!= null /*&& stepSize<route.coordinates.length*/){
            // markerLive.setLngLat(route.coordinates[stepSize++]);
            var fetchLiveUrl = 'https://tamuber-mock-server.herokuapp.com/api/vehicles/'+liveVehicleId;
            // var fetchLiveUrl = //'https://raw.githubusercontent.com/rohan54/tamuber-students/master/myjson.json';
            // console.log("--------Iteration "+stepSize+" Coordinates:"+route.coordinates);
            $.ajax({
                method: 'GET',
                url: fetchLiveUrl,
                error: function () {
                    console.log("Couldn't receive Live coordinates for vehicle:"+liveVehicleId);
                }
            }).success(function(vehicle) {
            // $.getJSON(fetchLiveUrl, function(vehicle) {
                if(ended !=true){
                    var liveLong = vehicle.currentLocation.longitude;
                    var liveLat = vehicle.currentLocation.lattitude;
                    var liveLoc = [liveLong,liveLat];
                    console.log("Coordinates inside:"+liveLoc);
                    markerLive.setLngLat(liveLoc);
                    /*if(liveLoc[0] == start[0] && liveLoc[1] == start[1]){
                        started = true;
                    }*/
                    if(!started){
                        updateEstimatedTimes(liveLoc, start, 'ETA');
                        /*getDistanceDuration(start,liveLoc,function(dist, time, id) {
                            if(dist<=0.01){
                                started = true;
                                document.getElementById("ETA").innerHTML = "Arrived!";
                            }
                        },null);*/
                        if(document.getElementById("ETA").innerHTML == "0.00 minutes"){
                            started = true;
                            document.getElementById("ETA").innerHTML = "Arrived!";
                        }
                    }
                    else if(booked && !ended) {
                        updateEstimatedTimes(liveLoc, end, 'ETT');
                        if(document.getElementById("ETT").innerHTML == "0.00 minutes"){
                            ended = true;
                            started = false;
                            booked = false;
                            document.getElementById("ETT").innerHTML = "Arrived!";
                        }
                    }
                } else{
                    document.getElementById("ETA").innerHTML = "Trip Completed!";
                    document.getElementById("ETT").innerHTML = "Trip Completed!";
                    if(vehicle.isAvailable == false){
                        var releaseUrl = 'https://tamuber-mock-server.herokuapp.com/api/vehicles/'+liveVehicleId+'/release';
                        $.ajax({
                            method: 'POST',
                            url: releaseUrl,
                            error: function () {
                                console.log("Couldn't release vehicle:"+liveVehicleId);
                            }
                        }).success(function() {
                            console.log("Released vehicle:"+liveVehicleId);
                            console.log("Defaults ended:"+ended+" started:"+started+" booked:"+booked);
                        });
                    } else{
                        console.log("Already released vehicle:"+liveVehicleId);
                        console.log("Defaults ended:"+ended+" started:"+started+" booked:"+booked);
                    }
                }
            });
            console.log("Change");
        }
    }, 3000);
    console.log("Hi!!!");
}

function updateTripTimeById(dist,time,id) {
    console.log(id+"distance is " + dist);
    console.log(id+"duration is " + time);
    document.getElementById(id).innerHTML = time + " minutes";
}

function updateEstimatedTimes(liveLocation, start, labelId) {
    if(liveLocation!=null && start!=null){
        getDistanceDuration(liveLocation, start,updateTripTimeById, labelId);
    } else{
        console.log(labelId + " cant be updated");
        console.log("liveLoc :"+liveLocation);
        console.log("start :"+start);
    }
}

function getDistanceDuration(start, end, updateFunction, labelId){
    var e = start[0] +","+start[1] +";" + end[0] + "," + end[1];
    mapboxgl.accessToken = ACCESS_TOKEN
    var url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + e +'?geometries=geojson&steps=true&&access_token=' + mapboxgl.accessToken;
    console.log("eta url:"+url);
    $.getJSON(url, function(jsonResponse) {
        var distance = (jsonResponse.routes[0].distance*0.001*0.621371).toFixed(2); // convert to km
        var duration = (jsonResponse.routes[0].duration/60).toFixed(2); // convert to minutes
        if(updateFunction!=null){
            updateFunction(distance, duration, labelId);
        }
    });
}

function updateETT(data) {
    if(data!=null) {
        var dist = (data.routes[0].distance * 0.001 * 0.621371).toFixed(2);//km to miles
        var time = (data.routes[0].duration / 60).toFixed(2);
        updateTripTimeById(dist, time, 'ETT');
    } else{
        console.log("ETT cant be updated. data is null");
    }
}

function addMarkers(start, end, liveLocation, startName, startAddress, endName, endAddress) {
    var message = null;
    if (start != null) {
        var strtMessage = "Start:" + startName;
        var strtAddress = startAddress;
        // var strtMessage = "Start:" + "HRBB"
        // var strtAddress = "Harvey R. \"Bum\" Bright Building, College Station, TX 77840..";
    }
    if (end != null) {
        var endMessage = "End:" + endName;
        var endAddress = endAddress;
        // var endMessage = "End:" + "ZACH"
        // var endAddress = "Zachry Engineering Education Complex, College Station, TX 77840..";
    }
    var contentStartString = '<h5>' + strtMessage + "</h5>"
    contentStartString = contentStartString + "<p>Details : " + strtAddress + "</p>"
    var contenEndString = '<h5>' + endMessage + "</h5>"
    contenEndString = contenEndString + "<p>Details : " + strtAddress + "</p>"

    var popStart = new mapboxgl.Popup().setHTML(contentStartString);
    var popEnd = new mapboxgl.Popup().setHTML(contenEndString);

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

    var startDiv = document.createElement('div');
    startDiv.className = 'markerStart';
    var endDiv = document.createElement('div');
    endDiv.className = 'markerEnd';
    var liveDiv = document.createElement('div');
    liveDiv.className = 'markerLive';

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
}

function calcRoute(lat, lng) {
}


function calculateAndDisplayRoute(request, startPointName, endPointName, routeId) {
}

function getMatch(e) {
    console.log("match route invoked");
    mapboxgl.accessToken = ACCESS_TOKEN
    var directionsRequest = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + e +'?geometries=geojson&steps=true&&access_token=' + mapboxgl.accessToken;

    $.ajax({
        method: 'GET',
        url: directionsRequest,
    }).done(function(data) {
        var geo = data.routes[0].geometry;
        var distancebtw = data.routes[0].distance*0.001;
        var durationbtw = data.routes[0].duration*60;

        console.log("distance is " + distancebtw);
        console.log("duration is " + durationbtw);

        if(geo!=null && geo.coordinates.length!=0){
            start = geo.coordinates[0];
            end = geo.coordinates[geo.coordinates.length-1];
            setTimeout(getMatch(e), 10000);

        }
    })
}

function abc(){
    console.log("hello hello");
}

function book(){
    $("#bookB").text("Booked");
    document.getElementById('bookB').style.display = 'block';
    // document.getElementById('go_bak_btn').style.display = 'block';
    // document.getElementById('go_bak_btn').style.visibility = 'hidden'
    document.getElementById('bookB').disabled = true; 
    var getNearestVehicleUrl = 'https://tamuber-mock-server.herokuapp.com/api/vehicles/'+vehicleId+'/book';
    $.ajax({
        method: 'POST',
        url: getNearestVehicleUrl,
        error: function() {
            console.log('Unable to book vehicle...');
        }
    }).done(function(nearestVehicle) {
        booked = true;
    });
}