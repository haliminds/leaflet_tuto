// Init des vriables de cartes
let map =null;

const mainLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: 'Map tiles by Stamen Design, CC BY 3.0 — Map data © OpenStreetMap',
		subdomains: 'abcd',
		minZoom: 13,
		maxZoom: 20,
		ext: 'png'
	});

// Point d'entrée du JS par le HTML
function initialize() {
 navigator.geolocation.getCurrentPosition(maPosition)
}


function maPosition(position) {
	// récupération de la position actuelle
	let centerPoint = [position.coords.latitude, position.coords.longitude];
	// création de la map et ajout du fond de carte
	map = L.map('map').setView(centerPoint, 13);
	mainLayer.addTo(map);;
	
	
	// ajout du slider pour choisir la taille du rectangle à afficher (en m)
	slider = L.control.slider(value => {
		// on calcule la boundingbox autour de centerpoint (distance en km)
		const bbox = getBoundingBox(centerPoint, value/1000);
		// inversion des lat/lon pour leaflet
		let bounds = [[bbox[1], bbox[0]], [bbox[3], bbox[2]]];
		// on dessine le rectangle et le marker
		drawRectangle(centerPoint, bounds)
  }, {
    min: 100,
    max: 500,
    value: 250,
    step: 50,
    size: '250px',
    orientation: 'vertical',
    id: 'slider',
    position: 'topleft',
  }).addTo(map);
 
}


/**
* @param {array} bounds
* @description Draw a rectangle and marker on map
*/
function drawRectangle(centerPoint, bounds) {
	// delete all layer except mainLayer
	map.eachLayer((layer) => {
		if (layer._leaflet_id != mainLayer._leaflet_id) {
			map.removeLayer(layer);
		}
	});
	
	// add rectangle + marker
	L.rectangle(bounds, {color: 'blue', weight: 1}).addTo(map);		
	L.marker(centerPoint).addTo(map);
}


/**
 * @param {array} centerPoint - two-dimensional array containing center coords [latitude, longitude]
 * @param {number} distance - distance (km) from the point represented by centerPoint
 * @description
 *   Computes the bounding coordinates of all points on the surface of a sphere
 *   that has a great circle distance to the point represented by the centerPoint
 *   argument that is less or equal to the distance argument.
 *   Technique from: Jan Matuschek <http://JanMatuschek.de/LatitudeLongitudeBoundingCoordinates>
 * @author Alex Salisbury
 */
function getBoundingBox(centerPoint, distance) {
	let minLat, maxLat, minLon, maxLon, deltaLon;
	if (distance < 0) {
		return 'Illegal arguments';
	}
	// helper functions (degrees<–>radians)
	Number.prototype.degToRad = function () {
		return this * (Math.PI / 180);
	};
	Number.prototype.radToDeg = function () {
		return (180 * this) / Math.PI;
	};
	// coordinate limits
	const MIN_LAT = (-90).degToRad();
	const MAX_LAT = (90).degToRad();
	const MIN_LON = (-180).degToRad();
	const MAX_LON = (180).degToRad();
	// Earth's radius (km)
	const R = 6378.1;
	// angular distance in radians on a great circle
	const radDist = distance / R;
	// center point coordinates (deg)
	const degLat = centerPoint[0];
	const degLon = centerPoint[1];
	// center point coordinates (rad)
	const radLat = degLat.degToRad();
	const radLon = degLon.degToRad();
	// minimum and maximum latitudes for given distance
	minLat = radLat - radDist;
	maxLat = radLat + radDist;
	// minimum and maximum longitudes for given distance
	minLon = void 0;
	maxLon = void 0;
	// define deltaLon to help determine min and max longitudes
	deltaLon = Math.asin(Math.sin(radDist) / Math.cos(radLat));
	if (minLat > MIN_LAT && maxLat < MAX_LAT) {
		minLon = radLon - deltaLon;
		maxLon = radLon + deltaLon;
		if (minLon < MIN_LON) {
			minLon = minLon + 2 * Math.PI;
		}
		if (maxLon > MAX_LON) {
			maxLon = maxLon - 2 * Math.PI;
		}
	}
	// a pole is within the given distance
	else {
		minLat = Math.max(minLat, MIN_LAT);
		maxLat = Math.min(maxLat, MAX_LAT);
		minLon = MIN_LON;
		maxLon = MAX_LON;
	}
	return [
    minLon.radToDeg(),
    minLat.radToDeg(),
    maxLon.radToDeg(),
    maxLat.radToDeg()
  ];
};