function initMap() {
	var data = [];
	data.push([35.243580, -120.644466, 'Test']);
	data.push([35.243580, -120.644466, 'Test']);
	data.push([35.295534, 50.666385, '0'], [35.267005, -120.659328, 1], [35.280318, -120.662419, 2]);
	data.push([28.295534, 16.666385, 'Location'], [5.267005, 10.659328, 3], [28.280318, 12.662419, 4]);
	// data = [[lat, long, battery_id], lat, long, battery_id], lat, long, battery_id],...];
	
	// Makes an objects consiting of an info tag(battery id and directions),
	// latitude and longitude 
	var objects = [];
	data.forEach(function(battery){
		var object = {
		info: 'Battery ID: ' + battery[2] + '<br>\
		<a href="https://www.google.com/maps/dir/?api=1&destination=\
		'+ String(battery[0]) + ',' + String(battery[1]) +'">Get Directions</a>',
		lat: battery[0],
		long: battery[1]
		}
		objects.push(object);
	});

	// makes a list of location objects
	// fomatted: [[broadway.info, broadway.lat, broadway.long, 0],...] 
	var locations = [];
	objects.forEach(function(object){
		locations.push([object.info, object.lat, object.long]);
	});


	var corner_points = get_corners(locations);
	var center = get_center(corner_points[0], corner_points[1]);
	
	/*
	console.log(corner_points[0]);
	console.log(center);
	var distance = get_distance(center,corner_points[0]);
	console.log(distance);
	*/
	
	// Sets up a map object, with zoom, center and googlemaps default type
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 15,
		center: new google.maps.LatLng(center[0], center[1]),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	//create empty LatLngBounds object
	var bounds = new google.maps.LatLngBounds();
	var infowindow = new google.maps.InfoWindow();  	


	// Adds a marker at each specified location
	var marker, i;
	for (i = 0; i < locations.length; i++) {
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(locations[i][1], locations[i][2]),
			map: map
		});

		//extend the bounds to include each marker's position
		bounds.extend(marker.position);

		// Clicking the red location tag will bring up the information tag
		var infowindow = new google.maps.InfoWindow({});
		google.maps.event.addListener(marker, 'click', (function (marker, i) {
			return function () {
				infowindow.setContent(locations[i][0]);
				infowindow.open(map, marker);
			}
		})(marker, i));
	}
	//now fit the map to the newly inclusive bounds
	if (locations.length >1){
		map.fitBounds(bounds);
	}
}

// corners of a rectangle that encompass the entire
// set of locations. Corners used to calulate center
function get_corners(locations){
	min_lat = locations[0][1];
	max_lat = locations[0][1];
	min_long = locations[0][2];
	max_long = locations[0][2];
	locations.forEach(function(location){
		if (location[1] < min_lat){
			min_lat = location[1];
		}
		else if (location[1] > max_lat){
			max_lat = location[1];		 
		}
		if (location[2] < min_long){
			min_long = location[2];
		}
		else if (location[2] > max_long){
			max_long = location[2];		 
		}
	});
	top_left = [max_lat, min_long];
	bottom_right = [min_lat, max_long];
	return [top_left, bottom_right];
}

// Center point where map generates, center of all points
function get_center(top_left, bottom_right){
	center = [(top_left[0] + bottom_right[0])/2, (top_left[1] + bottom_right[1])/2];
	return center;
}

// distance formula for 2 points on Earth
function get_distance (point_A, point_B){
	var lat1 = point_A[0];
	var lat2 = point_B[0];
	var lon1 = point_A[1];
	var lon2 = point_B[1];
	var R = 6371e3; // metres
	var φ1 = lat1 * Math.PI / 180;
	var φ2 = lat2* Math.PI / 180;
	var Δφ = (lat2-lat1)* Math.PI / 180;
	var Δλ = (lon2-lon1)* Math.PI / 180;
	var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
			Math.cos(φ1) * Math.cos(φ2) *
			Math.sin(Δλ/2) * Math.sin(Δλ/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var distance = R * c;
	return distance;
}

