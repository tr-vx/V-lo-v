// Définition de l'objet slideshow
var slideshow = {

	// Slide en cours
	currentSLide: 0,

	// Elements slide
	// slideELts: document.getElementsByClassName("slideshow__slide"),
	// slideshowELt: document.getElementById("slideshow") ,

	// Initialisation du slideshow
	init: function() {
	  	this.focus(0);
	},

  	// Mettre le focus sur un slide
  	focus: function(slideToFocus) {
	  	var slideElts = document.getElementsByClassName("slideshow__slide");
	  	slideElts[slideToFocus].style.background = "yellow";
	  	slideElts[slideToFocus].style.transform = "scale(1)";
	    // Déplacer le conteneur pour afficher le slide
	    document.getElementById("slideshow").style.left =
	    "-" + slideToFocus * 100 + "%";
	    // Modifier la propriete slide en cours
	    this.currentSlide = slideToFocus;
	},

	// Traitements des commandes de navigation (clavier et boutons) <- ->
	command: function(key) {
	    // si "a"/"bouton gauche" est pressé/clické
	    if (key === 97 || key === "left") {
	      console.log("<- Slide précedent");
	      slideshow.focus(slideshow.currentSlide - 1);
	    }
	    // si "z"/"bouton gauche" est pressé/clické
	    if (key === 122 || key === "right") {
	      console.log("-> Slide suivant");
	      slideshow.focus(slideshow.currentSlide + 1);
	    }
	    console.log("Slide en cours : "+this.currentSlide);
	}
};
// Appel de la méthode d'initialisation du slide
slideshow.init();

// Ecouter l'appuie de touche clavier
document.addEventListener("keypress", function(e) {
  slideshow.command(e.charCode);
});
// Ecouter le click sur le bouton gauche
document.getElementById("btnl").addEventListener("click", function() {
  slideshow.command("left");
});
// Ecouter le click sur le bouton droit
document.getElementById("btnr").addEventListener("click", function() {
  slideshow.command("right");
});