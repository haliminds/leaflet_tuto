const OVERPASS_API = 'https://z.overpass-api.de/api/interpreter?data=[out:json];node[%22amenity%22=%22bicycle_parking%22]'
const SEARCH_DIST_KM = 0.2
const NUMBER_OF_COMPUTED_PATH = 5

const BICYCLE_PARKING_ICON = L.icon({
  iconUrl: '240px-Parking-bicycle-16.svg.png',
  iconSize:     [32, 32], // size of the icon
});

function showPathToNearestCyclePark(lat_to=null, lon_to=null)
{
    // before showing the map, show a gif
    const htmlString = "<img src=\"loader.gif\" />";
	fillMapInnerHTML(htmlString);

	if (navigator.geolocation) {
		let location_timeout = setTimeout("geolocFail()", 5000);
		let geoOptions = {enableHighAccuracy: false,
                           maximumAge        : 10000,
                           timeout           : 5000
                         };

		navigator.geolocation.getCurrentPosition(function(position) {
			clearTimeout(location_timeout);

			let lat_from = position.coords.latitude;
			let lon_from = position.coords.longitude;

			showPathToNearestCycleParkWithPos(lat_from, lon_from, lat_to, lon_to);
		}, function(error) {
			clearTimeout(location_timeout);
			geolocFail();
		}, geoOptions);
	} else {
		// Fallback for no geolocation
		geolocFail();
	}

}

function fillMapInnerHTML(htmlString)
{
	document.getElementById('map').innerHTML = htmlString;
}

function geolocFail()
{
	fillMapInnerHTML('<br><br>GPS non activé !');
}

function clearMap()
{
    fillMapInnerHTML('');
}

async function showPathToNearestCycleParkWithPos(lat, lon, lat_to=null, lon_to=null)
{
	let macarte = null;
  lat = 45.180246;
  lon = 5.714562;

	const currentPos = [lat,lon]; // current position
	let closestPos = [lat,lon];
	if ((lat_to != null) && (lon_to != null))
	{
		closestPos = [lat_to,lon_to];
	}

	boundingBox = getBoundingBox (currentPos, SEARCH_DIST_KM); // 200m autour de moi

  const overpassUrl = OVERPASS_API + '(' + boundingBox[1] + ','+ boundingBox[0] + ',' + boundingBox[3] + ',' + boundingBox[2] + ');out;';
  let response = await fetch(overpassUrl);
  let osmDataAsJson = await response.json(); // read response body and parse as JSON

  // pas de parking à vélo à 200m à la ronde, ben tant pis !
  if (osmDataAsJson.elements.length == 0)
  {
    const popupTitle = 'Aucun parking à vélo<br>à moins de ' + 1000*SEARCH_DIST_KM + 'm'
    macarte = createEmptyMapWithCurrentPos(macarte, currentPos, popupTitle);
    return;
  }

  urlTabForCycleParkPath = [];

  // on ne garde que les NUMBER_OF_COMPUTED_PATH parkings vélo les plus proches (vol d'oiseau), histoire de ne pas calculer X fois des chemins le plus court.
  shortestParkingNodeDict = {};
  osmDataAsJson.elements.forEach((parkingNode, i) => {
    shortestParkingNodeDict[haversineInMeters(currentPos[0], currentPos[1], parkingNode.lat, parkingNode.lon)] = parkingNode;
  });

  let items = Object.keys(shortestParkingNodeDict).map(function(key) {
    return [key, shortestParkingNodeDict[key]];
  });

  // Sort the array based on the first element
  items.sort(function(first, second) {
    return second[0] - first[0];
  });

  // Create a new array with only the NUMBER_OF_COMPUTED_PATH last items
  listOfShortestParkNode  = [];
  const maxNbOfPark = Math.min(NUMBER_OF_COMPUTED_PATH, items.length);

  items.slice(-maxNbOfPark).forEach(function(parkingNode)
  {urlTabForCycleParkPath.push('https://router.project-osrm.org/route/v1/driving/'+currentPos[1]+','+currentPos[0]+';'+parkingNode[1].lon+','+parkingNode[1].lat+'?geometries=geojson');}
  );

  Promise.all(urlTabForCycleParkPath.map(url =>
  fetch(url)
  .then(checkStatus)
  .then(parseJSON)
  .catch(error => console.log('There was a problem!', error))
  ))
  .then(data => {

    // sort data by distance and get the shortest path
    data.sort(function(a,b){return a.routes[0].distance-b.routes[0].distance})
    const maxDist = data[0].routes[0].distance; // 10 km.
    const nearestPath = horizontalFlip(data[0].routes[0].geometry.coordinates);

    cycleParkPos = nearestPath[nearestPath.length - 1] // the the shortest
    // create empty map
    macarte = createEmptyMapWithCurrentPos(macarte, currentPos)

    const markerCyclePark = L.marker(cycleParkPos, {icon: BICYCLE_PARKING_ICON}).addTo(macarte);
    const CycleParkTitle = 'Distance : '+ maxDist + 'm';
    const offsetPopup = L.point(0, -10);
    markerCyclePark.bindPopup(CycleParkTitle, {'offset':offsetPopup}).openPopup();

    const polylineOptions = {
      color: 'red',
      weight: 4,
      opacity: 0.7
    };

    const polyline = new L.Polyline(nearestPath, polylineOptions);
    macarte.addLayer(polyline);
    // zoom the map to the polyline
    macarte.fitBounds(polyline.getBounds());
    macarte.zoomOut();
  })

}


