// Based on https://www.datavis.fr/index.php?page=leaflet-cluster
function initialize() {
  // mapping de la carte au div map et definition de la position et du zoom
  let map = L.map('map').setView([46.90296, 1.90925], 6);
  // creation du layer
  const stamenToner = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by Stamen Design, CC BY 3.0 — Map data © OpenStreetMap',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  });
  // ajout du layer a la carte
  map.addLayer(stamenToner);

  // creation d'un cluster group personnalisé
  let markersCluster = new L.MarkerClusterGroup({
    iconCreateFunction: function(cluster) {
      const digits = (cluster.getChildCount() + '').length; // recupere le nombre de child du cluster et regarde la taille du chiffre (1 ou 2 digits)
      return L.divIcon({
        html: cluster.getChildCount(), // affiche le nombre de child
        className: 'cluster digits-' + digits, // le css depend du nombre de digits et sont tous de la classe cluster
        iconSize: null // pour que le css se demerde tout seul sur la taille des icones
      });
    }
  });

  // recuperation de ville
  const cities = getCities();
  // ajout des villes dans le marker group

  cities.forEach(city => {
    const latLng = new L.LatLng(city[1], city[2]);
    const marker = new L.Marker(latLng, {title: city[0]});
    //marker.bindPopup(cities[i][0]);
    markersCluster.addLayer(marker);
  });

  // ajout du marker group dans le layer
  map.addLayer(markersCluster);

}


