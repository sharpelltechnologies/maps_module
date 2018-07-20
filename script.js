// Global Variables: may not be global once we switch to the database
path0 = {id: 'path0', path: [{lat: 35.243580, lng: -120.644466}]};
path1 = {id: 'path1', path:[{lat: 35.243580, lng: -120.644466},{lat: 35.267042, lng: -120.659329},{lat: 35.271198, lng: -120.665946}]};
path2 = {id: 'path2', path:[{lat: 35.269890, lng: -120.670245}, {lat: 35.269846, lng: -120.670038}, {lat: 35.269526, lng: -120.670054}, {lat: 35.269474, lng: -120.657663}, {lat: 35.269474, lng: -120.657663},{lat: 35.269719, lng: -120.656516}, {lat: 35.274293, lng: -120.660349}]};
path3 = {id: 'path3', path:[{lat: 35.295534, lng: 50.666385},{lat: 35.267005, lng: -120.659328},{lat: 35.280318, lng: -120.662419}]};
path4 = {id: 'path4', path:[{lat: 37.772, lng: -122.214},{lat: 21.291, lng: -157.821},{lat: -18.142, lng: 178.431},{lat: -27.467, lng: 153.027}]};
paths = [path0, path1, path2, path3, path4];
paths1 = [path3, path4];

battery0 = {id: 'battery0', paths: paths};
battery1 = {id: 'battery1', paths: paths1};
battery2 = {id: 'battery2', paths: paths1};
batteries = [battery0, battery1, battery2];






////////////////////////////////////////////////////////////////////////////////////
//                               MAP INITIALIZATION                               //
////////////////////////////////////////////////////////////////////////////////////


// Initiates the map, centered between the batteries' locations and zoomed to fit all markers
function init_map_locations() {
    var location_data = get_location_data();
    var locations = get_locations(location_data);
    if(locations.length > 0){
        var corner_points = get_corners(locations);
        var center = get_center(corner_points[0], corner_points[1]);
    }
    else{
        var center = [0.00000, 0.00000];
	}
    generate_location_map(center, locations);
}

// Initiates the map, centered around the path of a single battery, zoomed to fit the path
function init_map_path(path) {
    if(path.length > 0){
        var corner_points = get_corners(path);
        var center = get_center(corner_points[0], corner_points[1]);
    }
    else{
        var center = [0.00000, 0.00000];
    }
    console.log('path: ' + path);
    generate_path_map(center, path);
}

// Generates a map with the locations of each battery
// Need to fix single point and no point zoom (decide what to do when no batteries are given)
function generate_location_map(center, locations){

    // Generates the map
    var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 13,
		center: new google.maps.LatLng(center[0], center[1]),
		mapTypeId: google.maps.MapTypeId.ROADMAP
    });	
    

    // Adds a marker at each specified location
    var marker, i;
	var bounds = new google.maps.LatLngBounds();
    var infowindow = new google.maps.InfoWindow({});
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
	// Now fit the map to the newly inclusive bounds
	if (locations.length > 1){
		map.fitBounds(bounds);
    }
}

// Generates a map with a path traveled by a battery
// Need to fix no point zoom (decide what to do when no batteries are given)
function generate_path_map(center, path){

    // Generates the map
    var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 13,
		center: new google.maps.LatLng(center[0], center[1]),
		mapTypeId: google.maps.MapTypeId.ROADMAP
    });	
    
    // Adds a marker at end points, create a path between each data point
    if(path.length > 0){
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

    var path_characteristics = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      path_characteristics.setMap(map);

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

// Distance formula for 2 points on Earth
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

// Will eventually retrieve location_data from database
function get_location_data(){
    var location_data = [];
    //location_data.push({lat: 35.243580, lng: -120.644466, id: 'Test'});
    //location_data.push({lat: 35.243580, lng: -120.644466, id: 'Test'},{lat: 35.267042, lng: -120.659329, id: 'Ross'},{lat: 35.271198, lng: -120.665946, id: 'other'});
	//location_data.push({lat: 35.295534, lng: 50.666385, id: '0'},{lat: 35.267005, lng: -120.659328, id: 'id'},{lat: 35.280318, lng: -120.662419, id: 'Apples'});
    location_data.push({lat: 37.772, lng: -122.214, id: 1},{lat: 21.291, lng: -157.821, id: 2},{lat: -18.142, lng: 178.431, id: 3},{lat: -27.467, lng: 153.027, id: 4});
    return location_data;
}

// Will eventually retrieve path_data form the database
function get_path_data(){
	var path_data = [];
	//path_data.push({lat: 35.243580, lng: -120.644466});
	//path_data.push({lat: 35.243580, lng: -120.644466},{lat: 35.267042, lng: -120.659329},{lat: 35.271198, lng: -120.665946});
	path_data.push({lat: 35.269890, lng: -120.670245}, {lat: 35.269846, lng: -120.670038}, {lat: 35.269526, lng: -120.670054}, {lat: 35.269474, lng: -120.657663}, {lat: 35.269474, lng: -120.657663},{lat: 35.269719, lng: -120.656516}, {lat: 35.274293, lng: -120.660349});
	//path_data.push({lat: 35.295534, lng: 50.666385},{lat: 35.267005, lng: -120.659328},{lat: 35.280318, lng: -120.662419});
    //path_data.push({lat: 37.772, lng: -122.214},{lat: 21.291, lng: -157.821},{lat: -18.142, lng: 178.431},{lat: -27.467, lng: 153.027});
    return path_data;
}

// Makes a list of locations (may be replaced by the database)
// Fomatted: [[info, latitude, longitude],...]  
function get_locations(location_data){
    var locations = [];
	location_data.forEach(function(battery){
		var location = {
		id: 'Battery ID: ' + battery.id + '<br>\
		<a href="https://www.google.com/maps/dir/?api=1&destination=\
		'+ String(battery.lat) + ',' + String(battery.lng) +'">Get Directions</a>',
		lat: battery.lat,
		lng: battery.lng
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
function change_path_map(path_id){
    batteries.forEach(function(battery){
        battery.paths.forEach(function(path){
            if (path.id == path_id){
                init_map_path(path.path);
            }
        });
    });
}

// Populates path dropdown menu with relevant paths depending on which
// battery is selected. Map is regenerated for first path on the list
function populate_paths(battery_id){
    batteries.forEach(function(battery){
        if (battery.id == battery_id){
            populate(battery.paths, 'path_dropdown');
            init_map_path(battery.paths[0].path);
        }
    });
}

// Populates the battery list, this is run once when the page loads.
function populate(batteries, select_id){
	var select = document.getElementById(select_id);
    select.innerHTML = "";
    for(battery in batteries){
        var newOption = document.createElement("option");
		newOption.value = batteries[battery].id;
		newOption.innerHTML = batteries[battery].id;
		select.options.add(newOption);
    }
}

/*
// Creates a new select tag and populates it with an array
function do_something(battery){
    var myDiv = document.getElementById("dropdowns");

//Create array of options to be added
var array = ['ROSS', 'SURE', 'SLEEP', 'WOAH'];

//Create and append select list
var selectList = document.createElement("select");
selectList.id = "mySelect";
selectList.onchange = "console.log('PLEASE JESUS')"
myDiv.appendChild(selectList);
console.log(selectList);
//Create and append the options
for (var i = 0; i < array.length; i++) {
    var option = document.createElement("option");
    option.value = array[i];
    option.text = array[i];
    selectList.appendChild(option);
}
console.log(battery_dropdown);
}
*/