/*
    Contains functions for creating the dropdown menus, 
    which also control what happens when options are selected
    such as changing the path maps
*/


// Changes which path is present on the map depending on what 
// the user has selected
function change_path_map(selection, battery){
	//if (selection == "show_all_paths"){
	//	console.log('show all paths');
	//}
	//else{
		//batteries.forEach(function(battery){
			
        	battery.paths.forEach(function(path){
        	    if (selection == path.id){
					init_map_path(path.path, battery);
                    get_altitude(path, battery);
                    display_distance(path, battery);
				}
        	});
		//});
	//}
}


// Populates path dropdown menu with relevant paths depending on which
// battery is selected. Map is regenerated for first path on the list
function populate_paths(battery){
/*	if(battery_id == "show_all_batteries"){
		init_map_locations();
		populate("", 'path_dropdown');
		clear_div('altitude_graph');
		clear_div('distance_display');
	}
	else{	*/
			
				populate(battery.paths, 'path_dropdown_' + battery.id);
				init_map_path(battery.paths[0].path);
				display_distance(battery.paths[0], battery);
				get_altitude(battery.paths[0], battery);
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


