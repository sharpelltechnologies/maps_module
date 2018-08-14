// Temporary Data points: the end product will not have this--it is purley for test points
path0 = {id: 'path0', path: [{lat: 35.243580, lng: -120.644466, altitude: 16, life: 100, time: 12}]};
path1 = {id: 'path1', path:[{lat: 35.243580, lng: -120.644466, altitude: 0, life: 100, time: 0},{lat: 35.267042, lng: -120.659329, altitude: 100, life: 90, time: 1},{lat: 35.271198, lng: -120.665946, altitude: 300, life: 20, time: 2}]};
path2 = {id: 'path2', path:[{lat: 35.269890, lng: -120.670245, altitude: 0, life: 100, time: 12}, {lat: 35.269846, lng: -120.670038, altitude: 20, life: 90, time: 1}, {lat: 35.269526, lng: -120.670054, altitude: 10, life: 80, time: 2}, {lat: 35.269474, lng: -120.657663, altitude: 30, life: 70, time: 3}, {lat: 35.269719, lng: -120.656516, altitude: 45, life: 60, time: 4}, {lat: 35.274293, lng: -120.660349, altitude: 0, life: 50, time: 5}]};
path3 = {id: 'path3', path:[{lat: 35.295534, lng: 50.666385, altitude: 0, life: 70, time: 3},{lat: 35.267005, lng: -120.659328, altitude: 0, life: 30, time: 12},{lat: 35.280318, lng: -120.662419, altitude: 0, life: 12, time: 13}]};
path4 = {id: 'path4', path:[{lat: 37.772, lng: -122.214, altitude: 10, life: 16, time: 2},{lat: 21.291, lng: -157.821, altitude: 30, life: 9, time: 4},{lat: -18.142, lng: 178.431, altitude: 20, life: 5, time: 7},{lat: -27.467, lng: 153.027, altitude: 20, life: 2, time: 10}]};
path5 = {id: 'path5', path:[{lat: 37.772, lng: -122.214, altitude: 10, life: 16, time: 2},{lat: 21.291, lng: -157.821, altitude: 30, life: 0, time: 4},{lat: -18.142, lng: 178.431, altitude: 20, life: 0, time: 7},{lat: -27.467, lng: 153.027, altitude: 20, life: 0, time: 10}]};

paths = [path0, path1, path2, path3, path4];
paths1 = [path3, path4,path0];
paths2 = [path4];
paths3 = [path5];

battery0 = {id: 'battery0', paths: paths, life: 100};
battery1 = {id: 'battery1', paths: paths1, life: 10};
battery2 = {id: 'battery2', paths: paths2, life: 1};
battery3 = {id: 'battery3', paths: paths3, life: 0};
batteries = [battery0, battery1, battery2, battery3];


//function pull_element (battery, element){
//}

// function push_element (battery, element){
// }

