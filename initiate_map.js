/*
    Contains functions for setting up and 
    displaying google maps. Temporarily 
    contains test battery info
*/

// Temporary Data points: the end product will not have this--it is purley for test points
path0 = {id: 'path0', path: [{lat: 35.243580, lng: -120.644466, altitude: 16}]};
path1 = {id: 'path1', path:[{lat: 35.243580, lng: -120.644466, altitude: 0},{lat: 35.267042, lng: -120.659329, altitude: 100},{lat: 35.271198, lng: -120.665946, altitude: 300}]};
path2 = {id: 'path2', path:[{lat: 35.269890, lng: -120.670245, altitude: 10}, {lat: 35.269846, lng: -120.670038, altitude: 20}, {lat: 35.269526, lng: -120.670054, altitude: 10}, {lat: 35.269474, lng: -120.657663, altitude: 30}, {lat: 35.269719, lng: -120.656516, altitude: 45}, {lat: 35.274293, lng: -120.660349, altitude: 0}]};
path3 = {id: 'path3', path:[{lat: 35.295534, lng: 50.666385, altitude: 0},{lat: 35.267005, lng: -120.659328, altitude: 0},{lat: 35.280318, lng: -120.662419, altitude: 0}]};
path4 = {id: 'path4', path:[{lat: 37.772, lng: -122.214, altitude: 10},{lat: 21.291, lng: -157.821, altitude: 30},{lat: -18.142, lng: 178.431, altitude: 20},{lat: -27.467, lng: 153.027, altitude: 20}]};
paths = [path0, path1, path2, path3, path4];
paths1 = [path3, path4,path0];
paths2 = [path4];

battery0 = {id: 'battery0', paths: paths1, life: 100};
battery1 = {id: 'battery1', paths: paths1, life: 10};
battery2 = {id: 'battery2', paths: paths2, life: 1};
batteries = [battery0, battery1, battery2];




// Initiates the map, centered between the batteries' locations and zoomed to fit all markers
function init_map_locations(batteries) {
	var locations = get_locations(batteries);
    if(locations.length > 0){
        var corner_points = get_corners(locations);
        var center = get_center(corner_points[0], corner_points[1]);
    }
    else{
		var center = [0.00000, 0.00000];
	}
    generate_location_map(center, locations, batteries);
}


// Generates a map with the locations of each battery
function generate_location_map(center, locations, batteries){
	if (locations.length > 1) {
		map_id = 'all';
	}
	else{
		map_id = batteries[0].id;
	}
    // Generates the map
    var map = new google.maps.Map(document.getElementById('map_' + map_id), {
		zoom: 13,
		center: new google.maps.LatLng(center[0], center[1]),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});	
    
	var bounds = get_markers(map, locations, batteries);
	// Now fit the map to the newly inclusive bounds
	if (locations.length > 1){
		map.fitBounds(bounds);
    }
}


// Adds a marker at each specified location (used for location maps, can alter to work for paths)
function get_markers(map, locations){
	var marker, i, infowindow;
	var bounds = new google.maps.LatLngBounds();

    for (i = 0; i < locations.length; i++) {
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
			map: map
		});

		// Extend the bounds to include each marker's position
		bounds.extend(marker.position);
		
		// Clicking the red location tag will bring up the information tag
		infowindow = new google.maps.InfoWindow({});
		google.maps.event.addListener(marker, 'click', (function (marker, i) {
			return function () {
				infowindow.setContent(locations[i].id);
				infowindow.open(map, marker);
			}
		})(marker, i));
	}
	return bounds;
}


// Creates a map for each collapsible menu
function show_mini_maps(batteries){
	batteries.forEach(function (battery){
		init_map_locations([battery]);
	});
}


// Initiates the map, centered around the path of a single battery, zoomed to fit the path
function init_map_path(path, battery) {
    if(path.length > 0){
        var corner_points = get_corners(path);
        var center = get_center(corner_points[0], corner_points[1]);
    }
    else{
        var center = [0.00000, 0.00000];
	}
    generate_path_map(center, path, battery);
}


// Generates a map with a path traveled by a battery
// Need to fix no point zoom (decide what to do when no batteries are given)
function generate_path_map(center, path, battery){
	// Generates the map
	if (battery){
		id = battery.id;
	}
	else{
		id = 'all';
	}
	
	var map = new google.maps.Map(document.getElementById('map_' + id), {
		zoom: 13,
		center: new google.maps.LatLng(center[0], center[1]),
		mapTypeId: google.maps.MapTypeId.ROADMAP
    });	
    
	// Adds a marker at end points, create a path between each data point
	
    if(path.length > 0 && id != 'all'){
		var marker, i;
		var bounds = new google.maps.LatLngBounds();
		var infowindow = new google.maps.InfoWindow({});
		for (i = 0; i < path.length; i++) {
			if(i == 0 || i == path.length - 1){
				marker = new google.maps.Marker({
					position: new google.maps.LatLng(path[i].lat, path[i].lng),
					map: map
				});
				infowindow = new google.maps.InfoWindow({});
				google.maps.event.addListener(marker, 'click', (function (marker, i) {
					return function () {
						infowindow.setContent('EXAMPLE: Add start/end time');
						infowindow.open(map, marker);
					}
				})(marker, i));
			}
			else{
				marker = new google.maps.Marker({
					position: new google.maps.LatLng(path[i].lat, path[i].lng),
				});	
			}
			
            // Extend the bounds to include each marker's position
			bounds.extend(marker.position);


        }        
        // Now fit the map to the newly inclusive bounds
		if(path.length > 1){
			map.fitBounds(bounds);
		}
	}
	//paths.forEach(function(path){
    var path_characteristics = new google.maps.Polyline({
        path: path,
        geodesic: false,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      path_characteristics.setMap(map);
	//});
}


// Corners of a rectangle that encompass the entire
// set of locations. Corners used to calulate center
function get_corners(locations){
	min_lat = locations[0].lat;
	max_lat = locations[0].lat;
	min_long = locations[0].lng;
	max_long = locations[0].lng;
	locations.forEach(function(location){
		if (location[0] < min_lat){
			min_lat = location[0];
		}
		else if (location[0] > max_lat){
			max_lat = location[0];		 
		}
		if (location[1] < min_long){
			min_long = location[1];
		}
		else if (location[1] > max_long){
			max_long = location[1];		 
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


// Makes a list of locations 
// Fomatted: [[info, latitude, longitude],...]  
function get_locations(batteries){
	var locations = [];
	var location;

	batteries.forEach(function(battery){
		index = battery.paths[0].path.length - 1;
		point = battery.paths[0].path[index];
		
		location ={
		id: 'Battery ID: ' + battery.id + '<br>\
		<a href="https://www.google.com/maps/dir/?api=1&destination=\
		'+ String(point.lat) + ',' + String(point.lng) +'">Get Directions</a>',
		lat: point.lat,
		lng: point.lng
        }
		locations.push(location);
		
	});
	return locations;	
}
