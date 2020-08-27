// Based on https://www.datavis.fr/index.php?page=leaflet-choroplethe
function initialize() {

  const map = L.map('map').setView([45.18, 5.74], 13);
  L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  slider = L.control.slider(function(value) {
    console.log(value);
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
