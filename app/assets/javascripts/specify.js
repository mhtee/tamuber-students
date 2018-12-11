// function formCheck( cartIPs, cartIDs, form_id) {
//     //console.log( form_id );
//     if (document.getElementById("seat_count").value == '') {
// 		alert("Please select seat count");
// 	} else {
// 	    // Query each cart for their available routes
// 	    var routeData = getRoutes( cartIPs, cartIDs );
	    
// 	    // Add routeData into the form hidden field with jQuery
// 	    $('#routeData').val( JSON.stringify(routeData) );
	    
// 	    // Submit the form
//         document.getElementById(form_id).submit();
// 	}
// }

function formCheck(form_id) {
    //console.log( form_id );
    if (document.getElementById("source").value == '' || 
    document.getElementById("destination").value == '') {
		alert("Please select both the pickup and dropoff locations ");
		return false;
	} else if (document.getElementById("source").value == 
	document.getElementById("destination").value) {
    	alert("Same pickup and dropoff selected. Please select again");
    	return false;
	} else {
	    // Submit the form
        document.getElementById(form_id).submit();
	}
}

// Take in a url like "ws://192.168.1.1:9090"
// and get route data from that url with ROS channel "routes_info"
// Returns [ {startPoint, endPoint, [waypoints], cartId} ]
function rosGetInfo( url_ip, mock_id ){
	var cartRouteInfo;
	var rosdata = publish_routes();
	for( var a in rosdata ){
		rosdata[a]["cartID"] = mock_id;
	}
	return rosdata;
        
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
		{
			startPoint : "Cyclotron", endPoint : "HRBB",
        	waypoints : [
                {lat : "30.620407", lng : "-96.341469"},
                {lat : "30.6191278" , lng : "-96.3392097"},
                {lat : "30.6190401" , lng : "-96.3393599"},
                {lat : "30.6191786" , lng : "-96.3394779"},
                {lat : "30.6193032" , lng : "-96.3396013"},
                {lat : "30.6194371" , lng : "-96.3397193"},
                {lat : "30.6195848" , lng : "-96.3398534"},
                {lat : "30.6197002" , lng : "-96.3399554"},
                {lat : "30.6198341" , lng : "-96.340068"},
                {lat : "30.6199772" , lng : "-96.3402129"},
                {lat : "30.620148" , lng : "-96.3403416"},
                {lat : "30.620281", lng : "-96.340456"},
                {lat : "30.6203942", lng : "-96.3405578"},
                {lat : "30.6205003", lng : "-96.3406409"},
                {lat : "30.6205765", lng : "-96.3407241"},
                {lat : "30.6206735", lng : "-96.3408019"},
                {lat : "30.6206342", lng : "-96.3408823"},
        	    {lat : "30.6192385", lng : "-96.33849499999999"}
            ]
        },
        {
        	startPoint : "HRBB", endPoint : "ETB",
        	waypoints : [
                {lat : "30.6192385", lng : "-96.33849499999999"},
        	    {lat : "30.620428", lng : "-96.337775"}, {lat : "30.622837", lng : "-96.33939699999999"}
            ]
        },
        {
        	startPoint : "HRBB", endPoint : "EIC",
        	waypoints : [
                {lat : "30.6192385", lng : "-96.33849499999999"},
        	    {lat : "30.61856569999999", lng : "-96.34146819999999"}
            ]
        },
        {
        	startPoint : "RDMC", endPoint : "SBISA",
        	waypoints : [
                {lat : "30.618236", lng : "-96.341011"},
        	    {lat : "30.616504", lng : "-96.342961"}, 
                {lat : "30.6172110", lng : "-96.3437860"}
            ]
        },
        {
        	startPoint : "EIC", endPoint : "SBISA",
        	waypoints : [
                {lat : "30.61856569999999", lng : "-96.34146819999999"},
        	    {lat : "30.616504", lng : "-96.342961"}, 
                {lat : "30.6172110", lng : "-96.3437860"}
            ]
        }
    ];
        
    //var num_of_routes = Math.floor(Math.random() * 4);
    var num_of_routes = 3;
        
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
	
	return routes_to_return;
	
	/*var ros = new ROSLIB.Ros({
		url : "ws://166.155.203.130:9090"   //this should not be hardcoded 
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
	
	routesTopic.publish(msg);*/
}

function getRoutes( ipList, idList ) {
	var routesData = new Array();
	
	// Query each cart in the provided ip list for their routes
	for( var idx in ipList ) {
		var url_ip = "ws://" + ipList[idx].IP;
		routesData = routesData.concat( rosGetInfo(url_ip, idList[idx].id) );
	}
	return routesData;
}
