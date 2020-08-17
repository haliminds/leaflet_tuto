var map = "";
var LAT = 0;
var LON = 0;

function initialize() {
  if (navigator.geolocation) {
    let location_timeout = setTimeout("fillMapInnerHTML('<br><br>GPS non activé !')", 5000);
    let geoOptions = {
      enableHighAccuracy: false,
      maximumAge: 10000,
      timeout: 5000
    };

    navigator.geolocation.getCurrentPosition(function(position) {
      clearTimeout(location_timeout);

      let lat_pos = position.coords.latitude;
      let lon_pos = position.coords.longitude;

      doIt(lat_pos, lon_pos);


    }, function(error) {
      clearTimeout(location_timeout);
      fillMapInnerHTML('<br><br>GPS non activé !');
    }, geoOptions);
  } else {
    // Fallback for no geolocation
    fillMapInnerHTML('<br><br>GPS non activé !');
  }
}


/**
 * [fillMapInnerHTML description]
 * @param  {[type]} htmlString [description]
 */
function fillMapInnerHTML(htmlString) {
  document.getElementById('map').innerHTML = htmlString;
}


function doIt(lat_pos, lon_pos) {
	
		LAT = lat_pos;
		LON = lon_pos;
	  let stamenToner = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
		attribution: 'Map tiles by Stamen Design, CC BY 3.0 - Map data © OpenStreetMap',
		subdomains: 'abcd',
		minZoom: 10,
		maxZoom: 20,
		ext: 'png'
	  });

	  // clear map and fill it
	  fillMapInnerHTML('');
	  map = new L.Map("map", {
		layers: [stamenToner]
	  });
	  map.setView(L.latLng(lat_pos, lon_pos), zoom = 11)	
	
	let sidebar = L.control
	.sidebar({ container: "sidebar", position: "left" })
	.addTo(map)
	.open("home");
	
	// Add control scale
	let controlscale = L.control.scale({metric : true, imperial : false, position: 'bottomright'}).addTo(map);
}


function addRandomMarker(){
	const radius = 0.1;
	let rnd_lat = Math.random()*radius-radius/2;
	let rnd_lon = Math.random()*radius-radius/2;
	let marker = L.marker([LAT + rnd_lat, LON+rnd_lon]).addTo(map);
}

function handleClick(myRadio){
	console.log(myRadio.id);
}
