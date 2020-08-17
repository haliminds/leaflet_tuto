// Based on https://www.datavis.fr/index.php?page=leaflet-choroplethe
function initialize()
{
let map = L.map('map').setView([1.2, 17], 4);

// Choix du layer
let Stamen_Toner = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 4,
	maxZoom: 20,
	ext: 'png'
});

map.addLayer(Stamen_Toner);

// Ajout legende dynamique
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h5>Population des pays d\'Afrique</h5>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.population.toLocaleString()  + ' habitants'
        : 'Passer la souris sur un pays');
};

info.addTo(map);

// Ajout legende statique
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 40, 60, 80, 100, 150];

    div.innerHTML += '<h6>En millions</h6>';
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor((grades[i] + 1) * 1000000) + '"></i> ' +
            grades[i] + (grades[i + 1] ? 'M – ' + grades[i + 1] + 'M <br>' : '+');
    }

    return div;
};

legend.addTo(map);

// Ajout couche geojson
let geoJSONLayer = L.geoJson(data, { 
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);


function style(feature) {
    return {
        fillColor: getColor(feature.properties.population),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function getColor(d) {
    return d > 150000000 ? '#800026' :
        d > 1000000000  ? '#BD0026' :
        d > 80000000  ? '#E31A1C' :
        d > 60000000  ? '#FC4E2A' :
        d > 40000000   ? '#FD8D3C' :
        d > 20000000   ? '#FEB24C' :
        d > 10000000   ? '#FED976' :
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

