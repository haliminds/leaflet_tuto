var markersAmenity = [];
const tabAmenity = [{'amenity':'toilets', 'color':'#FF0000'}];

// cf http://jsfiddle.net/parshin/uLyfqh1f/ pour des markers sur differents layers

async function initialize() {
		var map = L.map("map", {
			zoom: 16,
			center: [45.18, 5.740],
			maxZoom: 20,
			minZoom: 15
		});
		map.zoomControl.setPosition("topleft");
		//map.attributionControl.addAttribution("<a href='https://github.com/frogcat/leaflet-tilelayer-mask'>fork me on GitHub</a>");

		const osmMain = L.layerGroup([L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
			attribution: '<a href="http://maps.gsi.go.jp/development/">GSI Ortho</a>',
			ext: 'png'
		})])
		var mainLayer =  osmMain.addTo(map);

	 await loadAmenity();

	for(let i = 0; i < markersAmenity.length; i++) {
		for(let layerMarker of markersAmenity[i]){
			mainLayer.addLayer(layerMarker);
		}
	}

	let mask = L.tileLayer.mask('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
		maxZoom: 20,
		maskSize: 128,
		attribution: '&copy; Openstreetmap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	map.on("mousemove", function(e) {
		mask.setCenter(e.containerPoint);
	});
}


async function loadAmenity(){
	for (let i in tabAmenity){
		markersAmenity[i] = [];
		let overpassUrl = 'https://lz4.overpass-api.de/api/interpreter?data=[out:json];area(3600080348)->.searchArea;node[amenity='+ tabAmenity[i].amenity +'](area.searchArea);out;';
		let response = await fetch(overpassUrl);
		let osmDataAsJson = await response.json(); // read response body and parse as JSON

		for (let elem of osmDataAsJson.elements)
		{
			let binpopup = tabAmenity[i].amenity;
			let marker = new L.CircleMarker([elem.lat, elem.lon], {radius: 10, fillOpacity: 0.8, color: tabAmenity[i].color}).bindPopup(binpopup);
			markersAmenity[i].push(marker);
		}
	}
}
