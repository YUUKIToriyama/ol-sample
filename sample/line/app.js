var osmSource = new ol.source.OSM();
var osmLayer = new ol.layer.Tile({ source: osmSource });
var map = new ol.Map({ target: 'map'});

map.setView(new ol.View({
  center: [0, 0],
  zoom: 2
}));

map.addLayer(osmLayer);
