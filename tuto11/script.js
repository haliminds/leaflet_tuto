function initialize() {
  // center on Grenoble
  map = L.map('map').setView([45.18, 5.740], 13);
	const osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	const osmAttrib='Map data © openstreetmap contributors';
	const cmUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png';
	const cmAttrib = 'Map tiles by Stamen Design, CC BY 3.0 — Map data © OpenStreetMap'
	const opentopoUrl='https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
	const opentopoAttrib = 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'

	cloudmade = new L.TileLayerZoomSwitch_v2(cmUrl, {attribution: cmAttrib, switchZoomEnd: 12} );                          // 0 to 12
	osm = new L.TileLayerZoomSwitch_v2(osmUrl,{switchZoomStart: 13, switchZoomEnd: 13, attribution:osmAttrib});            // 13
	testmade = new L.TileLayerZoomSwitch_v2(cmUrl, {attribution: cmAttrib, switchZoomStart: 14, switchZoomEnd: 15} );      // 14 to 15
	opentopo = new L.TileLayerZoomSwitch_v2(opentopoUrl, {maxZoom:17, attribution: opentopoAttrib, switchZoomStart: 16} ); // 16 et +


	const baseLayers = {
	    "Cloudmade": cloudmade,
	    "Osm": osm,
			"testmade" : testmade,
			"opentopo" : opentopo
	};
	switchManager = new SwitchLayerManager_v2(map, {baseLayers: baseLayers});
}
