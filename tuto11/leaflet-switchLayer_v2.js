MIN_ZOOM = 0
MAX_ZOOM = 25

L.TileLayerZoomSwitch_v2 = L.TileLayer.extend({
  includes: L.Evented,

  options: {
    // switchZoomStart: when zoom > switchZoomStart, use this layer
    switchZoomStart: MIN_ZOOM,
    // switchZoomEnd: when zoom <= switchZoomEnd, use this layer
    switchZoomEnd: MAX_ZOOM,
  },

  getSwitchZoomStart: function() {
    return this.options.switchZoomStart;
  },

  getSwitchZoomEnd: function() {
    return this.options.switchZoomEnd;
  }
});

L.tileLayerZoomSwitch_v2 = function(url, options) {
	if (options.switchZoomStart > options.switchZoomEnd)
	{
  	throw new RangeError( "switchZoomStart cannot be superior to switchZoomEnd");
	}
	return new L.TileLayerZoomSwitch_v2(url, options);

};




/*
 * SwitchLayerManager_v2 is a custom class for managing base layer automatic switching according to the current zoom level
 */

SwitchLayerManager_v2 = L.Class.extend({
  _map: null,
  options: {
    baseLayers: null
  },

  initialize: function(map, options) {
    this._map = map;
    L.Util.setOptions(this, options);
		// verify all zoom
		this._verify_zoom()
    // Update map for the firts time
    this._update()
    // update map for each zoomend
    this._map.on({
      'zoomend': this._update
    }, this)
  },

  _update: function(e) {
    const zoomCurrent = this._map.getZoom();
    for (let i in this.options.baseLayers) {
      const layer = this.options.baseLayers[i];
      const zoomStart = layer.getSwitchZoomStart();
      const zoomEnd = layer.getSwitchZoomEnd();

      if ((zoomCurrent <= zoomEnd) && (zoomCurrent >= zoomStart)) {
        layer.addTo(this._map)
      } else {
        this._map.removeLayer(layer)
      }
    }
  },

	_verify_zoom : function(e){
		let zoom_end_max = 0
		Object.entries(this.options.baseLayers).forEach((item, i) => {
			zoom_end_max = Math.max(zoom_end_max, item[1].options.switchZoomEnd)
		});
		let test_zoom = Array.from({length: zoom_end_max+1}, (v, i) => 0)

		// simplify test_zoom
		for (let i in this.options.baseLayers) {
			const layer = this.options.baseLayers[i];
      const zoomStart = layer.getSwitchZoomStart();
      const zoomEnd = layer.getSwitchZoomEnd();
			for (z=zoomStart;z<=zoomEnd;z++)
			{
				test_zoom[z] += z;
			}
		}

		// verifie si test_zoom est coherent ie pour tout z, test_zoom[z] = z;



	}

});
