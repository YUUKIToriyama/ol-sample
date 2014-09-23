var map,
    projMerc = new OpenLayers.Projection('EPSG:900913'),
    proj4326 = new OpenLayers.Projection('EPSG:4326'),
    navigation = new OpenLayers.Control.Navigation(),
    mousePos = new OpenLayers.Control.MousePosition(),
    panZoom = new OpenLayers.Control.PanZoomBar();

// 地図の初期描画
function init() {
  var osm;

  map = new OpenLayers.Map('map', {
    projection: projMerc,
    displayProjection: proj4326,
    eventListener: {},
    controls: [
      navigation,
      mousePos,
      panZoom
    ],
    maxExtent: new OpenLayers.Bounds(-200370508.34, -200370508.34, 200370508.34, 200370508.34),
    maxScale: 27733946.60200078,
    minScale: 1733371.6626250488
  });

  osm = new OpenLayers.Layer.OSM('OSM');
  map.addLayers([osm]);
  jumpTo(139.691706, 35.689487, 1);
}

// 指定位置とズームレベル
function jumpTo(lon, lat, zoom) {
  var lonlat = new OpenLayers.LonLat(lon, lat);
  lonlat.transform(proj4326, projMerc);
  map.setCenter(lonlat, zoom);
}

// 投影法の変換
function changeProjection(point) {
  return point.transform(proj4326, projMerc);
}

// Point生成
function createPoint(lon, lat) {
  return new OpenLayers.Geometry.Point(lon, lat);
}

// 地図上への線描画
function drawFeature() {
  var points = [], line, point, d, i, len,
      RussiaToCanada = [
        { Lon: 105, Lat: 61 },
        { Lon: -106, Lat: 56 }
      ],
      style = {
        strokeColor: '#2E8B57',
        strokeOpacity: 1,
        strokeWidth: 2,
        pointRadius: 1.5
      };

  len = RussiaToCanada.length;
  for (i = 0; i < len ; i += 1) {
    d = RussiaToCanada[i];
    points[i] = OpenLayers.Feature.Vector(changeProjection(createPoint(d.lon, d.lat)), null, style);
  }

  line = new OpenLayers.Feature.Vector(
    new OpenLayers.Geometry.LineString(points), null, style);

  console.log('a');
  var vector = new OpenLayers.Layer.Vector('vector');
  //vector.addFeatures(points);
  vector.addFeatures([line]);

  map.addLayers([vector]);
}
