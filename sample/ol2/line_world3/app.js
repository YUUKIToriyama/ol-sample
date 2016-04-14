(function ($) {
  // Latitude Longitude
  var plot_data = [
    { EW: 'E', NS: 'S', Longitude: 135.17830, Latitude: 34.67822 }, // 神戸
    { EW: 'E', NS: 'S', Longitude: 139.6582,  Latitude: 35.6751  },
    { EW: 'E', NS: 'S', Longitude: 155.6542,  Latitude: 50.2893  },
    { EW: 'E', NS: 'S', Longitude: 166.6424,  Latitude: 54.2893  },
    { EW: 'E', NS: 'S', Longitude: 176.5433,  Latitude: 58.2334  },
    { EW: 'W', NS: 'S', Longitude: -178.5433, Latitude: 58.2334  },
    { EW: 'W', NS: 'S', Longitude: -119.8090, Latitude: 58.28    },
    { EW: 'W', NS: 'S', Longitude: -77.534,   Latitude: 36.4344  },
    { EW: 'W', NS: 'S', Longitude: -40.0834,  Latitude: 46.823   },
    { EW: 'W', NS: 'S', Longitude: -4.0843,   Latitude: 51.943   },
    { EW: 'E', NS: 'S', Longitude: 17.0234,   Latitude: 64.2444  },
    { EW: 'E', NS: 'S', Longitude: 84.0234,   Latitude: 61.7243  },
    { EW: 'E', NS: 'S', Longitude: 104.3443,  Latitude: 44.3434  },
    { EW: 'E', NS: 'S', Longitude: 121.9923,  Latitude: 14.0943  },
    { EW: 'E', NS: 'S', Longitude: 135.17830, Latitude: 34.67822 } // 神戸に
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
      this.olmap.setCenter(lonlat.transform(this.proj4326, this.projMerc), 2);
    },

    /**
     * 投影法の変換
     * @param {Object} lonlat
     */
    transformPoint: function (lonlat) {
      return lonlat.transform(this.proj4326, this.olmap.getProjectionObject());
    },

    /**
     * Point生成
     * @param {Number} lon
     * @param {Number} lat
     */
    createPoint: function (lon, lat) {
      return new OpenLayers.Geometry.Point(lon, lat);
    },

    /**
     * レイヤ−削除
     */
    removeLayer: function () {
      var layers = this.olmap.getLayersByName('point_layer')
                    .concat(this.olmap.getLayersByName('line_layer'));

      layers.forEach(function (layer) {
        this.olmap.removeLayer(layer);
      }.bind(this));
    },


    /**
     * 線を描画する
     */
    plot: function () {
      var points = [];
      var line_data = [];
      var lines = [];

      $.each(plot_data, function (key, val) {
        var point = this.transformPoint(this.createPoint(val.Longitude, val.Latitude));
        var next = null;

        // 線を引くためのGeometry.Pointの配列を作る
        line_data.push(point);

        if (key < plot_data.length - 1) {
          next = plot_data[key + 1];
        }


        if (next !== null) {
          var y = calcIntersection(val.Longitude, val.Latitude, next.Longitude, next.Latitude, val.EW);

          // 東経→西経
          if (val.EW === 'E' && next.EW === 'W') {
            line_data.push(this.transformPoint(this.createPoint(180, y))); // 180, 求めたyのポイント生成
            // 一旦ここで線にする
            lines.push(new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(line_data), null, this.feature_style));
            line_data = []; // 配列を空に
            line_data.push(this.transformPoint(this.createPoint(-180, y))); // -180と求めたyのポイントから次のデータは始める

          } else if (val.EW === 'W' && next.EW === 'E') {
            line_data.push(this.transformPoint(this.createPoint(0, y))); // 0, 求めたyのポイント生成
            // 一旦ここで線にする
            lines.push(new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(line_data), null, this.feature_style));
            line_data = [];

            line_data.push(this.transformPoint(this.createPoint(0, y))); // 0と求めたyのポイントから次のデータは始める
          }
        }

        // 点を描画するため、Vector化
        points.push(new OpenLayers.Feature.Vector(point, null, this.feature_style));

      }.bind(this));

      // 余りが出るので残りで線を作る
      lines.push(new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(line_data), null, this.feature_style));

      var point_layer = new OpenLayers.Layer.Vector('point_layer', null);
      var line_layer = new OpenLayers.Layer.Vector('line_layer', null);

      // レイヤーにFeatureを追加
      point_layer.addFeatures(points);
      line_layer.addFeatures(lines);

      // 作成したVector Layersをolmapに追加
      this.olmap.addLayers([line_layer, point_layer]);
    }
  };

  function calcIntersection(x1, y1, x2, y2, ew) {
    var x, y, a, b;

    // 東経→西経に超える場合
    if (ew === 'E') {
      // 今回は180度線でのみ... 実際は0度か180度かの判定が必要
      x = 180;
      a = (y2 - y1) / (x2 - x1);
      b = y1 - a * x1;
      y = a * x + b;
    // 西経→東経に超える場合
    } else {
      // 今回は0度のみ
      a = (y2 - y1) / (x2 - x1);
      b = y1 - a * x1;
      y = b;
    }
    return y;
  }

  $(function () {
    Map.init();
  });

  $(window).load(function () {
    Map.render('olmap');
  });

  
}(jQuery));
