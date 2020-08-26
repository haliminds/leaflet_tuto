// Based on https://www.datavis.fr/index.php?page=leaflet-cluster
function initialize() {
  const stamenToner = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by Stamen Design, CC BY 3.0 - Map data © OpenStreetMap',
    subdomains: 'abcd',
    minZoom: 6,
    maxZoom: 20,
    ext: 'png'
  });

  const map = new L.Map("map", {
    center: new L.LatLng(46.90296, 1.90925),
    zoom: 6,
    layers: [stamenToner],
  });

  // on cree un controle
  let info = L.control();

  // ce controle est de type div et info (pour le css)
  info.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
  };

  // on update cette info selon la position du curseur et de la donnee fournie
  info.update = function(e) {
    if (e === undefined) {
      this._div.innerHTML = '<h4>Informations</h4>';
      return;
    }
    this._div.innerHTML = '<h4>Informations</h4>' +
      '<span style="font-weight:bold;">' + e.airport +
      '</span><br/>Code OACI : <span style="font-weight:bold;">' + e.oaci_code +
      '</span><br/>Longueur de piste : <span style="font-weight:bold;">' + e.length_pist + ' m' +
      '</span><br/>Largeur de piste : <span style="font-weight:bold;">' + e.width + ' m' +
      '</span><br/>Altitude : <span style="font-weight:bold;">' + e.high + ' m' +
      '</span><br/>Surface Secteur : <span style="font-weight:bold;">' + e.area + '</span>';
  };

  info.addTo(map);


  // Contenu du fichier airport:
  // airport		oaci_code	length		width	high	latitude	longitude
  // Abbeville	LFOI		1250		29		67		50.140		1.830
  // ...
  function AirportPoint(airport_data) {
    this.airport = airport_data[0];
    this.oaci_code = airport_data[1];
    this.length_pist = airport_data[2];
    this.width = airport_data[3];
    this.high = airport_data[4];
    this.latitude = airport_data[5];
    this.longitude = airport_data[6];
  }

  // chargement des points et transformation diu tableau en objet
  let points = [];

  airport.forEach(item => {
    const current_airport = new AirportPoint(item);
    const marker = new L.Marker([current_airport.latitude, current_airport.longitude], {
      title: current_airport.airport
    }).addTo(map);
    points.push(current_airport);
  });


  // Comme toujours avec D3JS lorsqu'un type de graphique a été intégré, il est très
  // facile à mettre en oeuvre. la fonction voronoi appliquée sur la liste des points
  // filtrés ajoutent pour chacun d'eux le polygone que l'on va représenter.
  // on restreint les polygones sur la frontire francaise
  var voronoi = d3.voronoi()
    .x(d => d.longitude)
    .y(d => d.latitude)
    .extent([
      [-5.1, 42.2],
      [8.2, 51.1]
    ]); // limite Frabce

  // on cree le diagramme de voronoi a partir des data
  let voronoiPolygons = voronoi.polygons(points);

  // chargement du geojson de la france
  let poly_france_turf = turf.polygon(france.geometry.coordinates);

  let startTime = new Date();

  // pour chaque polygone, on cree un geojson qu'on intégre dans la carte
  for (let i = 0; i < voronoiPolygons.length; ++i) {
    // create "real" polygon with first point equal last for turf package
    let poly_voro_list = voronoiPolygons[i].slice(0, voronoiPolygons[i].length);
    poly_voro_list.push(voronoiPolygons[i][0]);
    poly_voro_turf = turf.polygon([poly_voro_list]);

    // verifie si les polygones de voronoi sortent des frontieres
    let is_pt_out = false;

    voronoiPolygons[i].some(element =>{
      if (!d3.polygonContains(france.geometry.coordinates[0], element)) {
        is_pt_out = true;
        return true;
      }
    });


    // si ca sort, on calcule l'intersection entre la frontiere et le polygone
    if (is_pt_out) {
      var geo_json_airpoirt_polygon = turf.intersect(poly_voro_turf, poly_france_turf);

      // compute area
      let area = 0
      if (geo_json_airpoirt_polygon.geometry.type == "Polygon") {
        area = d3.polygonArea(geo_json_airpoirt_polygon.geometry.coordinates[0]);
      } else {
        geo_json_airpoirt_polygon.geometry.coordinates.forEach(item => {
          area += d3.polygonArea(item[0]);
        });
      }
      // mis à jour des property
      let property = {
        "airport": voronoiPolygons[i].data.airport,
        "oaci_code": voronoiPolygons[i].data.oaci_code,
        "length_pist": voronoiPolygons[i].data.length_pist,
        "width": voronoiPolygons[i].data.width,
        "high": voronoiPolygons[i].data.high,
        "area": area
      };
      geo_json_airpoirt_polygon.properties = property;

    } else {
      let area = d3.polygonArea(voronoiPolygons[i]);
      let property = {
        "airport": voronoiPolygons[i].data.airport,
        "oaci_code": voronoiPolygons[i].data.oaci_code,
        "length_pist": voronoiPolygons[i].data.length_pist,
        "width": voronoiPolygons[i].data.width,
        "high": voronoiPolygons[i].data.high,
        "area": area
      };
      var geo_json_airpoirt_polygon = {
        "type": "FeatureCollection",
        "features": [{
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": [voronoiPolygons[i]]
          },
          "properties": property
        }]
      };
    }

    // create polygon for map
    var geoJSONLayer = L.geoJson(geo_json_airpoirt_polygon, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(map);
  };

  let endTime = new Date();
  let timeDiff = endTime - startTime; //in ms
  console.log(timeDiff + " ms");

  function style(feature) {
    return {
      fillColor: getColor(feature.properties.area),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }

  function getColor(d) {
    return d > 1 ? '#800026' :
      d > 0.86 ? '#BD0026' :
      d > 0.72 ? '#E31A1C' :
      d > 0.58 ? '#FC4E2A' :
      d > 0.44 ? '#FD8D3C' :
      d > 0.30 ? '#FEB24C' :
      d > 0.16 ? '#FED976' :
      '#FFEDA0';
  }

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight
    });
  }

  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      fillColor: '#FFFF00',
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront(); // Permet de garantir que le pays est au-dessus des autres couches de données
    }
    info.update(layer.feature.properties);
  }

  function resetHighlight(e) {
    geoJSONLayer.resetStyle(e.target);
    info.update();
  }


}
