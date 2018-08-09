/*  
    Contains functions for displaying stats, such as 
    distance along a path and the altitude graph
*/

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
function display_distance(path, battery){
	if (path.path.length > 1){
	var display = document.getElementById('distance_display_' + battery.id);
		distance = find_path_length(path.path).toFixed(2);
		display.innerHTML = path.id + ': ' + distance + ' meters';
	}
	else{
		clear_div('distance_display_' + battery.id);
	}
}


// Uses traces and a layout to form an altitude graph. By adding a loop and appending to the 
// data list, we can make multiple paths appear on the altitude graph. We should do this once
// We figure out how to add multiple paths to the map
function get_altitude(path, battery){
	if(path.path.length>1){
		var trace1;
		trace1 = get_altitude_data(path);
		var data = [trace1];
		var layout = {
            width: 300,
            height: 300,
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
        Plotly.newPlot('altitude_graph_' + battery.id, data, layout);
	}
	else {
		clear_div('altitude_graph_' + battery.id);
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
