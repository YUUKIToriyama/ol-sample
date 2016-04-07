(function ($) {
  // Latitude Longitude
  var plot_data = [
    { Longitude: 135.17830, Latitude: 34.67822 }, // 神戸
    { Longitude: 135.18688, Latitude: 34.69029 }, // 元町
    { Longitude: 135.19324, Latitude: 34.69227 }  // 三ノ宮
  ];

  var Map = {

    init: function () {
      this.olmap = null;

      // 投影法
      this.projMerc = new OpenLayers.Projection('EPSG:3857');
      this.proj4326 = new OpenLayers.Projection('EPSG:4326');

      // FeatureStyle
      this.feature_style = {
        fillColor: '#98FB98',
        fillOpacity: 0.8,
        strokeColor: '#3CB371',
        strokeWidth: 2,
        pointRadius: 6
      };

      this.$plot_btn = $('#plot-btn');
      this.$remove_btn = $('#remove-btn');

      this.events();
    },

    events: function () {
      this.$plot_btn.on('click', this.plot.bind(this));
      this.$remove_btn.on('click', this.removeLayer.bind(this));
    },

    /**
     * 地図の表示
     * @param {String} id_name 地図を描画する要素のID
     */
    render: function (id_name) {
      // レイヤー
      var layers = [
        // OpenStreetMap
        new OpenLayers.Layer.OSM('osm', null, {
          displayInLayerSwitcher: true
        })
        // 他にも追加したい場合は追加していく
      ];

      // コントロール
      var controls = [
        new OpenLayers.Control.Navigation(),
        new OpenLayers.Control.PanZoomBar(),
        new OpenLayers.Control.LayerSwitcher(),
        new OpenLayers.Control.MousePosition()
      ];

      // 描画
      this.olmap = new OpenLayers.Map(id_name, {
        projection: this.projMerc,
        displayProjection: this.proj4326,
        controls: controls,
        layers: layers,
        units: 'm'
      });

      // 地図の中心を移動
      var lonlat = new OpenLayers.LonLat(135.188, 34.685);
      this.olmap.setCenter(lonlat.transform(this.proj4326, this.projMerc), 14);
    },

    /**
     * 投影法の変換
     * @param {Object} lonlat
     */
    transformPoint(lonlat) {
      return lonlat.transform(this.proj4326, this.olmap.getProjectionObject());
    },

    /**
     * Point生成
     * @param {Number} lon
     * @param {Number} lat
     */
    createPoint(lon, lat) {
      return new OpenLayers.Geometry.Point(lon, lat);
    },

    /**
     * レイヤ−削除
     */
    removeLayer() {
      var layers = this.olmap.getLayersByName('point_layer')
                    .concat(this.olmap.getLayersByName('line_layer'));

      layers.forEach(function (layer) {
        this.olmap.removeLayer(layer);
      }.bind(this));
    },


    /**
     * 線を描画する
     */
    plot() {
      var points = [];
      var line_data = [];

      $.each(plot_data, function (key, val) {
        var point = this.transformPoint(this.createPoint(val.Longitude, val.Latitude));

        // 線を引くためのGeometry.Pointの配列を作る
        line_data.push(point);

        // 点を描画するため、Vector化
        points.push(new OpenLayers.Feature.Vector(point, null, this.feature_style));

      }.bind(this));

      // 線を作る
      var line = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(line_data), null, this.feature_style);

      var point_layer = new OpenLayers.Layer.Vector('point_layer', null);
      var line_layer = new OpenLayers.Layer.Vector('line_layer', null);

      // レイヤーにFeatureを追加
      point_layer.addFeatures(points)
      line_layer.addFeatures([line]);

      // 作成したVector Layersをolmapに追加
      this.olmap.addLayers([line_layer, point_layer]);
    }
  };

  $(function () {
    Map.init();
  });

  $(window).load(function () {
    Map.render('olmap');
  });

}(jQuery));
