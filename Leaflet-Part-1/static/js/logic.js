// Initialize the map
function createMap() {
    // Create the tile layer
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create baseMap object to hold the street map layer
    let baseMap = {"Street Map": street};

    // Create myMap object
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street]
    });

    return myMap;
}

// Create a features function to run once for each feature in the array
function createFeatures(response, myMap) {
    let features = response.features;

    function makeCircle(feature, coord) {
        let markers = {
            radius: feature.properties.mag * 5,
            color: chooseColor(feature.geometry.coordinates[2]),
            fillColor: chooseColor(feature.geometry.coordinates[2]),
            weight: 1,
            opacity: 0.65
        };
        return L.circleMarker(coord, markers);
    }

    function chooseColor(depth) {
        if (depth < 10) return '#f7a231';
        else if (depth < 30) return '#178536';
        else if (depth < 50) return '#3059f0';
        else if (depth < 70) return '#c330f0';
        else if (depth < 90) return '#f0309d';
        else return '#f0303d';
    }

    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p><p>Date: ${new Date(feature.properties.time)}</p>`);
    }

    let earthquakes = L.geoJSON(features, {
        onEachFeature: onEachFeature,
        pointToLayer: makeCircle
    }).addTo(myMap);

    // Create a legend control
    let legend = L.control({ position: "bottomright" });

    legend.onAdd = function (map) {
        let div = L.DomUtil.create("div", "legend");
        let grades = [0, 10, 30, 50, 70, 90];
        let colors = ['#f7a231', '#178536', '#3059f0', '#c330f0', '#f0309d', '#f0303d'];
        let labels = [];

        // legend title
        let legendInfo = '<h1>Earthquake depth (km)</h1>';
        div.innerHTML = legendInfo;

        // populate legend with the colors and depth values assigned previously
        grades.forEach(function(grade, i){
            labels.push(
                "<li style=\"background-color: " + colors[i] + "\">" + 
                "<span>" + grades[i] + "</span>" +
                "</li>"
            );
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    // Add legend control to the map
    legend.addTo(myMap);

}

// Create link to the GeoJSON data for earthquakes
let quakeData = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Retrieve the GeoJSON data and create the map
d3.json(quakeData).then(function(data) {
    let myMap = createMap(); // Create the map
    createFeatures(data, myMap); // Pass myMap to createFeatures
});