//Example 1.1 line 5...add tile layer
// var tileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
//     maxZoom: 18,
//     id: 'your.mapbox.project.id',
//     accessToken: 'your.mapbox.public.access.token'
// });

// tileLayer.addTo(map);

//  //load the data...Example 2.3 line 22
//  $.ajax("data/MegaCities.geojson", {
//     dataType: "json",
//     success: function(response){
//         //create a Leaflet GeoJSON layer and add it to the map
//         L.geoJson(response).addTo(map);
//     }
// });


/* Map of GeoJSON data from MegaCities.geojson */

//function to instantiate the Leaflet map
function createMap(){
    //create the map
    var map = L.map('map', {
        center: [20, 0],
        zoom: 2
    });

    //add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    //call getData function
    getData(map);
};

//added at Example 2.3 line 20...function to attach popups to each mapped feature
function onEachFeature(feature, layer) {
    //no property named popupContent; instead, create html string with all properties
    var popupContent = "";
    if (feature.properties) {
        //loop to add feature property names and values to html string
        for (var property in feature.properties){
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    };
};

//function to retrieve the data and place it on the map
function getData(map){
    //load the data
    $.ajax("data/MegaCities.geojson", {
        dataType: "json",
        success: function(response){
            var geojsonMarkerOptions = {
                radius: 8,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(response, {
                onEachFeature: onEachFeature
            }).addTo(map);
            
        }
    });
};
// //function to retrieve the data and place it on the map
// function getData(map){
    
//      //Example 2.3 line 22...load the data
//      $.ajax("data/MegaCities.geojson", {
//         dataType: "json",
//         success: function(response){
//             //create marker options
//             var geojsonMarkerOptions = {
//                 radius: 8,
//                 fillColor: "#ff7800",
//                 color: "#000",
//                 weight: 1,
//                 opacity: 1,
//                 fillOpacity: 0.8
//             };

//             //create a Leaflet GeoJSON layer and add it to the map
//             L.geoJson(response, {
//                 pointToLayer: function (feature, latlng){
//                     return L.circleMarker(latlng, geojsonMarkerOptions);
//                 }
//             }).addTo(map);
//         }
//     });
    // //load the data
    // $.ajax("data/MegaCities.geojson", {
        
    //     dataType: "json",
    //     success: function(response){

    //         //create a Leaflet GeoJSON layer and add it to the map
    //         L.geoJson(response).addTo(map);
    //     }
    // });
//};


$(document).ready(createMap);