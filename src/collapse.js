/*
    Contains functions for the Collapse Menus: displays the stats,
    maps, and graphs
*/

import React, { Component } from 'react';
import * as DataBase from './data_base'
import * as Map from './initiate_map'
import * as Stats from './stats'
import * as Dropdown from './dropdown'

// ReactDOM.render('<p>Hi</p>',document.getElementById('ross'));
// Makes the Collapse menu click sensitive and controls the toggle
export function toggle_collapse_menu(){
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


// This is one of the most important places to use React.
// Dynamically creates html code for each battery, including:
// An Information Bar (with editable battery name), collapsible menus,
// mini maps, path dropdown menu, Altitude graph, Battery Life graph, and distance display 
export function create_collapse_menus(batteries){
    var info;
    var select_menu;
    var battery_life_display;
    var button;
    var content;
    var info_block;
	var select = document.getElementById('collapse_menus');
	
	batteries.forEach(function(battery){
        
        info = "<div class='info_bar' id='edit_" + battery.id + 
        "' contenteditable='true' onkeyup='saveEdits(this.id, batteries)'>" + battery.id + "</div>";
        
        select_menu = "<select class='info_bar' id='select_" + battery.id + "' onchange='Stats.graph_battery_life(this.value, " + battery.id + ")'>" +
        "<option value='5' class='freq_" + battery.id + "'>5</option>" +
        "<option value='10' class='freq_" + battery.id + "'>10</option>" +
        "<option value='30' class='freq_" + battery.id + "'>30</option>" +   
        "</select>" 
        
        battery_life_display = "<p class='info_bar' id='battery_display_" + battery.id + "'></p>"

        button = "<p class='info_bar collapsible' id='collapsible_" + battery.id + "' value =" + battery.id + "> " + battery.id + " </p>";
    
        content = 
		"<div class='content' name=" + battery.id + ">" +
			"<div id='map_" + battery.id + "' class='map'></div>" +
			"<div id='dropdowns'>" +
				"<select id='path_dropdown_" + battery.id + "' onload='Map.populate_paths(" + battery.id + ")' onchange='Map.change_path_map(this.value, " + battery.id +")'></select>" +
			"</div>" +
            
            "<div id='stats'>" +
                "<div class='distance_display' id='distance_display_" + battery.id + "'></div>" +
                "<div class='altitude_graph' id='altitude_graph_" + battery.id + "'></div>" +
                "<div class='battery_graph' id='battery_graph_" + battery.id + "'></div>" +
            "</div>" +
		"</div>";
        

        info_block = info;
        info_block += battery_life_display;
		info_block += select_menu;
		info_block += button;
		info_block += content;
        
        select.innerHTML += "<div id = 'info_block_" + battery.id + "' class = 'info_block'>" + info_block + "</div>";
        Dropdown.populate_paths(battery);
	});
toggle_collapse_menu();
}



// export function console(input){
//     console.log(input);
// }


// When a user makes an edit, it is stored locally
// and reloaded when the page opens
export function checkEdits(batteries) {
    var i, stored_data;
    for (i = 0; i < batteries.length; i++){
        stored_data = localStorage['edit_' + batteries[i].id];
        if(stored_data!=null){
            document.getElementById('edit_' + batteries[i].id).innerHTML = stored_data;
        }
    }
}
        

// Edits made to the battery list will be saved in local storage
// Will eventually be saved to database
export function saveEdits(id) {
        var editElem = document.getElementById(id);
        var userVersion = editElem.innerHTML;
        //save the content to local storage
        localStorage[id] = userVersion;
}



// export function add(x, y) {
//     return x + y
//   }

// export function multiply (x, y) {
//     return x * y
// }

// export function divide (x,y){
//     return multiply(x,y)/add(x,y)
// }



// These are test components, they may be good for testing connection to index
export const App = class App extends React.Component {
    constructor(){
        super();
        this.state = {
            message: "my friend (from state)!"
        };
        this.updateMessage = this.updateMessage.bind(this);
   }
    updateMessage() {
        this.setState({
            message: "my friend (from changed state)!"
        });
    }    
    render() {
        {console.log('Ross')}
        return (
        <div>
            <h1>Hello {this.state.message}!</h1>
            <select onChange={this.updateMessage}>
                Click me!
                <option id='first'>first</option>
                <option id='second'>second</option>
                <option id='third'>third</option>
            </select>
        </div>
      );
    }
}

export const CollapseMenus = class CollapseMenus extends React.Component{
    render() {
        return (
            <div>
            <h1>Hello</h1>
            <select>
                Click me!
                <option id='first'>first</option>
                <option id='second'>second</option>
                <option id='third'>third</option>
            </select>
          </div>
        )
    }
}


