function formCheck( cartIPs, cartIDs, form_id) {
    console.log( form_id );
    if (document.getElementById("seat_count").value == '') {
		alert("Please select seat count");
	} else {
	    // Query each cart for their available routes
	    var routeData = getRoutes( cartIPs, cartIDs );
	    
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
	var cartRouteInfo;
	console.log( url_ip );
	return [
		{
			startPoint : "Cyclotron", endPoint : "HRBB", cartID : mock_id,
        	waypoints : [{lat : "30.620407", lng : "-96.341469"},
        	{lat : "30.6192385", lng : "-96.33849499999999"}]},
        {
        	startPoint : "HRBB", endPoint : "ETB", cartID : mock_id,
        	waypoints : [{lat : "30.6192385", lng : "-96.33849499999999"},
        	{lat : "30.620428", lng : "-96.337775"}, {lat : "30.622837", lng : "-96.33939699999999"}]},
        {
        	startPoint : "HRBB", endPoint : "EIC", cartID : mock_id,
        	waypoints : [{lat : "30.6192385", lng : "-96.33849499999999"},
        	{lat : "30.61856569999999", lng : "-96.34146819999999"}]},
        {
        	startPoint : "RDMC", endPoint : "SBISA", cartID : mock_id,
        	waypoints : [{lat : "30.618236", lng : "-96.341011"},
        	{lat : "30.616504", lng : "-96.342961"}, {lat : "30.6172110", lng : "-96.3437860"}]},
        {
        	startPoint : "EIC", endPoint : "SBISA", cartID : mock_id,
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
		{startPoint : "Cyclotron", endPoint : "HRBB",
        waypoints : [{lat : "30.620407", lng : "-96.341469"},
        {lat : "30.6192385", lng : "-96.33849499999999"}]},
        {startPoint : "HRBB", endPoint : "ETB",
        waypoints : [{lat : "30.6192385", lng : "-96.33849499999999"},
        {lat : "30.620428", lng : "-96.337775"}, {lat : "30.622837", lng : "-96.33939699999999"}]},
        {startPoint : "HRBB", endPoint : "EIC",
        waypoints : [{lat : "30.6192385", lng : "-96.33849499999999"},
        {lat : "30.61856569999999", lng : "-96.34146819999999"}]},
        {startPoint : "RDMC", endPoint : "SBISA",
        waypoints : [{lat : "30.618236", lng : "-96.341011"},
        {lat : "30.616504", lng : "-96.342961"}, {lat : "30.6172110", lng : "-96.3437860"}]},
        {startPoint : "EIC", endPoint : "SBISA",
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
	}
	
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
	
	var routesTopic = new ROSLIB.Topic({
		ros: ros,
		name: '/routes_info', // use a sensible namespace
		messageType: 'std_msgs/String'
	});
	
	var msg = new ROSLIB.Message({
    	data: JSON.stringify(routes_to_return)
	});
	
	console.log("MSG: ", JSON.stringify(routes_to_return));
	
	routesTopic.publish(msg);
}

function getRoutes( ipList, idList ) {
	var routesData = new Array();
	
	// Query each cart in the provided ip list for their routes
	for( var ip in ipList ) {
		var url_ip = "ws://" + ipList[ip].IP;
		routesData = routesData.concat( rosGetInfo(url_ip, idList[ip].id) );
	}
	return routesData;
}

window.onload = function() {
	publish_routes();
}
