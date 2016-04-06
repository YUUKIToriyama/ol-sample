(function ($) {

  var Map = {

    init: function () {
      this.olmap = null;

      // 投影法
      this.projMerc = new OpenLayers.Projection('EPSG:3857');
      this.proj4326 = new OpenLayers.Projection('EPSG:4326');
    },

    /**
     * 描画
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
      var lonlat = new OpenLayers.LonLat(135, 35);
      this.olmap.setCenter(lonlat.transform(this.proj4326, this.projMerc), 4);
    },

    /**
     * 線を描画する
     */
    plot() {
      $.ajax({
        type: 'GET',
        dataType: 'JSON',
        url: '../json/position.json'
      })
      .done(function (list) {

        // この辺りを...



      }.bind(this));
    }
  };

  $(function () {
    Map.init();
  });

  $(window).load(function () {
    Map.render('olmap');
  });

}(jQuery));
