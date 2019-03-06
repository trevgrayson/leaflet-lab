

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

//function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes){
    //Determine which attribute to visualize with proportional symbols
    var attribute = attributes[0];

    //create marker options
    var options = {
        fillColor: "#ff4300",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    //build popup content string
    var popupContent = "<p><b>Country:</b> " + feature.properties.Country + "</p>";
    var year = attribute.split("yr")[1];
    popupContent += "<p><b>Emmisions per capita in " + year + ":</b> " + feature.properties[attribute] + " tonnes   </p>";
    //bind the popup to the circle marker
    layer.bindPopup(popupContent, {
        offset: new L.Point(0,-options.radius)
    });

    //event listeners to open popup on hover
    layer.on({
        mouseover: function(){
            this.openPopup();
        },
        mouseout: function(){
            this.closePopup();
        },
        // click: function(){
        //     $("#panel").html(popupContent);
        // }
    })

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//Add circle markers for point features to the map
function createPropSymbols(data, map, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        },
        // filter: filterSet(map, attributes, index)
        //  function(feature, layer) {
        //     // filterValue = emissionRange()
        //     if (feature.properties.yr1995 > filterValue ) {
        //         return 'true'
        //     }
        // }
    }).addTo(map);
};

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = 20;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);
    return radius;
};

// //trying to create a function that returns a filter statement to the L.geojson
// function filterSet(map, attributes, index){
//     var filter = 1
//     var indexVal = // this will be a multistep value probaby to split to filter by high, medium, and low per capita emissions
//     filterText = "function(feature, layer, attr, indexVal) {if (feature.properties[attr] > indexVal) { return true}}"
//     return filterText
// };

//Reference text from example. Trying to piece this with my method together
// $('.menu-ui a').on('click', function() {
//     // For each filter link, get the 'data-filter' attribute value.
//     var filter = $(this).data('filter');
//     $(this).addClass('active').siblings().removeClass('active');
//     markers.setFilter(function(f) {
//         // If the data-filter attribute is set to "all", return
//         // all (true). Otherwise, filter on markers that have
//         // a value set to true based on the filter name.
//         return (filter === 'all') ? true : f.properties[filter] === true;
//     });
//     return false;
// });

//Create new sequence controls
function createSequenceControls(map, attributes){
    //create range input element (slider)
    $('#panel').append('<button class="skip" id="reverse">Reverse</button>');
    $('#reverse').html('<img src="img/reverse.png">');
    $('#panel').append('<input class="range-slider" type="range">');
    $('#panel').append('<button class="skip" id="forward">Skip</button>');
    $('#forward').html('<img src="img/forward.png">');

    //set slider attributes
    $('.range-slider').attr({
        max: 6,
        min: 0,
        value: 0,
        step: 1
    });

    //Step 5: click listener for buttons
    $('.skip').click(function(){
        //get the old index value
        var index = $('.range-slider').val();

        //Step 6: increment or decrement depending on button clicked
        if ($(this).attr('id') == 'forward'){
            index++;
            //Step 7: if past the last attribute, wrap around to first attribute
            index = index > 6 ? 0 : index;
        } else if ($(this).attr('id') == 'reverse'){
            index--;
            //Step 7: if past the first attribute, wrap around to last attribute
            index = index < 0 ? 6 : index;
        };

        //update slider
        $('.range-slider').val(index);
        
        //input listener for slider
        $('.range-slider').on('input', function(){
            //FINISH MANUAL SLIDER 
        });
        //pass new attribute to update symbols
        updatePropSymbols(map, attributes[index]);
    });
    
};

//Step 10: Resize proportional symbols according to new attribute values
function updatePropSymbols(map, attribute){
    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            //access feature properties
            var props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);

            //add city to popup content string
            var popupContent = "<p><b>Country:</b> " + props.Country + "</p>";

            //add formatted attribute to panel content string
            console.log(attribute)
            var year = attribute.split("yr")[1];
            popupContent += "<p><b>Emmisions per capita in " + year + ":</b> " + props[attribute] + " tonnes   </p>";
            
            //replace the layer popup
            layer.bindPopup(popupContent, {
                offset: new L.Point(0,-radius)
            });
        };
    });
};

function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("yr") > -1){
            attributes.push(attribute);
        };
    };

    //check result
    console.log(attributes);

    return attributes;
};

//Import GeoJSON data
function getData(map){
    //load the data
    $.ajax("data/countries.geojson", {
        dataType: "json",
        success: function(response){
            var attributes = processData(response);

            createPropSymbols(response, map, attributes);
            createSequenceControls(map, attributes);
            // emissionRange(map, attributes)
        }
    });
};

$(document).ready(createMap);