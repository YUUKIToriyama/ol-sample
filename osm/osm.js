var proj4326 = 'EPSG:4326', proj3857 = 'EPSG:3857';

var map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  target: 'map',
  view: new ol.View({
    center: ol.proj.transform([135, 34.69], proj4326, proj3857),
    zoom: 12
  })
});

zoomslider = new ol.control.ZoomSlider();
map.addControl(zoomslider);
