/*
    Contains functions for creating the dropdown menus, 
    which also control what happens when options are selected
    such as changing the path maps
*/

import React, { Component } from 'react';
import * as Collapse from './collapse'
import * as DataBase from './data_base'
import * as Map from './initiate_map'
import * as Stats from './stats'

// Changes which path is present on the map depending on what 
// the user has selected
export function change_path_map(selection, battery){
	
	if (selection == "show_location"){
		console.log(selection);
		Map.init_map_locations([battery]);
		Stats.clear_div('altitude_graph_' + battery.id);
		Stats.clear_div('distance_display_' + battery.id);
	}
	else{		
    	battery.paths.forEach(function(path){
            if (selection == path.id){
				Map.init_map_path(path.path, battery);
				Stats.get_altitude(path, battery);
                Stats.display_distance(path, battery);
			}
        });
	}	
}


// Populates path dropdown menu with relevant paths depending on which
// battery is selected. Map is regenerated for first path on the list
export function populate_paths(battery){			
	populate(battery.paths, 'path_dropdown_' + battery.id);
	Map.init_map_path(battery.paths[0].path);
	Stats.display_distance(battery.paths[0], battery);
	Stats.get_altitude(battery.paths[0], battery);
}

// Can be done with React
// Populates the path list for each battery
export function populate(list_items, select_id){
	var select = document.getElementById(select_id);
	select.innerHTML = "";
	var newOption;
	newOption = document.createElement("option");
	newOption.value = "show_location";
	newOption.innerHTML = "show_location";
	select.options.add(newOption);
	
	for(var item in list_items){
        newOption = document.createElement("option");
		newOption.value = list_items[item].id;
		newOption.innerHTML = list_items[item].id;
		select.options.add(newOption);
    }
}


