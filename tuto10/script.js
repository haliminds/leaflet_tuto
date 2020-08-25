var map=null
var marker = null

function initialize() {
	navigator.geolocation.getCurrentPosition(maPosition)
	var survId = navigator.geolocation.watchPosition(surveillePosition, erreurPosition, {maximumAge:1000,enableHighAccuracy:true});
}

function erreurPosition(error) {
    var info = "Erreur lors de la géolocalisation : ";
    switch(error.code) {
    case error.TIMEOUT:
    	info += "Timeout !";
    break;
    case error.PERMISSION_DENIED:
	info += "Vous n’avez pas donné la permission";
    break;
    case error.POSITION_UNAVAILABLE:
    	info += "La position n’a pu être déterminée";
    break;
    case error.UNKNOWN_ERROR:
    	info += "Erreur inconnue";
    break;
    }
}


function maPosition(position) {
	map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 13);
	var stamenToner = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
		attribution: 'Map tiles by Stamen Design, CC BY 3.0 — Map data © OpenStreetMap',
		subdomains: 'abcd',
		minZoom: 13,
		maxZoom: 20,
		ext: 'png'
	});
	// ajout du layer a la carte
	map.addLayer(stamenToner);
	marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
}

// Fonction de callback en cas de succès
function surveillePosition(position) {
	marker.setLatLng([position.coords.latitude, position.coords.longitude]);
	map.panTo([position.coords.latitude, position.coords.longitude]);
}
