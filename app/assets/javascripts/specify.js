function formCheck( cartIPs, form_id) {
    console.log( form_id );
    if (document.getElementById("seat_count").value == '') {
		alert("Please select seat count");
	} else {
	    // Query each cart for their available routes
	    var routeData = getRoutes( cartIPs );
	    
	    // Add routeData into the form hidden field with jQuery
	    $('#routeData').val( JSON.stringify(routeData) );
	    
	    // Submit the form
        document.getElementById(form_id).submit();
	}
}

// Take in a url like "ws://192.168.1.1:9090"
// and get route data from that url with ROS channel "routes_info"
// Returns [ {startPoint, endPoint, [waypoints], cartId} ]
function rosGetInfo( url_ip, mock_id ){
// <<<<<<< HEAD
// 	// Dummy testing code
// 	var cartRouteInfo = [{ 
// 		startPoint : "hrbb",
// 		endPoint : "cyclo",
// 		waypoints : [ 
// 			{
// 				lat: 30.6189722,
// 				lng: -96.33876780000003
// 			}, 
// 			{
// 				lat: 30.620338,
// 				lng: -96.341335
// 			}
// 		],
// 		cartID : mock_id
// 	},{ 
// 		startPoint : "zachry",
// 		endPoint : "hrbb",
// 		waypoints : [ 
// 			{
// 				lat: 30.621086,
// 				lng: -96.340388
// 			}, 
// 			{ 
// 				lat: 30.6189722,
// 				lng: -96.33876780000003
// 			}],
			
// 		cartID : mock_id
// 	}];
// 	if( mock_id == 1 ){
// 		cartRouteInfo.push({ startPoint: "etb", endPoint: "msc", waypoints: [
// 			{
// 				lat: 30.622837,
// 				lng: -96.339397
// 			},
// 			{
// 				lat: 30.61228199999999,
// 				lng: -96.34137599999997
// 			}], 
// 			cartID: mock_id});
// =======
	var cartRouteInfo;
	console.log( url_ip );
	return [
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
        
	// var ros = new ROSLIB.Ros({
	// 	url : url_ip
	// })
	// ros.on('connection', function(){
	// 	console.log("ROS is connected");
	// });
	// ros.on('error', function(error) {
	// 	console.log("Error connecting to ROS: ", error);
	// });
	// var routeInfoListener = new ROSLIB.Topic({
	// 	ros : ros,
	// 	name : '/routes_info',
	// 	messageType : 'std_msgs/String'
	// });
	// routeInfoListener.subscribe( function(message) {
	// 	cartRouteInfo = message
 //   publish_routes();
	// 	routeInfoListener.unsubscribe();
	// 	console.log("Got: " + cartRouteInfo);
	// });
	// return cartRouteInfo; 
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
// >>>>>>> 2f5b700c4957ccbb82ce03ee8e6d455e263bc049
	}
	// if( mock_id == 0 ){
	// 	cartRouteInfo.pop();
	// }
	// End testing code
	// Prospective ROS code 
	/* 
	var ros = new ROSLIB.Ros({
		url : url_ip
	})
	ros.on('connection', function(){
		console.log("ROS is connected");
	});
	ros.on('error', function(error) {
		console.log("Error connecting to ROS: ", error);
	});
	var routeInfoListener = new ROSLIB.Topic({
		ros : ros,
		name : '/routes_info',
		messageType : 'visualization_msgs/Marker'
	});
	routeInfoListener.subscribe( function(message) {
		cartRouteInfo = message
		routeInfoListener.unsubscribe();
		console.log("Got: " + cartRouteInfo);
	});
	*/
	return cartRouteInfo; 
}

function getRoutes( ipList ) {
	var routesData = new Array();
	
	// Query each cart in the provided ip list for their routes
	for( var ip in ipList ) {
		var url_ip = "ws://" + ipList[ip];
		console.log('calling getting data with ' + JSON.stringify(url_ip) + JSON.stringify(ip));
		routesData = routesData.concat( rosGetInfo(url_ip, ip) );
	}
	return routesData;
}