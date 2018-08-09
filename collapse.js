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
	var select = document.getElementById('collapse_menus');
	
	batteries.forEach(function(battery){
        info = "<div class='info_bar' id='edit_" + battery.id + 
        "' contenteditable='true' onkeyup='saveEdits(this.id, batteries)'>" + battery.id + "</div>";
        
    
        button = "<button class='info_bar collapsible' id='collapsible' value =" + battery.id + "> " + battery.id + " </button>";
    
        content = 
		"<div class='content' name=" + battery.id + ">" +
			"<div id='map_" + battery.id + "' class='map'></div>" +
			"<div id='dropdowns'>" +
				"<select id='path_dropdown_" + battery.id + "' onload='populate_paths(" + battery.id + ")' onchange='change_path_map(this.value, " + battery.id +")'></select>" +
			"</div>" +
            
            "<div id='stats'>" +
                "<div id='distance_display_" + battery.id + "'>Distance</div>" +
                "<div id='altitude_graph_" + battery.id + "'></div>" +
			"</div>" +
		"</div>";
        select.innerHTML += info;
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
    console.log('id: ' + id);
        var editElem = document.getElementById(id);
        var userVersion = editElem.innerHTML;
        //save the content to local storage
        localStorage[id] = userVersion;
}