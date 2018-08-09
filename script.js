// Temporary Data points: the end product will not have this--it is purley for test points
path0 = {id: 'path0', path: [{lat: 35.243580, lng: -120.644466, altitude: 16}]};
path1 = {id: 'path1', path:[{lat: 35.243580, lng: -120.644466, altitude: 0},{lat: 35.267042, lng: -120.659329, altitude: 100},{lat: 35.271198, lng: -120.665946, altitude: 300}]};
path2 = {id: 'path2', path:[{lat: 35.269890, lng: -120.670245, altitude: 10}, {lat: 35.269846, lng: -120.670038, altitude: 20}, {lat: 35.269526, lng: -120.670054, altitude: 10}, {lat: 35.269474, lng: -120.657663, altitude: 30}, {lat: 35.269719, lng: -120.656516, altitude: 45}, {lat: 35.274293, lng: -120.660349, altitude: 0}]};
path3 = {id: 'path3', path:[{lat: 35.295534, lng: 50.666385, altitude: 0},{lat: 35.267005, lng: -120.659328, altitude: 0},{lat: 35.280318, lng: -120.662419, altitude: 0}]};
path4 = {id: 'path4', path:[{lat: 37.772, lng: -122.214, altitude: 10},{lat: 21.291, lng: -157.821, altitude: 30},{lat: -18.142, lng: 178.431, altitude: 20},{lat: -27.467, lng: 153.027, altitude: 20}]};
paths = [path0, path1, path2, path3, path4];
paths1 = [path3, path4];
paths2 = [path4];

battery0 = {id: 'battery0', paths: paths};
battery1 = {id: 'battery1', paths: paths1};
battery2 = {id: 'battery2', paths: paths2};
batteries = [battery0, battery1, battery2];






////////////////////////////////////////////////////////////////////////////////////
//                               MAP INITIALIZATION                               //
////////////////////////////////////////////////////////////////////////////////////


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
	console.log(id);
	
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






////////////////////////////////////////////////////////////////////////////////////
//                    HELPER FUNCTIONS AND TEMPORARY FUNCTIONS                    //
////////////////////////////////////////////////////////////////////////////////////


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






///////////////////////////////////////////////////////////////////////////////////
//                                DROP DOWN MENUS                                //
///////////////////////////////////////////////////////////////////////////////////


// Changes which path is present on the map depending on what 
// the user has selected
function change_path_map(selection, battery){
	//if (selection == "show_all_paths"){
	//	console.log('show all paths');
	//}
	//else{
		//batteries.forEach(function(battery){
			console.log(selection);
        	battery.paths.forEach(function(path){
        	    if (selection == path.id){
					init_map_path(path.path, battery);
					display_distance(path, battery);
					get_altitude(path, battery);
				}
        	});
		//});
	//}
}


// Populates path dropdown menu with relevant paths depending on which
// battery is selected. Map is regenerated for first path on the list
function populate_paths(battery_id){
/*	if(battery_id == "show_all_batteries"){
		init_map_locations();
		populate("", 'path_dropdown');
		clear_div('altitude_graph');
		clear_div('distance_display');
	}
	else{	*/
			batteries.forEach(function(battery){
			if (battery.id == battery_id){
				populate(battery.paths, 'path_dropdown_' + battery.id);
				init_map_path(battery.paths[0].path);
				display_distance(battery.paths[0]);
				get_altitude(battery.paths[0]);
			}
		});
	}
//}


// Populates the battery list, this is run once when the page loads.
function populate(list_items, select_id){
	var select = document.getElementById(select_id);
	select.innerHTML = "";
	var newOption;
	
	/*if (list_items.length > 0 && select_id == 'battery_dropdown'){
		newOption = document.createElement("option");
		newOption.value = 'show_all_batteries';
		newOption.innerHTML = "Show All Batteries";
		select.options.add(newOption);
	} */

    for(item in list_items){
        newOption = document.createElement("option");
		newOption.value = list_items[item].id;
		newOption.innerHTML = list_items[item].id;
		select.options.add(newOption);
    }
}






///////////////////////////////////////////////////////////////////////////////////
//                                 Stats Display                                 //
///////////////////////////////////////////////////////////////////////////////////