function createEmptyMapWithCurrentPos(macarte, currentPos, popupTitle='')
{
    clearMap();
	macarte = L.map('map').setView(currentPos, 13);

	// Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut. Nous devons lui préciser où nous souhaitons les récupérer. Ici, openstreetmap.fr
	L.tileLayer('https://a.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
		// Il est toujours bien de laisser le lien vers la source des données
		attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
		minZoom: 1,
		maxZoom: 20
	}).addTo(macarte);

	let marker = L.marker(currentPos).addTo(macarte);
	if (popupTitle.length>0)
	marker.bindPopup(popupTitle).openPopup();
	return macarte;
}

// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------

function checkStatus(response) {
	if (response.ok) {
		return Promise.resolve(response);
		} else {
		return Promise.reject(new Error(response.statusText));
	}
}

/**
* @param {object}
* @return json result
*/
function parseJSON(response) {
	return response.json();
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



/**
* @param {array} array2col - two-dimensional array containing center coords [latitude, longitude]
* @return {array} permut col 0 and col 1 (flip)
*/
function horizontalFlip(array2col)
{
	// Calculate the width and height of the Array
	const w = array2col.length || 0;
	const h = array2col[0] instanceof Array ? array2col[0].length : 0;

	// In case it is a zero matrix, no flip routine needed.
	if(h === 0 || w === 0) { return []; }

	let newArray2col = [];

	for(let i=0; i<w; i++) {
		newArray2col[i] = [];
		for(let j=0; j<h; j++) {
			newArray2col[i][j] = array2col[i][1-j];
		}
	}

	return newArray2col;
}


function haversineInMeters() {
	const radians = Array.prototype.map.call(arguments, function(deg) { return deg/180.0 * Math.PI; });
	const lat1 = radians[0], lon1 = radians[1], lat2 = radians[2], lon2 = radians[3];
	const R = 6372.8; // km
	const dLat = lat2 - lat1;
	const dLon = lon2 - lon1;
	const a = Math.sin(dLat / 2) * Math.sin(dLat /2) + Math.sin(dLon / 2) * Math.sin(dLon /2) * Math.cos(lat1) * Math.cos(lat2);
	const c = 2 * Math.asin(Math.sqrt(a));
	return 1000 * R * c;
}