function getCities() {
  return [
    ['01110 - HAUTEVILLE-LOMPNES', 45.966667, 5.6],
    ['01110 - HOSTIAZ', 45.9, 5.533333],
    ['01250 - HAUTECOURT-ROMANECHE', 46.158333, 5.416667],
    ['01260 - HOTONNES', 46, 5.683333],
    ['02100 - HARLY', 49.833333, 3.316667],
    ['02120 - HAUTEVILLE', 49.866667, 3.516667],
    ['02140 - HARCIGNY', 49.8, 3.983333],
    ['02140 - HARY', 49.783333, 3.933333],
    ['02140 - HAUTION', 49.85, 3.833333],
    ['02140 - HOURY', 49.783333, 3.85],
    ['02210 - HARTENNES-ET-TAUX', 49.266667, 3.35],
    ['02250 - HOUSSET', 49.783333, 3.7],
    ['02440 - HINACOURT', 49.733333, 3.283333],
    ['02480 - HAPPENCOURT', 49.783333, 3.183333],
    ['02500 - HIRSON', 49.916667, 4.083333],
    ['02510 - HANNAPES', 49.966667, 3.616667],
    ['02600 - HARAMONT', 49.283333, 3.05],
    ['02720 - HOMBLIERES', 49.85, 3.366667],
    ['02760 - HOLNON', 49.866667, 3.216667],
    ['02810 - HAUTEVESNES', 49.116667, 3.233333],
    ['03190 - HERISSON', 46.516667, 2.716667],
    ['03270 - HAUTERIVE', 46.083333, 3.45],
    ['03380 - HURIEL', 46.366667, 2.483333],
    ['03600 - HYDS', 46.283333, 2.833333],
    ['08090 - HAM-LES-MOINES', 49.8, 4.6],
    ['08090 - HAUDRECY', 49.783333, 4.616667],
    ['08090 - HOULDIZY', 49.816667, 4.666667],
    ['08150 - HARCY', 49.833333, 4.566667],
    ['08160 - HANNOGNE-ST-MARTIN', 49.666667, 4.833333],
    ['08170 - HARGNIES', 50.016667, 4.783333],
    ['08220 - HANNOGNE-ST-REMY', 49.6, 4.133333],
    ['08260 - HAVYS', 49.8, 4.4],
    ['08290 - HANNAPPES', 49.816667, 4.216667],
    ['08310 - HAUVINE', 49.3, 4.4],
    ['08320 - HIERGES', 50.1, 4.74115],
    ['08360 - HERPY-L ARLESIENNE', 49.516667, 4.216667],
    ['08370 - HERBEUVAL', 49.6, 5.333333],
    ['08430 - HAGNICOURT', 49.616667, 4.566667],
    ['08450 - HARAUCOURT', 49.616667, 4.966667],
    ['08600 - HAM-SUR-MEUSE', 50.116667, 4.783333],
    ['08800 - HAULME', 49.866667, 4.783333],
    ['10500 - HAMPIGNY', 48.45, 4.6],
    ['10700 - HERBISSE', 48.616667, 4.116667],
    ['11200 - HOMPS', 43.266667, 2.716667],
    ['11240 - HOUNOUX', 43.116667, 2],
    ['12460 - HUPARLAC', 44.7, 2.783333],
    ['14100 - HERMIVAL-LES-VAUX', 49.166667, 0.283333],
    ['14140 - HEURTEVENT', 48.983333, 0.133333],
    ['14170 - HIEVILLE', 49.016667, -0.016667],
    ['14200 - HEROUVILLE-ST-CLAIR', 49.2, -0.316667],
    ['14201 - HEROUVILLE-ST-CLAIR-CEDEX', 49.2, -0.316667],
    ['14202 - HEROUVILLE-ST-CLAIR-CEDEX', 49.2, -0.316667],
    ['14203 - HEROUVILLE-ST-CLAIR-CEDEX', 49.2, -0.316667],
    ['14204 - HEROUVILLE-ST-CLAIR-CEDEX', 49.2, -0.316667],
    ['14205 - HEROUVILLE-ST-CLAIR-CEDEX', 49.2, -0.316667],
    ['14206 - HEROUVILLE-ST-CLAIR-CEDEX', 49.2, -0.316667],
    ['14207 - HEROUVILLE-ST-CLAIR-CEDEX', 49.2, -0.316667],
    ['14208 - HEROUVILLE-ST-CLAIR-CEDEX', 49.2, -0.316667],
    ['14209 - HEROUVILLE-ST-CLAIR-CEDEX', 49.2, -0.316667],
    ['14220 - HAMARS', 49, -0.55],
    ['14250 - HOTTOT-LES-BAGUES', 49.15, -0.65],
    ['14430 - HOTOT-EN-AUGE', 49.166667, -0.05],
    ['14510 - HOULGATE', 49.3, -0.066667],
    ['14520 - HUPPAIN', 49.35, -0.766667],
    ['14540 - HUBERT-FOLIE', 49.133333, -0.316667],
    ['14600 - HONFLEUR', 49.416667, 0.233333],
    ['14601 - HONFLEUR-CEDEX', 49.416667, 0.233333],
    ['14602 - HONFLEUR-CEDEX', 49.416667, 0.233333],
    ['14603 - HONFLEUR-CEDEX', 49.416667, 0.233333],
    ['14604 - HONFLEUR-CEDEX', 49.416667, 0.233333],
    ['14605 - HONFLEUR-CEDEX', 49.416667, 0.233333],
    ['14606 - HONFLEUR-CEDEX', 49.416667, 0.233333],
    ['14607 - HONFLEUR-CEDEX', 49.416667, 0.233333],
    ['14608 - HONFLEUR-CEDEX', 49.416667, 0.233333],
    ['14609 - HONFLEUR-CEDEX', 49.416667, 0.233333],
    ['14850 - HEROUVILLETTE', 49.216667, -0.233333],
    ['14880 - HERMANVILLE-SUR-MER', 49.283333, -0.316667],
    ['16200 - HOULETTE', 45.766667, -0.2],
    ['16490 - HIESSE', 46.05, 0.583333],
    ['17160 - HAIMPS', 45.866667, -0.25],
    ['17320 - HIERS-BROUAGE', 45.85, -1.066667],
    ['18140 - HERRY', 47.216667, 2.95],
    ['18250 - HENRICHEMONT', 47.3, 2.533333],
    ['18250 - HUMBLIGNY', 47.25, 2.666667],
    ['19400 - HAUTEFAGE', 45.083333, 2.016667],
    ['21121 - HAUTEVILLE-LES-DIJON', 47.366667, 5],
    ['21150 - HAUTEROCHE', 47.5, 4.583333],
    ['21270 - HEUILLEY-SUR-SAONE', 47.333333, 5.45],
    ['22120 - HILLION', 48.516667, -2.683333],
    ['22150 - HENON', 48.383333, -2.7],
    ['22400 - HENANSAL', 48.55, -2.433333],
    ['22450 - HENGOAT', 48.75, -3.2],
    ['22550 - HENANBIHEN', 48.566667, -2.366667],
    ['22600 - HEMONSTOIR', 48.166667, -2.833333],
    ['24300 - HAUTEFAYE', 45.533333, 0.483333],
    ['24390 - HAUTEFORT', 45.25, 1.15],
    ['25110 - HYEVRE-MAGNY', 47.366667, 6.433333],
    ['25110 - HYEVRE-PAROISSE', 47.366667, 6.433333],
    ['25250 - HYEMONDANS', 47.383333, 6.65],
    ['25300 - HOUTAUD', 46.916667, 6.316667],
    ['25310 - HERIMONCOURT', 47.433333, 6.883333],
    ['25650 - HAUTERIVE-LA-FRESSE', 46.966667, 6.45],
    ['25680 - HUANNE-MONTMARTIN', 47.433333, 6.35],
    ['26390 - HAUTERIVES', 45.25, 5.033333],
    ['26730 - HOSTUN', 45.033333, 5.2],
    ['27110 - HECTOMARE', 49.183333, 0.95],
    ['27120 - HARDENCOURT-COCHEREL', 49.05, 1.316667],
    ['27120 - HECOURT', 48.983333, 1.416667],
    ['27120 - HOULBEC-COCHEREL', 49.066667, 1.366667],
    ['27150 - HACQUEVILLE', 49.283333, 1.55],
    ['27150 - HEBECOURT', 49.35, 1.716667],
    ['27230 - HEUDREVILLE-EN-LIEUVIN', 49.2, 0.5],
    ['27240 - HELLENVILLIERS', 48.8, 1.1],
    ['27310 - HONGUEMARE-GUENOUVILLE', 49.366667, 0.816667],
    ['27350 - HAUVILLE', 49.4, 0.766667],
    ['27400 - HEUDEBOUVILLE', 49.2, 1.25],
    ['27400 - HEUDREVILLE-SUR-EURE', 49.15, 1.183333],
    ['27400 - HONDOUVILLE', 49.133333, 1.116667],
    ['27400 - HOUETTEVILLE', 49.133333, 1.116667],
    ['27430 - HERQUEVILLE', 49.25, 1.266667],
    ['27440 - HOUVILLE-EN-VEXIN', 49.3, 1.35],
    ['27600 - HEUDEBOUVILLE', 49.2, 1.25],
    ['27630 - HARICOURT', 49.116667, 1.566667],
    ['27630 - HEUBECOURT', 49.133333, 1.566667],
    ['27700 - HARQUENCY', 49.25, 1.483333],
    ['27700 - HENNEZIS', 49.183333, 1.466667],
    ['27700 - HEUQUEVILLE', 49.283333, 1.333333],
    ['27800 - HARCOURT', 49.166667, 0.8],
    ['27800 - HECMANVILLE', 49.166667, 0.666667],
    ['27860 - HEUDICOURT', 49.333333, 1.666667],
    ['27930 - HUEST', 49.033333, 1.216667],
    ['28130 - HANCHES', 48.6, 1.65],
    ['28130 - HOUX', 48.566667, 1.616667],
    ['28410 - HAVELU', 48.783333, 1.533333],
    ['28480 - HAPPONVILLIERS', 48.316667, 1.116667],
    ['28700 - HOUVILLE-LA-BRANCHE', 48.45, 1.633333],
    ['29460 - HANVEC', 48.333333, -4.166667],
    ['29460 - HOPITAL-CAMFROUT', 48.333333, -4.233333],
    ['29670 - HENVIC', 48.633333, -3.933333],
    ['29690 - HUELGOAT', 48.366667, -3.75],
    ['31160 - HERRAN', 42.966667, 0.916667],
    ['31210 - HUOS', 43.066667, 0.6],
    ['31260 - HIS', 43.066667, 0.966667],
    ['32120 - HOMPS', 43.816667, 0.866667],
    ['32550 - HAULIES', 43.566667, 0.666667],
    ['32730 - HAGET', 43.416667, 0.166667],
    ['33125 - HOSTENS', 44.5, -0.633333],
    ['33190 - HURE', 44.55, 0.016667],
    ['33550 - HAUX', 44.733333, -0.383333],
    ['33990 - HOURTIN', 45.2, -1.066667],
    ['34600 - HEREPIAN', 43.6, 3.116667],
    ['35120 - HIREL', 48.6, -1.8],
    ['35630 - HEDE-BAZOUGES', 48.3, -1.8],
    ['37340 - HOMMES', 47.433333, 0.3],
    ['37420 - HUISMES', 47.233333, 0.25],
    ['38118 - HIERES-SUR-AMBY', 45.8, 5.283333]
  ];
}