// Distance formula for 2 points on Earth
function get_distance (point_A, point_B){
	var lat1 = point_A.lat;
	var lat2 = point_B.lat;   
	var lon1 = point_A.lng;
	var lon2 = point_B.lng;
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


// Returns the distance traveled along a path
function find_path_length(path){
	var total_distance = 0;
	var segment_distance;
	var point;
	for (point=0; point < path.length - 1; point++){
		segment_distance = get_distance (path[point], path[point + 1]);
		total_distance += segment_distance;
	}
	return total_distance;
}


// Displays the distance of a given path in meters to two decimals
function display_distance(path){
	if (path.path.length > 1){
	var display = document.getElementById('distance_display');
		distance = find_path_length(path.path).toFixed(2);
		display.innerHTML = path.id + ': ' + distance + ' meters';
	}
	else{
		clear_div('distance_display');
	}
}


// Uses traces and a layout to form an altitude graph. By adding a loop and appending to the 
// data list, we can make multiple paths appear on the altitude graph. We should do this once
// We figure out how to add multiple paths to the map
function get_altitude(path){
	if(path.path.length>1){
		var trace1;
		trace1 = get_altitude_data(path);
		var data = [trace1];
		var layout = {
			title: 'Altitude Graph',
			xaxis: {
				title: 'Distance (meters)',
				zeroline: true
			},
			yaxis: {
				title: 'Altitude (meters)',
				zeroline: true
			}
		};
		Plotly.newPlot('altitude_graph', data, layout);
	}
	else{
		clear_div('altitude_graph');
	}
}
	

// Returns trace value describing a set of points. It is used in creating the altitude graph
function get_altitude_data(path){
	var i;
	var x_value = 0;
	var trace = {
		x: [0],
		y: [],
		mode: 'lines',
		name: path.id
	};
	
	for (i = 0; i < path.path.length - 1; i++){
		trace.y.push(path.path[i].altitude);
		x_value +=  get_distance(path.path[i], path.path[i + 1]) ;
		trace.x.push(x_value);
	}
	trace.y.push(path.path[i].altitude);
	return trace;
}


// Clears all tags from a specified div tag. Used to clear stats and altitude graph
function clear_div(elementId){
	document.getElementById(elementId).innerHTML = "";
}






////////////////////////////////////////////////////////////////////////////////////
//                                Collapsible Menu                                //
////////////////////////////////////////////////////////////////////////////////////


// Makes the Collapse menu click sensitive and controls the toggle
function toggle_collapse_menu(){
	var coll = document.getElementsByClassName("collapsible");
	var i;
	for (i = 0; i < coll.length; i++) {
		coll[i].addEventListener("click", function() {
			this.classList.toggle("active");
			var content = this.nextElementSibling;
			if (content.style.maxHeight){
				content.style.maxHeight = null;
				console.log('Close Collapse Menu')
			} 
			else {
				content.style.maxHeight = content.scrollHeight + "px";
				console.log('Open Collapse Menu');
			} 
		});
	}
}


/* A collapse menu is created for each of the batteries, the collapse menu is of this html format:
  <button class="collapsible">Collapse</button>
		 <div class="content" id="content">-->
		 	<div id="map_battery0">...</div>
			<div id="dropdowns">...</div>
			<div id="stats">...</div>
    	 </div> */

function create_collapse_menus(batteries){
	var select = document.getElementById('collapse_menus');
	var button;
	batteries.forEach(function(battery){

		button = "<button class='collapsible' id='collapsible' value =" + battery.id + "> " + battery.id + " </button>";
		content = 
		"<div class='content' name=" + battery.id + ">" +
			"<div id='map_" + battery.id + "' class='map'></div>" +
			
			"<div id='dropdowns'>" +
				"<select id='path_dropdown_" + battery.id + "' onload='populate_paths(" + battery.id + ")' onchange='change_path_map(this.value, " + battery.id +")'></select>" +
			"</div>" +

			"<div id='stats'>" +
				"<div id='altitude_graph_" + battery.id + " '><!-- Plotly chart --></div>" +
				// Distance will be displayed here
				"<div id='distance_display_" + battery.id + "'></div>" +
			"</div>" +
		"</div>";

		select.innerHTML += button;
		select.innerHTML += content;

		populate_paths(battery.id);
	});
	console.log(select);
toggle_collapse_menu();
}








/*
Where I left off:   Want to add dropdown for paths to each collapsible menu
May need to fix show all batteries. Will we use this?
Want to add some form of padding to the content div or the map div to give it space.
*/