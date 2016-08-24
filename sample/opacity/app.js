var osmSource = new ol.source.OSM();
var osmLayer = new ol.layer.Tile({ source: osmSource });
var map = new ol.Map({ target: 'map'});

map.setView(new ol.View({
  center: [0, 0],
  zoom: 2
}));

map.addLayer(osmLayer);

var osmSlide   = document.getElementById('osm-slide');
var osmOpacity = document.getElementById('osm-opacity');
osmSlide.addEventListener('input', function (e) {
  osmOpacity.innerHTML = this.value;
  osmLayer.setOpacity(this.value);
});

var osmOnOff   = document.getElementById('osm-vis');
osmOnOff.addEventListener('click', function (e) {
  if (osmLayer.getVisible()) {
    osmLayer.setVisible(false);
  } else {
    osmLayer.setVisible(true);
  }
});
