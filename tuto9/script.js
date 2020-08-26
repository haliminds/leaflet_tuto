var markersAmenity = [];
const tabAmenity = [{'amenity':'waste_basket', 'color':'#FF0000'}, {'amenity':'bicycle_parking', 'color':'#0000FF'}, {'amenity':'bench', 'color':'#00FF00'}];

async function initialize() {
	let map = L.map('map', {
		center: [45.18, 5.740],
		maxZoom: 20,
		zoom: 13,
		zoomControl: false
	});
	L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

	await loadAmenity();

	markersAmenity.forEach(marker => {
		var cluster = new L.MarkerClusterGroup({
			iconCreateFunction: function(cl) {
				let layer = cl.getAllChildMarkers()[0].l;
				return new L.DivIcon({ html: '<div class="cluster layer'+layer+'">' + cl.getChildCount() + '</div>' });
			},
			maxClusterRadius: 50
		});
		marker.forEach(layerMarker => {
			cluster.addLayer(layerMarker);
		});
		map.addLayer(cluster);
	});
}


async function loadAmenity(){
	// cannot simply use await in forEach loop so use classical loop instead
	for (let i in tabAmenity){
		markersAmenity[i] = [];
		const overpassUrl = 'https://lz4.overpass-api.de/api/interpreter?data=[out:json];area(3600080348)->.searchArea;node[amenity='+ tabAmenity[i].amenity +'](area.searchArea);out;';
		const response = await fetch(overpassUrl);
		const osmDataAsJson = await response.json(); // read response body and parse as JSON

		osmDataAsJson.elements.forEach(elem => {
			const binpopup = tabAmenity[i].amenity.split('=')[1];
			let marker = new L.CircleMarker([elem.lat, elem.lon], {radius: 10, fillOpacity: 0.8, color: tabAmenity[i].color}).bindPopup(binpopup);
			marker.l = i;
			markersAmenity[i].push(marker);
		});
	}
}
