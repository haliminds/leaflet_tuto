// Based on https://www.datavis.fr/index.php?page=leaflet-cluster
function initialize()
{
	// mapping de la carte au div map et definition de la position et du zoom
	var map = L.map('map').setView([45.18, 5.74], 13);
	var osm1 = L.layerGroup([L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png')]);
	var osm2 = L.layerGroup([L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png')]);

	var currentBaseLayer =  osm1.addTo(map);

	map.on('click', function(e) {
	    currentBaseLayer.addLayer(L.marker(e.latlng));
	}).on('baselayerchange', function(e) {
	   	currentBaseLayer = e.layer;
	})

	L.control.layers({osm1: osm1, osm2: osm2}, null, {collapsed: false}).addTo(map)

}
