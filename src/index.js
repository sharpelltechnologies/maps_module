// Imports all necessary files (React, JavaScript, CSS, etc.)
// and renders them to the root div in ../public/index.html

import {React} from 'react';
import ReactDOM from 'react-dom';
import '../src/style.css';
import registerServiceWorker from './registerServiceWorker';
import * as Collapse from './collapse'
import * as DataBase from './data_base'
import * as Map from './initiate_map'
import * as Stats from './stats'
import * as Dropdown from './dropdown'

/*
In case it does not work when Ross is done:
For this to work, the first thing that needs to happen is a set up of the html, this occurs in the function
create_collapse_menus(batteries). Create_collapse_menus would be best as a React Element or Component,
but I would leave as is until everything is connected properly and the app functions.
Once the collapse menu html has been generated, the next step is creating the maps, 
this is done with init_map_ locations and show_mini_maps since the html is set up, these should function without
editting (at least i would expect so)
Finally, checking the Edits will make the battery names show up properly; this one is not a foundation for anything
so it is less important


Basically, we need this to occur (may work in the html, but probably better run on this page):

onload=
"create_collapse_menus(batteries), 
init_map_locations(batteries), 
show_mini_maps(batteries),
checkEdits(batteries)"

Eventually battery info will be pulled from the database, so a call to the database will be the first function called
*/ 

var batteries = DataBase.batteries;

Collapse.create_collapse_menus(batteries);
Map.init_map_locations(batteries);
Map.show_mini_maps(batteries);
Collapse.checkEdits(batteries);


// REMEMBER: If you want the functions drom another file in a js file, you must use the name you imported to let the 
//           program where the funtion is supposed to be coming from. example)    Stats.display_distance(path, battery)
//           It is not unlikely that I missed a spot where this note would be applicable. 


// Example of what the render may look like if we make components and JSX. Final product may resemble this.
// ReactDOM.render(
//     <div>
//         <App />
//         <CollapseMenus />
//     </div>,
//     document.getElementById('root')
// );



registerServiceWorker();
