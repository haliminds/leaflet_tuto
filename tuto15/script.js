
function initialize() {

  const map = L.map('map').setView([45.18, 5.74], 17);
  L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
    // Il est toujours bien de laisser le lien vers la source des données
    attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
    minZoom: 1,
    maxZoom: 20
  }).addTo(map);


  let marker = L.marker(map.getCenter()).addTo(map);

  map.on('drag', function(e) {
        marker.setLatLng(map.getCenter());
  });
  map.on('zoom', function(e) {
        marker.setLatLng(map.getCenter());
  });

  L.easyButton('<img class="valid_button" src="validation.svg" >', (btn, map) => {
      console.log(map.getCenter())
  }).addTo( map )

}
