// Initialize the map
function createMap(earthquakes) {

    // Create baseMap object to hold the street map layer
    let baseMap = {"Street Map": street};

    // Create overlayMap object to hold the earthquakes layer
    let overlayMap = {"Earthquakes": earthquakes}

    // Create myMap object
    let myMap = L.map("map", {
        center:[37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes]
    });

    // Create the tile layer
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    // Add layer control to the map
    L.control.layers(baseMap, overlayMap, {
                collapsed: false
            }).addTo(myMap);

}

// console.log('map init', myMap);


// Create a features function to run once for each feature in the array
function createFeatures(response) {

    // Pull the features property from response data
    let features = response.features

    // Loop through the features array
    for (let i = 0; i < features.length; i++) {
        let quake = features[i];

        // Create the circle markers
        function makeCircle(feature, coord){
            let markers = {
                radius: feature.properties.mag*5,
                color: chooseColor(feature.geometry.coordinates[2]),
                fillcolor: chooseColor(feature.geometry.coordinates[2]),
                weight: 1,
                opacity: 0.65
            }
            return L.circleMarker(coord, markers);
        }

        // Assign the color
        function chooseColor(feature, depth) {
            if (depth < 10) return '#30f040';
            else if (depth < 30) return '#34cfeb';
            else if (depth < 50) return '#3059f0';
            else if (depth < 70) return '#c330f0';
            else if (depth < 90) return '#f0309d';
            else return '#f0303d';
        }


    }

    // bind a popup to each feature
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p><p>Date: ${new Date(feature.properties.time)}</p>`)
        .addTo(myMap);
    }

    // create the circle markers
    // function makeCircle(feature, coord){
    //     let markers = {
    //         radius: feature.properties.mag*5,
    //         color: chooseColor(feature.geometry.coordinates[2]),
    //         fillcolor: chooseColor(feature.geometry.coordinates[2]),
    //         weight: 1,
    //         opacity: 0.65
    //     }
    //     return L.circleMarker(coord, markers);
    // }

    // Determine circle color based on depth
    // function chooseColor(depth) {
    //     if (depth < 10) return '#30f040';
    //     else if (depth < 30) return '#34cfeb';
    //     else if (depth < 50) return '#3059f0';
    //     else if (depth < 70) return '#c330f0';
    //     else if (depth < 90) return '#f0309d';
    //     else return '#f0303d';
    // }

    // create the GeoJSON layer that contains the features array on the earthData object
    let earthquakes = L.geoJSON(quakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: makeCircle
    }).addTo(myMap);
    // console.log('popup', earthquakes);

    // // Define the tile layer
    // function createMap(earthquakes) {
    //     let baseMap = {"Street Map": street};

    //     // update the map
    //     myMap.addLayer(street);
    //     myMap.addLayer(earthquakes);

    //     // define layer control
    //     L.control.layers(baseMap, {'Earthquakes': earthquakes}, {
    //         collapsed: false
    //     }).addTo(myMap);
    // }

}

// Create link to the GeoJSON data for earthquakes
let quakeData = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
console.log('link', quakeData);

 // Retrieve the GeoJSON data
d3.json(quakeData).then(function(data){
// Create the GeoJSON layer with the retrieved data
L.geoJSON(data.features)});

console.log('data', quakeData);



