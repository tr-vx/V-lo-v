var req = new XMLHttpRequest();

// GET https://api.jcdecaux.com/vls/v1/stations?contract={contract_name}&apiKey={api_key}
req.open("GET", "https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=46e3a248e419adbba6f8ad36e794381b3e1a9d51");

req.addEventListener("load", function () {

    if (req.status >= 200 && req.status < 400) { // Le serveur a réussi à traiter la requête
    	// Affichage de la réponse 
        console.log(req.responseText);
    } else {
        // Affichage des informations sur l'échec du traitement de la requête
        console.error(req.status + " " + req.statusText);
    }
});

req.addEventListener("error", function () {
    // La requête n'a pas réussi à atteindre le serveur
    console.error("Erreur réseau");
});

req.send(null);