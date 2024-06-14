// Create the map with the street and earthquakes layers
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
  });
  console.log('map init', myMap);

// Store the API endpoint as query
let query = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(query).then(function (data) {
    // When the response is received, the 'features' variable in the JSON will be retrieved
    // 'features' is a list/array of dictionaries for each earthquake and its information
    createFeatures(data.features);
    console.log('data', data.features);
});


// Used 15-1, activity 10
// Create a function that will run once for each feature in the features array.
// Each feature will get a popup that will describe the location, magnitude, depth, and time of the earthquake.
function createFeatures(earthquakeData) {
    // this will run for each feature in the array and bind the popup to each layer
    // show: location, magnitude, depth, and date
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p><p>Date: ${new Date(feature.properties.time)}</p>`);
    }

    // Make the circle markers where size is defined by magnitude and color is defined by the depth coordinate
    function makeCircle(feature, latlng){
        // create the marker parameters
        let circles = {
            radius: feature.properties.mag,
            color: hexColor(feature.geometry.coordinates[2]),
            fillcolor: hexColor(feature.geometry.coordinates[2]),
            weight: 1,
            opacity: 0.6
        }
        return L.circle(latlng, circles);
    }

    // Get the features array on the earthquakeData object by making a GeoJSON layer that will contain it
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        // put a circle on each feature
        pointToLayer: makeCircle
    });

    // Create the function to call the color based on depth value
    // color hex codes found with https://imagecolorpicker.com/
    function hexColor(depth) {
        // lime green
        if (depth < 10) return '#30f040';
        // light blue
        else if (depth <30) return '#34cfeb';
        // medium blue
        else if (depth <50) return '#3059f0';
        // light purple
        else if (depth <70) return '#c330f0';
        // pink
        else if (depth <90) return '#f0309d';
        // red
        else return '#f0303d';

    }
}


// Create the map (15-1, activity 10)
function createMap(earthquakes) {

    // Create the base layer
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);
  
    // Create a baseMaps object
    let baseMaps = {
      "Street Map": street
    };
  
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      Earthquakes: earthquakes
    };

        

    // Update the existing map
    // myMap.setView([37.09, -95.71],3)
    myMap.addLayer(street);
    myMap.addLayer(earthquakes);
  

    // Put a layer control on the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Add the legend
    let legend = L.control({position: 'bottomright'});
    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'information legend'),
        depth = [-10, 10, 30, 50, 70, 90];

        for (var i = 0; i<depth.length; i++){
            div.innerHTML += '<i style="background:' + hexColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);
}