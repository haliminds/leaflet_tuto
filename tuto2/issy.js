// based on https://www.datavis.fr/index.php?page=leaflet-control
function initialize()
{
// Creation d'un tableau contenant les categories (dans cat2)
var cats = [];
// Parse tout le geojson
for (var i = 0; i < geojson.features.length; i++) {
	// recupere la categorie en cours
    var cat = getCat(cats, geojson.features[i].properties.categorie2);
	// si la categorie n'existe pas, je la cree
    if (cat === undefined) {
        cat = {
            "interestPoints" : createInterestPoints(),
            "id" : "cat" + i,
            "label" : geojson.features[i].properties.categorie2
        }
        cats.push(cat);
    }
	// j'update la categorie avec l'ajout de l'element en cours
    cat["interestPoints"].addData(geojson.features[i]);
}

// je cree une nouvelle map
var map = new L.Map("map", {
    center: new L.LatLng(48.825, 2.27),
    zoom: 15
});

// Choix du layer
let stamen = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 4,
	maxZoom: 20,
	ext: 'png'
});
// ajout du layer a la carte
map.addLayer(stamen);

// je cree une commande en haut a droite qui parse cats et qui ajoute un form checkbox pour chaque categorioe
var command = L.control({position: 'topright'});
command.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'command');
    div.innerHTML += '<div style="text-align:center;"><span style="font-size:18px;">Points d\'intérêt</span><br /><span style="color:grey;font-size:14px;">(ville d\'Issy-Les-Moulineaux)</span></div>';
    for (var i = 0; i < cats.length; i++) {
        div.innerHTML += '<form><input id="' + cats[i]["id"] + '" type="checkbox"/>' + cats[i]["label"] + '</form>';
    }
    return div;
};
command.addTo(map);

// pour chaque id de la form, ajout d'un handleCommand pour chaque click
for (var i = 0; i < cats.length; i++) {
    document.getElementById(cats[i]["id"]).addEventListener("click", handleCommand, false);
}

function handleCommand() {
    var selectedCat;
	// on recupere la categorie cliquee
    for (var i = 0; i < cats.length; i++) {
        if (cats[i]["id"] === this.id) {
            selectedCat = cats[i];
            break;
        }
    }
	// si c'est checked, on affiche les points d'interets sur la carte, sinon, on les enleve
    if (this.checked) {
        selectedCat["interestPoints"].addTo(map);
    } else {
        map.removeLayer(selectedCat["interestPoints"]);
    }
}


}

// si la categorie existe, on rend la cellule de cats correpsondante sinon, on rend undefined
function getCat(tabCat, category)
{
	for (let i = 0; i < tabCat.length; i++) {
		if (tabCat[i].label == category)
		{
			return tabCat[i];
		}
	}
	return undefined;
}

// On genere un objet L.geoJson vide que l'on va remplir avec addData.
function createInterestPoints () {
    return new L.geoJson([], {
		// On definir la representation des point sur le layer avec la propriete pointToLayer
        pointToLayer: function(feature, latlng) {
            var smallIcon = L.icon({
                iconUrl: getIcon(feature.properties.categorie1, feature.properties.categorie2, feature.properties.categorie3),
                //shadowUrl: 'icon-shadow.png',
                iconSize:     [33, 44], // taille de l'icone
                //shadowSize:   [50, 64], // taille de l'ombre
                iconAnchor:   [16, 44], // point de l'icone qui correspondra à la position du marker
                //shadowAnchor: [32, 64],  // idem pour l'ombre
                popupAnchor:  [-3, -76] // point depuis lequel la popup doit s'ouvrir relativement à l'iconAnchor
            });
            return L.marker(latlng, {icon: smallIcon});
        },
		// Pour chaque feature, on definit sa description et on ajoute une popup cliquable
        onEachFeature: function(feature, layer) {
            var html = '';
            if (feature.properties.titre) {
                html += '<b>' + feature.properties.titre + '</b></br>';
            }
            if (feature.properties.description) {
                html += 'Description :' + feature.properties.description + '</br>';
            }
            if (feature.properties.url) {
                html += '<a href="' + feature.properties.url + '" target="_blank">Site Internet</a></br>';
            }
            if (feature.properties.categorie1) {
                html += 'Catégorie 1 : ' + feature.properties.categorie1 + '</br>';
            }
            if (feature.properties.categorie2) {
                html += 'Catégorie 2 : ' + feature.properties.categorie2 + '</br>';
            }
            if (feature.properties.categorie3) {
                html += 'Catégorie 3 : ' + feature.properties.categorie3 + '</br>';
            }
            layer.bindPopup(html);
        }
    });
}

