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
	// Dummy testing code
	var cartRouteInfo = [{ 
		startPoint : "hrbb",
		endPoint : "cyclo",
		waypoints : [ 
			{
				lat: 30.6189722,
				lng: -96.33876780000003
			}, 
			{
				lat: 30.620338,
				lng: -96.341335
			}
		],
		cartID : mock_id
	},{ 
		startPoint : "zachry",
		endPoint : "hrbb",
		waypoints : [ 
			{
				lat: 30.621086,
				lng: -96.340388
			}, 
			{ 
				lat: 30.6189722,
				lng: -96.33876780000003
			}],
			
		cartID : mock_id
	}];
	if( mock_id == 1 ){
		cartRouteInfo.push({ startPoint: "etb", endPoint: "msc", waypoints: [
			{
				lat: 30.622837,
				lng: -96.339397
			},
			{
				lat: 30.61228199999999,
				lng: -96.34137599999997
			}], 
			cartID: mock_id});
	}
	if( mock_id == 0 ){
		cartRouteInfo.pop();
	}
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
		routesData = routesData.concat( rosGetInfo(url_ip, ip) );
	}
	return routesData;
}