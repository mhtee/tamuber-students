function formCheck(form_id) {
 if (document.getElementById("trip_cart_route_id").value == '') {
		alert("Please select a route");
	} else {
		document.getElementById(form_id).submit();
	}
}