// Defini le type d'icone selon la cetegorie
function getIcon(categorie1, categorie2, categorie3) {
	if (categorie3 === "Coiffeurs") {
		return "map-icons/saloon.png";
	} else if (categorie3 === "Caf\u00e9s-Bars-Brasseries") {
		return  "map-icons/bars.png";
	} else if (categorie3 === "Habillement") {
		return  "map-icons/clothings.png";
	} else if (categorie3 === "Bijouteries") {
		return  "map-icons/jewelry.png";
	} else if (categorie3 === "Ameublement-D\u00e9coration") {
		return  "map-icons/furniture-stores.png";
	} else if (categorie3 === "Librairies-Papeteries-Presse") {
		return  "map-icons/libraries.png";
	} else if (categorie3 === "Cadeaux ou jouets") {
		return  "map-icons/gifts-flowers.png";
	} else if (categorie3 === "Agences de voyages") {
		return  "map-icons/travel.png";
	} else if (categorie3 === "Epiceries, sup\u00e9rettes et grande distribution") {
		return  "map-icons/shopping.png";
	} else if (categorie3 === "Aide \u00e0 l'emploi et d\u00e9veloppement \u00e9conomique") {
		return  "map-icons/employment.png";
	} else if (categorie3 === "Musique") {
		return  "map-icons/musical-instruments.png";
	} else if (categorie3 === "Arbres remarquables") {
		return  "map-icons/marker-new1_12.png";
	} else if (categorie3 === "Bureaux de vote") {
		return  "map-icons/government.png";
	} else if (categorie3 === "Sculptures de m\u00e9tal") {
		return  "map-icons/museums.png";
	} else if (categorie3 === "Equipements sportifs, accès réservé") {
		return  "map-icons/sporting-goods.png";
	} else if (categorie3 === "Parcs") {
		return  "map-icons/parks.png";
	} else if (categorie3 === "Restauration-Bars-Tabacs") {
		return  "map-icons/restaurants.png";
	} else if (categorie3 === "Agences immobilières") {
		return  "map-icons/real-estate.png";
	} else if (categorie3 === "Animalerie-Toilettage") {
		return  "map-icons/pets.png";
	} else if (categorie3 === "Stations services-Lavage") {
		return  "map-icons/automotive.png";
	} else if (categorie3 === "Marchés") {
		return  "map-icons/miscellaneous-for-sale.png";
	} else if (categorie3 === "Centres, cliniques et hôpitaux") {
		return  "map-icons/health-medical.png";
	} else if (categorie3 === "Pharmacies") {
		return  "map-icons/medical.png";
	} else if (categorie3 === "Parkings voitures sous-sol") {
		return  "map-icons/automotive.png";
	}

	if (categorie2 === "Entreprises TIC + de 50 salari\u00e9s") {
		return  "map-icons/professional.png";
	} else if (categorie2 === "Education") {
		return  "map-icons/schools.png";
	} else if (categorie2 === "Transports") {
		return  "map-icons/transport.png";
	} else if (categorie2 === "Hôtels et chambres d'hôtes") {
		return  "map-icons/hotels.png";
	} else if (categorie2 === "Petite Enfance") {
		return  "map-icons/play-schools.png";
	} else if (categorie3 === "Cyber cité") {
		return  "map-icons/internet.png";
	}

	return "map-icons/default.png";
}
