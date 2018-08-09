/*
    Contains functions for the Collapse Menus: displays the stats,
    maps, and graphs
*/


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
			} 
			else {
				content.style.maxHeight = content.scrollHeight + "px";
			} 
		});
	}
}


// Dynamically creates html code for each battery, including:
// An Information Bar (with editable battery name), collapsible menus,
// mini maps, path dropdown menu, Altitude graph, and distance display 
function create_collapse_menus(batteries){
	var info;
    var button;
    var battery_life_display;
	var select = document.getElementById('collapse_menus');
	
	batteries.forEach(function(battery){
        info = "<div class='info_bar' id='edit_" + battery.id + 
        "' contenteditable='true' onkeyup='saveEdits(this.id, batteries)'>" + battery.id + "</div>";
        
        console.log(battery.id)
        select_menu = "<select class='info_bar' id='select_" + battery.id + "' onchange=' graph_battery_life(this.value, " + battery.id + ")'>" +
        "<option value='5' class='freq_" + battery.id + "'>5</option>" +
        "<option value='10' class='freq_" + battery.id + "'>10</option>" +
        "<option value='30' class='freq_" + battery.id + "'>30</option>" +   
    
        "</select>" 
        
        battery_life_display = "<p class='info_bar' id='battery_display_" + battery.id + "'>Hello</p>"

        button = "<button class='collapsible info_bar' id='collapsible_" + battery.id + "' value =" + battery.id + "> " + battery.id + " </button>";
    
        content = 
		"<div class='content' name=" + battery.id + ">" +
			"<div id='map_" + battery.id + "' class='map'></div>" +
			"<div id='dropdowns'>" +
				"<select id='path_dropdown_" + battery.id + "' onload='populate_paths(" + battery.id + ")' onchange='change_path_map(this.value, " + battery.id +")'></select>" +
			"</div>" +
            
            "<div id='stats'>" +
                "<div class='distance_display' id='distance_display_" + battery.id + "'>Distance</div>" +
                "<div class='altitude_graph' id='altitude_graph_" + battery.id + "'></div>" +
                "<div class='battery_graph' id='battery_graph_" + battery.id + "'></div>" +
            "</div>" +
		"</div>";
        
        select.innerHTML += info;
        select.innerHTML += battery_life_display;
		select.innerHTML += select_menu;
		select.innerHTML += button;
		select.innerHTML += content;

        populate_paths(battery);
        
	});
toggle_collapse_menu();
}


// When a user makes an edit, it is stored locally
// and reloaded when the page opens
function checkEdits(batteries) {
    var i;
    for (i = 0; i < batteries.length; i++){
        stored_data = localStorage['edit_' + batteries[i].id];
        if(stored_data!=null){
            document.getElementById('edit_' + batteries[i].id).innerHTML = stored_data;
        }
    }
}
        

// Edits made to the battery list will be saved in local storage
// Will eventually be saved to database
function saveEdits(id) {
        var editElem = document.getElementById(id);
        var userVersion = editElem.innerHTML;
        //save the content to local storage
        localStorage[id] = userVersion;
}