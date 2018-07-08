// Initialize leaflet.js
var L = require('leaflet');

var Draw = require('leaflet-draw');

// Initialize the map
var map = L.map('map', {
  scrollWheelZoom: false
});

// Set the position and zoom level of the map
map.setView([45.42, 10.39], 5);

// Initialize the base layer
var osm_mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var drawnItems = L.featureGroup().addTo(map);

L.control.layers(null, { 'user layer': drawnItems }, { position: 'topleft', collapsed: false }).addTo(map);

map.addControl(new L.Control.Draw({
    draw: {
        polygon: false,
        polyline: false,
        circlemarker: true,
        marker: false,
        rectangle: false,
        circle: false
        },
    edit: {
        featureGroup: drawnItems,
        edit: true
        }
}));

map.on(L.Draw.Event.CREATED, function (event) {
    var layer = event.layer;

    drawnItems.addLayer(layer);
});