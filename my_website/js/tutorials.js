//creates a map with the view and zoom level initialized
var mymap = L.map('mapid').setView([51.505, -0.09], 13);
//adds a map tile layer from mapbox
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',//try satellite
    accessToken: 'pk.eyJ1IjoidGdyYXlzb24iLCJhIjoiY2phMnFtbW9lM3Q2aDMxcG9qNmd1cWZ2OSJ9.UDH3ewECby8MO90dgzeY6Q'
}).addTo(mymap);

//adds a marker at the coordinates provided 
var marker = L.marker([51.5, -0.09]).addTo(mymap);

//adds circle to the map at coordinates provided
var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(mymap);

//adds polygon with vertexes of the polygon provided
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(mymap);

//creates pop up functions for when user clicks on features
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();//this one starts open
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

//standalone pop up at coordinates
var popup = L.popup()
    .setLatLng([51.5, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(mymap);

var popup = L.popup();

//displays a pop up of the lat and long of the location the user clicks
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}

mymap.on('click', onMapClick);

//////

var map = L.map('mapid2').setView([39.75621, -104.99404], 13);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.satellite',//try satellite
    accessToken: 'pk.eyJ1IjoidGdyYXlzb24iLCJhIjoiY2phMnFtbW9lM3Q2aDMxcG9qNmd1cWZ2OSJ9.UDH3ewECby8MO90dgzeY6Q'
}).addTo(map);

//creates a geojson feature with attributes and coordinates provided
var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};
//adds geojson feature to map
L.geoJSON(geojsonFeature).addTo(map);
var myLayer = L.geoJSON().addTo(map);
myLayer.addData(geojsonFeature);

//creates geojson lines
var myLines = [{
    "type": "LineString",
    "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
    "type": "LineString",
    "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];

//creates a style object
var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

//adds geojson lines to map with style of myStyle which was created above
L.geoJSON(myLines, {
    style: myStyle
}).addTo(map);

//creates 2 state polygons
var states = [{
    "type": "Feature",
    "properties": {"party": "Republican"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-104.05, 48.99],
            [-97.22,  48.98],
            [-96.58,  45.94],
            [-104.03, 45.94],
            [-104.05, 48.99]
        ]]
    }
}, {
    "type": "Feature",
    "properties": {"party": "Democrat"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-109.05, 41.00],
            [-102.06, 40.99],
            [-102.03, 36.99],
            [-109.04, 36.99],
            [-109.05, 41.00]
        ]]
    }
}];

//adds states to map symbolizing based off of attributes
L.geoJSON(states, {
    style: function(feature) {
        switch (feature.properties.party) {
            case 'Republican': return {color: "#ff0000"};
            case 'Democrat':   return {color: "#0000ff"};
        }
    }
}).addTo(map);

//sets attributes for a marker
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

//adds markers at coordinates using attributes defined above
L.geoJSON(someGeojsonFeature, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
}).addTo(map);

//if has property for popup, this creates the popup
function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}


//creates multiple geojson features
var someFeatures = [{
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "show_on_map": true,
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
}, {
    "type": "Feature",
    "properties": {
        "name": "Busch Field",
        "show_on_map": true
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.98404, 39.74621]
    }
}];

//adds features to map
L.geoJSON(someFeatures, {
    filter: function(feature, layer) {
        return feature.properties.show_on_map;
    }
}).addTo(map);

//adds features and calls popup creation function
L.geoJSON(geojsonFeature, {
    onEachFeature: onEachFeature
}).addTo(map);