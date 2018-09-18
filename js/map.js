// clef de l'api MapBox
mapboxgl.accessToken = 'pk.eyJ1IjoidHJldngiLCJhIjoiY2lvNGh3cHNrMDAycHVta24yaTFrbHB1biJ9.VdBhBjxwCQsSdUz3c7sUcQ';

// Création de l'objet map
var map = new mapboxgl.Map({
   init: function() {

   },
   container: 'map',
   style: 'mapbox://styles/mapbox/streets-v9',
   center: [4.8335820753227665,45.752824623869856],
   zoom: 12
});
document.getElementById('map').style.height = "200px";

// Une fois la map chargée
map.on('load', function() {
	console.log("map chargée!");
   geo();
});

// Création de la variable contenant les données des stations au format GeoJSON
var myGeoJSON = {};

// Fonction test - Ajouter des clusters / Regrouper les stations 
function geo () {

	//Transformation des données JSON en GeoJson
	myGeoJSON.type = "FeatureCollection";
	myGeoJSON.features = [];

   // Récupération des infos des stations
   var stations = JSON.parse(req.responseText);

   // Boucle pour ajouter chaques station au geojson
   stations.forEach(function (station) {

      var nouvelleStation = {
         type: 'Feature',
         geometry: {
            type: 'Point',
            coordinates: [station.position.lng, station.position.lat]
         },
         properties: {
            description: station.name,
            number: station.number,
            address: station.address,
            banking: station.banking,
            bonus: station.bonus,
            bike_stands: station.bike_stands,
            available_bike_stands: station.available_bike_stands,
            available_bikes: station.available_bikes,
            status: station.status,
            last_update: station.last_update
         }
      };

      // Ajout de la station à la variable $stations
      myGeoJSON.features.push(nouvelleStation);
   });

   // Add a new source from our GeoJSON data and set the
   // 'cluster' option to true. GL-JS will add the point_count property to your source data.
   map.addSource("stationsvelo", {
      type: "geojson",
      data: myGeoJSON,// Point to GeoJSON data. 
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
   });

   // On defini l'affichage du cluster
   map.addLayer({
      id: "clusters",
      type: "circle",
      source: "stationsvelo",
      filter: ["has", "point_count"],
      paint: {
         // Use step expressions (https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
         // with three steps to implement three types of circles:
         //   * Blue, 20px circles when point count is less than 100
         //   * Yellow, 30px circles when point count is between 100 and 750
         //   * Pink, 40px circles when point count is greater than or equal to 750
         "circle-color": ["step",["get", "point_count"],"#51bbd6",100,"#f1f075",750,"#f28cb1"],
         "circle-radius": ["step",["get", "point_count"],20,100,30,750,40]
      }
   });

   // On ajoute le nombre de station sur le cluster
   map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "stationsvelo",
      filter: ["has", "point_count"],
      layout: {
         "text-field": "{point_count_abbreviated}",
         "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
         "text-size": 12
      }
   });

   // On defini le style du marqueur de chaque station 
   map.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "stationsvelo",
      filter: ["!", ["has", "point_count"]],
      paint: {
         "circle-color": "#11b4da",
         "circle-radius": 8,
         "circle-stroke-width": 1,
         "circle-stroke-color": "#fff"
      }
   });

   // Au click sur un cluster
   map.on('click', 'clusters', function (e) {
      var features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
      var clusterId = features[0].properties.cluster_id;
      map.getSource('stationsvelo').getClusterExpansionZoom(clusterId, function (err, zoom) {
         if (err)
            return;

         map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom
         });
      });

   });

   // Au click sur une station afficher les informations 
   map.on('click', 'unclustered-point', function (e) {

      // Recupération des infos de la station
      var coordinates = e.features[0].geometry.coordinates.slice();
      var description = e.features[0].properties.description;
      var address = e.features[0].properties.address;
      var banking = e.features[0].properties.banking;
      var bike_stands = e.features[0].properties.bike_stands;
      var available_bike_stands = e.features[0].properties.available_bike_stands;
      var available_bikes = e.features[0].properties.available_bikes;
      var status =  e.features[0].properties.status;
       
      // TEST afficher toutes les infos 
      console.log("Toutes les infos: " + e.features[0].properties);

      // TEST - Modifier la taille de la map et afficher le panneau droit
      // document.getElementById('map').style.width = "70%";
      // document.getElementById('info').style.width = "30%";

      // Création des élements
      var infoElt = document.getElementById('info');
      var titreElt = document.createElement("h3");
      titreElt.textContent = description;
      var contenuElt = document.createElement("p");
      contenuElt.textContent = address + " " + available_bikes ;
      infoElt.appendChild(titreElt);
      infoElt.appendChild(contenuElt); 

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
         coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
      // test POPUP
      new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(description)
      .addTo(map);
   });

   map.on('mouseenter', 'clusters', function () {
      map.getCanvas().style.cursor = 'pointer';
   });
   map.on('mouseleave', 'clusters', function () {
      map.getCanvas().style.cursor = '';
   });
};


// Fonction test - Afficher les infos et creer le marqueur de chaque stations
function afficher() {

   var stations = JSON.parse(req.responseText);

   stations.forEach(function (station) {

      var infoElt = document.getElementById('info');
      var titreElt = document.createElement("p");
      titreElt.textContent = station.name;
      var contenuElt = document.createElement("p");
      contenuElt.textContent = station.position.lat;
      infoElt.appendChild(titreElt);
      infoElt.appendChild(contenuElt);

      // Ajouter un marker
      var marker = new mapboxgl.Marker()
         .setLngLat([station.position.lng, station.position.lat])
         .addTo(map);
     });
}
