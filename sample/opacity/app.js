var osmSource = new ol.source.OSM();
var mapQSource = new ol.source.MapQuest({ layer: 'sat' });

var osmLayer = new ol.layer.Tile({ source: osmSource });
var mapQLayer = new ol.layer.Tile({ source: mapQSource });

var map = new ol.Map({ target: 'map'});

map.setView(new ol.View({
  center: [0, 0],
  zoom: 2
}));

map.addLayer(mapQLayer);
map.addLayer(osmLayer);


var osmSlide   = document.getElementById('osm-slide');
var osmOpacity = document.getElementById('osm-opacity');
osmSlide.addEventListener('input', function (e) {
  osmOpacity.innerHTML = this.value;
  osmLayer.setOpacity(this.value);
});

var questSlide   = document.getElementById('mapquest-slide');
var questOpacity = document.getElementById('mapquest-opacity');
questSlide.addEventListener('input', function (e) {
  questOpacity.innerHTML = this.value;
  mapQLayer.setOpacity(this.value);
});

var osmOnOff   = document.getElementById('osm-vis');
osmOnOff.addEventListener('click', function (e) {
  if (osmLayer.getVisible()) {
    osmLayer.setVisible(false);
  } else {
    osmLayer.setVisible(true);
  }
});

var questOnOff = document.getElementById('mapquest-vis');
questOnOff.addEventListener('click', function (e) {
  if (mapQLayer.getVisible()) {
    mapQLayer.setVisible(false);
  } else {
    mapQLayer.setVisible(true);
  }
});
