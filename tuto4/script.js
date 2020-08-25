var markersAmenity = [];
const tabAmenity = [{'amenity':'toilets', 'color':'#FF0000'}];

// cf http://jsfiddle.net/parshin/uLyfqh1f/ pour des markers sur differents layers

async function initialize() {
		var map = L.map("map", {
			zoom: 16,
			center: [45.18, 5.740],
			maxZoom: 18,
			minZoom: 15
		});
		map.zoomControl.setPosition("bottomright");
		map.attributionControl.addAttribution("<a href='https://github.com/frogcat/leaflet-tilelayer-mask'>fork me on GitHub</a>");
		var mainLayer = L.layerGroup([L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
			attribution: '<a href="http://maps.gsi.go.jp/development/">GSI Ortho</a>',
			ext: 'png'
		})]).addTo(map);


		var mask = L.tileLayer.mask('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '<a href="http://habs.dc.affrc.go.jp/">NIAES, NARO</a>',
			maskSize: 128,
			maxZoom: 18,
			maxNativeZoom: 17
		}).addTo(map);

		map.on("mousemove", function(e) {
			mask.setCenter(e.containerPoint);
		});


	await loadAmenity();

	for(let i = 0; i < markersAmenity.length; i++) {
		for(let layerMarker of markersAmenity[i]){
			mainLayer.addLayer(layerMarker);
		}
	}


}


async function loadAmenity(){
	for (let i in tabAmenity){
		markersAmenity[i] = [];
		let overpassUrl = 'https://lz4.overpass-api.de/api/interpreter?data=[out:json];area(3600080348)->.searchArea;node[amenity='+ tabAmenity[i].amenity +'](area.searchArea);out;';
		let response = await fetch(overpassUrl);
		let osmDataAsJson = await response.json(); // read response body and parse as JSON

		for (let elem of osmDataAsJson.elements)
		{
			let binpopup = tabAmenity[i].amenity.split('=')[1];
			let marker = new L.CircleMarker([elem.lat, elem.lon], {radius: 10, fillOpacity: 0.8, color: tabAmenity[i].color}).bindPopup(binpopup);
			marker.l = i;
			markersAmenity[i].push(marker);
		}
	}
}
