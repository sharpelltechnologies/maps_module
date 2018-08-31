/*  
    Contains functions for displaying stats, such as 
    distance along a path and the altitude/battery life graphs
*/

import React, { Component } from 'react';
import * as Collapse from './collapse'
import * as DataBase from './data_base'
import * as Map from './initiate_map'
import * as Dropdown from './dropdown'




///////////////////////////////Distance///////////////////////////////


// Distance formula for 2 points on Earth
export function get_distance (point_A, point_B){
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
export function find_path_length(path){
	var total_distance = 0;
	var segment_distance, point;
	for (point=0; point < path.length - 1; point++){
		segment_distance = get_distance (path[point], path[point + 1]);
		total_distance += segment_distance;
	}
	return total_distance;
}


// Displays the distance of a given path in meters to two decimals
export function display_distance(path, battery){
	if (path.path.length > 1){
		var display = document.getElementById('distance_display_' + battery.id);
		var distance = find_path_length(path.path).toFixed(2);
		display.innerHTML = path.id + ': ' + distance + ' meters';
	}
	else{
		clear_div('distance_display_' + battery.id);
	}
}





/////////////////////////////Battery Life/////////////////////////////


// Uses traces and a layout to form an altitude graph. By adding a loop and appending to the 
// data list, we can make multiple paths appear on the altitude graph. We should do this once
// We figure out how to add multiple paths to the map
export function get_altitude(path, battery){
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
export function get_altitude_data(path){
	var i;
	var x_value = 0;
	var trace = {
		x: [0],
		y: [],
		mode: 'lines',
		fill: 'tonexty',
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
export function clear_div(elementId){
	document.getElementById(elementId).innerHTML = "";
}





/////////////////////////////Battery Life/////////////////////////////


// Gathers data necessary to create a graph with battery life
// history and predicted life span.
export function graph_battery_life(frequency, battery){
	console.log('battery: ' + battery.id)
	var battery_info = get_battery_life(battery);
	var coordinate = battery_info[1];
	
	var trace1 = battery_info[0];
	var data = [trace1];
	
	if (coordinate[1]!=0){
		var trace2 = predict_battery_life(frequency, coordinate);
		data.push(trace2);
	}
	var layout = {
        width: 300,
        height: 300,
		title: 'Battery Life',
		xaxis: {
			title: 'Time (hours)',
			zeroline: true,
			showline: true
		},
		yaxis: {
			title: 'Battery Life (percentage)',
			zeroline: true,
			showline: true,
			range: [0,100]
		}
    };
	Plotly.newPlot('battery_graph_' + battery.id, data, layout);

}
	

// Returns initial trace, depicting battery life history, and it returns
// coordinate of current time and battery life. Also adds current battery life to display
export function get_battery_life(battery){
	var recent_path = battery.paths[0].path;
	var coordinate;
	var trace1 = {
		fill: 'tonexty',
		mode: 'lines',
		name: 'Battery Use',
		color: '#055ea8',
		x: [],
		y: []
		}		
	recent_path.forEach(function(point){
		
		trace1.x.push(point.time);
		trace1.y.push(point.life);
		coordinate = [point.time, point.life];
		if (point.life <= 0){
		//	document.getElementById('battery_graph_' + battery.id).innerHTML = coordinate[1];
			return [trace1, coordinate];
		}	
	});
	document.getElementById('battery_display_' + battery.id).innerHTML = coordinate[1] + '%';
	return [trace1, coordinate];
}


// Uses initial coordinate points and rate of decay to add a new line
// predicting the battery life over time on the battery life graph
export function predict_battery_life(frequency, coordinate){
	var x_value = coordinate[0];
	var y_value = coordinate[1];
	var slope = rate_of_decay(frequency);
	var trace = {
		fill: 'none',
		mode: 'lines',
		dash: 'dot',
		linecolor: '#055ea8',
		name: 'Predicted Battery Life',
		x: [x_value],
		y: [y_value]
		}		
	while (y_value > 0){
		x_value += slope.x;
		y_value += slope.y;
		trace.x.push(x_value);
		trace.y.push(y_value);
	}
	return trace;
}


// Returns the rate at which the the life decreases with respect to time
// This rate depends on the frequency of gps pings
export function rate_of_decay(frequency){
	var rate;
	if (frequency == 5){
		rate = {x:1, y:-2}
	}
	else if (frequency == 10){
		rate = {x:3, y:-3}
	}
	else if (frequency == 30){
		rate = {x:8, y:-4}
	}
	return rate;
}
