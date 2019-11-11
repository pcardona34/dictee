'use strict'

/*
 * interface.js
 *
 * ( c ) 2012-2019 Patrick Cardona
 * Dictee : exerciseur de dictée conçue au moyen de JDicto.
 * Gestion des événements de l'interface
 *
 */

/* =================================================================== */
/* LICENCE
/* =================================================================== */
/*
@licstart  The following is the entire license notice for the
    JavaScript code in this page.

Copyright (C) 2012-2019  Patrick CARDONA - A propos

    The JavaScript code in this page is free software: you can
    redistribute it and/or modify it under the terms of the GNU
    General Public License (GNU GPL) as published by the Free Software
    Foundation, either version 3 of the License, or (at your option)
    any later version.  The code is distributed WITHOUT ANY WARRANTY;
    without even the implied warranty of MERCHANTABILITY or FITNESS
    FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

    As additional permission under GNU GPL version 3 section 7, you
    may distribute non-source (e.g., minimized or compacted) forms of
    that code without the copy of the GNU GPL normally required by
    section 4, provided you include this license notice and a URL
    through which recipients can access the Corresponding Source.

@licend  The above is the entire license notice
    for the JavaScript code in this page.
*/

// On définit une variable globale pour la position du curseur dans le texte
var position = 0;

// Récupération du paramètre "numero" : d'après MSDN
function obtenirParametre(sVar) {
  return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

var numero = obtenirParametre('numero');
if (!numero) {
	alert("Syntaxe : http://votre_serveur/dictee/dictee.html?numero=54 pour charger la dictée 54 (c-à-d dictee54.json).");
}
else
    {
	var donnees = 'json/dictee' + numero + '.json';
}

/* ****************************************** */
/* Gestion effective des données de la dictée */
var dictee = new oDictee();

// On charge les données de cet exercice dans le modèle d'interface à partir du fichier de données obtenu via la variable 'donnees'
// Gestion du modèle (template)
var template = document.getElementById('modele').innerHTML;

fetch(donnees)
	.then(function(response) {
	if (!response.ok) {
		throw new Error("Erreur HTTP, statut = " + response.status);
       }
       return response.json();
     })
     .then(function(json) {
		if(json.app_name == "jDicto"){
			var nouvel = document.createElement("div");
			nouvel.innerHTML = template;
			// On récupère les données
			dictee.prof = json.prof;
			dictee.titre = json.titre;
			dictee.texte = json.texte;
			dictee.auteur = json.auteur;
			dictee.ouvrage = json.ouvrage;
			dictee.audio = json.audio;

			// On actualise les étiquettes à afficher dans l'interface du modèle
			nouvel.querySelector("#titre_principal").innerHTML = dictee.titre;
			nouvel.querySelector("#prof").innerHTML = 'Dictée proposée par : ' + dictee.prof;
			nouvel.querySelector("#ouvrage").innerHTML = dictee.ouvrage;
			nouvel.querySelector("#auteur").innerHTML = dictee.auteur;


			/*
 			* Lecteur multimédia HTML5
 			*/
			var source_audio = "";
			if(testNavigateur()){
				source_audio = "<audio class=\"audio\" controls>";
				source_audio += "<source src=\"media/" + dictee.audio + ".ogg\"></source>";
				source_audio += "</audio>";
			}else{
				source_audio ="<div class='erreur'>Votre navigateur n'est pas conforme. Veuillez utiliser ";
				source_audio += "<a href='https://www.mozilla.org/fr/firefox/'>Mozilla Firefox</a>.</div>";
			}
    		nouvel.querySelector("#lecteur_audio").innerHTML = source_audio;
    		document.getElementById("conteneur").innerHTML = "";
    		document.getElementById("conteneur").appendChild(nouvel);
		}
		else{
			alert("Une erreur s'est produite : le fichier de données n'est pas conforme.");
		}


	/* Etat de l'interface par défaut : */
	// On masque la section de correction
	document.getElementById("section_2").style.display = 'none';
	// On masque la section de solution
	document.getElementById("section_3").style.display = 'none';
	// On masque le bouton recommencer
	document.getElementById("section_4").style.display = 'none';

	// Caractères spéciaux
	var specs = document.querySelectorAll(".spec");
	for ( let i = 0; i < specs.length; i++){
		specs[i].addEventListener('click', function(e){
			var carspec = this.innerText;
			insertion(carspec);
			e.preventDefault();
		});
	}

	// Aide contextuelle
	var aides = document.querySelectorAll(".aide");
	for ( let i = 0; i < aides.length; i++){
	aides[i].addEventListener('click', function(e){
			alert ("Placez le curseur de texte à l'endroit désiré, puis cliquez sur un bouton caractère spécial pour l'insérer dans votre texte.");
			e.preventDefault();
		});
	}
	
	/* Licence */
	document.querySelector("a[title='Licence']").addEventListener('click', function(e){
		alert(lic);
		e.preventDefault();
	});
	
	
	/* Gestion du lien 'à propos' dans l'interface */
	document.querySelector("a[title=apropos]").addEventListener('click', function(e){
		apropos.affiche();
		e.preventDefault(); // Pour ne pas suivre le lien.
	});

	// Gestion des boutons
	let submits = document.querySelectorAll("input[type=submit]");
	for ( let i = 0; i < submits.length; i++ ){
	submits[i].addEventListener('click', function(e){
		var instruction = this.value;
		switch ( instruction ){

			case "Corriger la dictée":
				dictee.saisie = document.getElementById("dictee").value;
				if(dictee.saisie.length > 0){
					var correction = dictee.corrige();
					if (correction != -1 ){
						document.getElementById("correction").innerHTML = correction;
						document.getElementById("section_2").style.display = 'block';
						document.getElementById("section_1").style.display = 'none';
						document.getElementById("section_1_bis").style.display = 'none';
						document.getElementById("section_4").style.display = 'block';
					}
				}else{
					alert("Veuillez d'abord saisir le texte de votre dictée.");
					//return false;
				}
			break;

			case "Afficher la solution":
				document.getElementById("solution").innerHTML = dictee.affiche();
				document.getElementById("section_3").style.display = 'block';
				document.getElementById("section_1").style.display = 'none';
				
				document.getElementById("section_1_bis").style.display = 'none';
				document.getElementById("section_2").style.display = 'none';
				document.getElementById("section_4").style.display = 'block';
			break;

			case "Recommencer":
				let r = confirm('Voulez-vous vraiment tout recommencer ?');
					if(r){
						document.getElementById("dictee").value = "";
						document.getElementById("section_2").style.display = 'none';
						document.getElementById("section_3").style.display = 'none';
						document.getElementById("section_4").style.display = 'none';
						document.getElementById("section_1").style.display = 'block';
						document.getElementById("section_1_bis").style.display = 'block';
					}
				
			break;

			case "Reprendre":
				document.getElementById("section_2").style.display = 'none';
				document.getElementById("section_3").style.display = 'none';
				document.getElementById("section_4").style.display = 'none';
				document.getElementById("section_1").style.display = 'block';
				document.getElementById("section_1_bis").style.display = 'block';
			break;

			default:
			alert ( "Aucune action définie !");
		}
		e.preventDefault(); // pour empêcher la soumission effective du formulaire.
	});
	} // Fin de la boucle for
}); // Fin du chargement de l'interface
