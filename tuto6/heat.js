// Based on https://www.datavis.fr/index.php?page=leaflet-cluster
function initialize()
{
	var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
	});

	var map = L.map("map").setView([40.90296, 1.90925], 2);

	let stamen = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		subdomains: 'abcd',
		minZoom: 1,
		maxZoom: 20,
		ext: 'png'
	});
	
	map.addControl(L.control.basemaps({
		basemaps: [Esri_WorldImagery, stamen]
	}));

	var heatMapData = [];
	// chargement du geojson enregistre dans la variable eqs
	eqs.features.forEach(function(d) {
		heatMapData.push(new L.latLng(
			+d.geometry.coordinates[1], 
			+d.geometry.coordinates[0],
			+d.properties.title.substring(2, 5)));
	});

	var heatLayer = L.heatLayer(heatMapData, {maxZoom: 12});
	map.addLayer(heatLayer);

	
}