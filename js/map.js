// Création de l'objet map
var map = {

	// Initalisation de la map
	init: function() {
		document.getElementById('map').style.height = "500px";
		mapLyon = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 45.757, lng: 4.765},
          zoom: 12
        });
	}

};
