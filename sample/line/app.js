var map = new ol.Map({ target: 'map'});

// Open Street Map
var osmSource = new ol.source.OSM();
var osmLayer = new ol.layer.Tile({ source: osmSource });

var view = new ol.View({
  center: [0, 0],
  zoom: 2
});
map.setView(view);

map.addLayer(osmLayer);

// Vector
var vectorSource = new ol.source.Vector();
var vectorLayer = new ol.layer.Vector({
  style: new ol.style.Style({
    fill: new ol.style.Fill({ color: '#336699' }),
    stroke: new ol.style.Stroke({ color: '#337799' }),
    image: new ol.style.Circle({
      radius: 3,
      fill: new ol.style.Fill({ color: 'rgba(100, 230, 150, .7)' }),
      stroke: new ol.style.Stroke({ color: '#4499AA' })
    })
  })
});
map.addLayer(vectorLayer);

// 描画する緯度経度情報
var LonLats = [
  { Lon: 139.5, Lat: 35.4 },
  { Lon: 148.2, Lat: 42 },
  { Lon: 156.1, Lat: 46.7 },
  { Lon: 156.1, Lat: 46.7 },
  { Lon: 164.2, Lat: 50.2 },
  { Lon: 164.2, Lat: 50.2 }, // ↑東経 ↓西経
  { Lon: 183.2, Lat: 54.2 },
  { Lon: 192.5, Lat: 55.9 },
  { Lon: 202.2, Lat: 56.1 },
  { Lon: 214.3, Lat: 55.9 },
  { Lon: 226.3, Lat: 54.1 },
  { Lon: 235.9, Lat: 50.9 },
  { Lon: 249.1, Lat: 57.1 },
  { Lon: 263.2, Lat: 62.1 },
  { Lon: 285.6, Lat: 66.2 },
  { Lon: 304.3, Lat: 67.2 },
  { Lon: 322.1, Lat: 65.1 },
  { Lon: 339.9, Lat: 61.5 },
  { Lon: 351.6, Lat: 55.8 },
  { Lon: 364.1, Lat: 45.2 } // 東経
];


var draw = document.getElementById('draw');
var remove = document.getElementById('remove');

draw.addEventListener('click', function (e) {
  var pointFeatures = [];
  var lonlats = LonLats.map(function (val, key) {

    // point生成
    var point = new ol.geom.Point(ol.proj.transform([val.Lon, val.Lat], 'EPSG:4326', 'EPSG:3857'));
    pointFeatures.push(new ol.Feature(point));

    return [val.Lon, val.Lat];
  });

  // Line生成
  var line = new ol.geom.LineString(lonlats);
  var lineFeature = new ol.Feature(line.transform('EPSG:4326', 'EPSG:3857'));

  // vectorSourceにFeatureを追加
  vectorSource.addFeatures(pointFeatures);
  vectorSource.addFeature(lineFeature);

  // Sourceセット
  vectorLayer.setSource(vectorSource);

  //var pan = ol.animation.pan({ duration: 0, source: view.getCenter() });
  //map.beforeRender(pan);
  view.setCenter(ol.proj.fromLonLat([36000, 50]));
});

remove.addEventListener('click', function (e) {
  // vectorSourceのfeatureを削除
  vectorSource.forEachFeature(function (feature, key) {
    vectorSource.removeFeature(feature);
  });
});
