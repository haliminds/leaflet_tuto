function initialize() {
	var map = L.map('map').setView([48.833, 2.333], 7); // LIGNE 18

	var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { // LIGNE 20
		attribution: '© OpenStreetMap contributors',
		maxZoom: 19
	});

	//map.addLayer(osmLayer);

	let stamen = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		subdomains: 'abcd',
		minZoom: 4,
		maxZoom: 20,
		ext: 'png'
	});
	
	map.addControl(L.control.basemaps({
		basemaps: [osmLayer, stamen],
		tileX: 8,  // Coordonnée X de la prévisualisation
		tileY: 4,  // Coordonnée Y de la prévisualisation
		tileZ: 5   // Niveau de zoom de la prévisualisation
	}));	

// ajout marqueur
var customIcon = L.icon({
    iconUrl: 'map-icon/residential-places.png',
    //shadowUrl: 'icon-shadow.png',
    iconSize:     [33, 44], // taille de l'icone
    //shadowSize:   [50, 64], // taille de l'ombre
    iconAnchor:   [16, 44], // point de l'icone qui correspondra à la position du marker
    //shadowAnchor: [32, 64],  // idem pour l'ombre
    popupAnchor:  [-3, -76] // point depuis lequel la popup doit s'ouvrir relativement à l'iconAnchor
});

L.marker([48.5, 0.5], {icon: customIcon}).addTo(map);
// ajout autre marqueur	
L.marker([48.5, 2]).addTo(map)
    .bindTooltip("Les Granges-le-Roi", {permanent: true, direction: 'top'});	
	
}