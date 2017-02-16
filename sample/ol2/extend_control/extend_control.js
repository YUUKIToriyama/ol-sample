OpenLayers.Control.LayerSwitcher.prototype.loadContents = function () {
  this.layersDiv = document.createElement("div");
  this.layersDiv.id = this.id + "_layersDiv";
  OpenLayers.Element.addClass(this.layersDiv, "layersDiv");

  this.baseLbl = document.createElement("div");
  this.baseLbl.innerHTML = OpenLayers.i18n("Base");
  OpenLayers.Element.addClass(this.baseLbl, "baseLbl");

  this.baseLayersDiv = document.createElement("div");
  OpenLayers.Element.addClass(this.baseLayersDiv, "baseLayersDiv");

  this.dataLbl = document.createElement("div");
  this.dataLbl.innerHTML = OpenLayers.i18n("Layers");
  OpenLayers.Element.addClass(this.dataLbl, "dataLbl");

  this.dataLayersDiv = document.createElement("div");
  OpenLayers.Element.addClass(this.dataLayersDiv, "dataLayersDiv");

  if (this.ascending) {
    this.layersDiv.appendChild(this.baseLbl);
    this.layersDiv.appendChild(this.baseLayersDiv);
    this.layersDiv.appendChild(this.dataLbl);
    this.layersDiv.appendChild(this.dataLayersDiv);
  } else {
    this.layersDiv.appendChild(this.dataLbl);
    this.layersDiv.appendChild(this.dataLayersDiv);
    this.layersDiv.appendChild(this.baseLbl);
    this.layersDiv.appendChild(this.baseLayersDiv);
  }

  this.div.appendChild(this.layersDiv);

  var img = OpenLayers.Util.getImageLocation('layer-switcher-maximize.png');
  this.maximizeDiv = OpenLayers.Util.createAlphaImageDiv(
    "OpenLayers_Control_MaximizeDiv",
    null,
    null,
    img,
    "absolute");
  OpenLayers.Element.addClass(this.maximizeDiv, "maximizeDiv olButton");
  this.maximizeDiv.style.display = "none";

  this.div.appendChild(this.maximizeDiv);

  var img = OpenLayers.Util.getImageLocation('layer-switcher-minimize.png');
  this.minimizeDiv = OpenLayers.Util.createAlphaImageDiv(
    "OpenLayers_Control_MinimizeDiv",
    null,
    null,
    img,
    "absolute");
  OpenLayers.Element.addClass(this.minimizeDiv, "minimizeDiv olButton");
  this.minimizeDiv.style.display = "none";

  this.div.appendChild(this.minimizeDiv); 
};

OpenLayers.Control.LayerSwitcher.prototype.draw = function () {
  OpenLayers.Control.prototype.draw.apply(this);

  this.loadContents();
  // 追加で呼ぶ
  this.loadColorSelection();

  if(! this.outsideViewport) {
    this.minimizeControl();
  }

  this.redraw();

  return this.div;
};

OpenLayers.Control.LayerSwitcher.prototype.onButtonClick = function (evt) {
  var button = evt.buttonElement;
  if (button === this.minimizeDiv) {
    this.minimizeControl();
  } else if (button === this.maximizeDiv) {
    this.maximizeControl();
  } else if (button._layerSwitcher === this.id) {
    if (button["for"]) {
      button = document.getElementById(button["for"]);
    }
    if (! button.disabled) {
      if (button.type == "radio") {
        button.checked = true;

        if (button.hasOwnProperty('_layer')) {
          this.map.setBaseLayer(this.map.getLayer(button._layer));
        } else {
          this.colorSelectionControl(button.value);
        }
      } else {
        button.checked = !button.checked;
        this.updateMap();
      }
    }
  }
};

OpenLayers.Control.LayerSwitcher.prototype.loadColorSelection = function () {
  this.colorSelectionLbl = document.createElement('div');
  this.colorSelectionLbl.innerHTML = OpenLayers.i18n('Color');
  OpenLayers.Element.addClass(this.colorSelectionLbl, 'colorSelectionLbl');

  this.colorSelectionDiv = document.createElement('div');
  this.colorSelectionDiv.style = 'padding-left: 10px';
  OpenLayers.Element.addClass(this.colorSelectionDiv, 'colorSelectionDiv');

  var colors = [{
    name: 'red',
    code: '#ff0000'
  }, {
    name: 'green',
    code: '#00ff00'
  }, {
    name: 'blue',
    code: '#0000ff'
  }];

  for (var i = 0, len = colors.length; i < len; i++) {
    var inputElem = document.createElement('input');
    var inputId   = OpenLayers.Util.createUniqueID(this.id + '_input_');

    inputElem.id = inputId;
    inputElem.name = this.id + '_colorSelection';
    inputElem.type = 'radio';
    inputElem.value = colors[i].code;
    inputElem.className = 'olButton';
    inputElem._layerSwitcher = this.id;

    var labelSpan = document.createElement('label');
    labelSpan['for'] = inputElem.id;
    OpenLayers.Element.addClass(labelSpan, 'labelSpan olButton');
    labelSpan._layerSwitcher = this.id;
    labelSpan.innerHTML = colors[i].name;

    var br = document.createElement('br');

    this.colorSelectionDiv.appendChild(inputElem);
    this.colorSelectionDiv.appendChild(labelSpan);
    this.colorSelectionDiv.appendChild(br);
  }

  this.layersDiv.appendChild(this.colorSelectionLbl);
  this.layersDiv.appendChild(this.colorSelectionDiv);

  return this.div;
};

OpenLayers.Control.LayerSwitcher.prototype.colorSelectionControl = function (code) {
  var layer = this.map.getLayersByName('line_layer')[0];
  layer.features.forEach(function (feature) {
    feature.style.strokeColor = code;
  });
  layer.redraw();
};


OpenLayers.Control.LayerSwitcher.prototype.colorSelectionDiv = null;
OpenLayers.Control.LayerSwitcher.prototype.colorSelectionLbl = null;
