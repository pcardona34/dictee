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
			nouvel.querySelector("#prof").innerHTML = 'Dictée proposée par ' + dictee.prof;
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
			message("Une erreur s'est produite : le fichier de données n'est pas conforme.");
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
		specs[i].addEventListener('mouseup', specTapOrClick, false);
		specs[i].addEventListener('touchend', specTapOrClick, false);
	}
		
	function specTapOrClick(event) {
			var carspec = this.innerText;
			insertion(carspec);
			event.preventDefault();
			return false;
	}

	// Aide contextuelle
	var aides = document.querySelectorAll(".aide");
	for ( let i = 0; i < aides.length; i++){
	aides[i].addEventListener('mouseup', aideTapOrClick, false);
	aides[i].addEventListener('touchend', aideTapOrClick, false);
	}
	
	function aideTapOrClick(event) {
		message ("Placez le curseur de texte à l'endroit désiré, puis cliquez sur un bouton caractère spécial pour l'insérer dans votre texte.");
		e.preventDefault();
		return false;	
	}
	
	/* Licence */
	document.querySelector("a[title='Licence']").addEventListener('mouseup', licTapOrClick, false);
	document.querySelector("a[title='Licence']").addEventListener('touchend', licTapOrClick, false);
	
	function licTapOrClick(event){
		message(lic);
		e.preventDefault();
		return false;
	}
	
	/* Gestion du lien 'à propos' dans l'interface */
	document.querySelector("a[title=apropos]").addEventListener('mouseup', aproposTapOrClick, false);
	document.querySelector("a[title=apropos]").addEventListener('touchend', aproposTapOrClick, false);
		
	function aproposTapOrClick(event){
		apropos.affiche();
		event.preventDefault();
		return false;
	}


	// Gestion des boutons
	let submits = document.querySelectorAll("input[type=submit]");
	for ( let i = 0; i < submits.length; i++ ){
	submits[i].addEventListener('click', submitTapOrClick, false); // Ne fonctionne pas avec 'mouseup' : bogue
	submits[i].addEventListener('touchend', submitTapOrClick, false);
	}

	function submitTapOrClick(event){
		var instruction = this.value;
		switch ( instruction ){

			case "Corriger":
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
					message("Veuillez d'abord saisir le texte de votre dictée.");
				}
			break;

			case "Solution":
				document.getElementById("solution").innerHTML = dictee.affiche();
				document.getElementById("section_3").style.display = 'block';
				document.getElementById("section_1").style.display = 'none';
				
				document.getElementById("section_1_bis").style.display = 'none';
				document.getElementById("section_2").style.display = 'none';
				document.getElementById("section_4").style.display = 'block';
			break;

			case "Recommencer":
				document.getElementById("dictee").value = "";
				document.getElementById("section_2").style.display = 'none';
				document.getElementById("section_3").style.display = 'none';
				document.getElementById("section_4").style.display = 'none';
				document.getElementById("section_1").style.display = 'none';
				document.getElementById("section_1_bis").style.display = 'block';
			break;

			case "Reprendre":
				document.getElementById("section_2").style.display = 'none';
				document.getElementById("section_3").style.display = 'none';
				document.getElementById("section_4").style.display = 'none';
				document.getElementById("section_1").style.display = 'none';
				document.getElementById("section_1_bis").style.display = 'block';
			break;

			default:
			alert ( "Aucune action définie !"); // utile surtout pour le débogage
		}
	event.preventDefault();
	return false;
	}

	
	// Bouton de fermeture des mentions légales
	let bouton_fermeture_mentions = document.getElementById("fermer_bis");
	bouton_fermeture_mentions.addEventListener('mouseup', fermetureMentions, false);
	bouton_fermeture_mentions.addEventListener('touchend', fermetureMentions, false);
		
	function fermetureMentions(event){
		let mentions = document.getElementById("mentions");
		mentions.style.display = 'none';
		event.preventDefault();
		return false;
	}

	// Bouton de fermeture de message
	let bouton_fermeture = document.getElementById("fermer");
	bouton_fermeture.addEventListener('mouseup', fermetureMessage, false);
	bouton_fermeture.addEventListener('touchend', fermetureMessage, false);

	function fermetureMessage(event){
		let zone_message = document.getElementById("zone_message");
		zone_message.style.display = 'none';
		event.preventDefault();
		return false;
	}
		
	// Gestion du bouton de menu
	let menu = document.getElementById("menu");
	let icone_menu = document.getElementById("icone_menu");
	let style = window.getComputedStyle(icone_menu);
	let items = document.querySelectorAll("menu ul li");
	
	// Gestion d'événement : si on clique sur l'icône de menu:
	icone_menu.addEventListener('click', iconeMenuTapOrClick, false);
	icone_menu.addEventListener('touchend', iconeMenuTapOrClick, false);

	function iconeMenuTapOrClick(event){
		menu.style.display = 'block';
		event.preventDefault();
		return false;
	}
	
// Gestion des items de menu : si on clique sur un item quelconque
	for ( let i = 0; i < items.length; i++ ){
			items[i].addEventListener('mouseup', itemTapOrClick, false);
			items[i].addEventListener('touchend', itemTapOrClick, false);
	}

	function itemTapOrClick(event){
		if ( style.display == 'none' ){
					menu.style.display = 'block';
				} else {
					menu.style.display = 'none';
				}
		event.preventDefault();
		return false;
	}
	
	
	let message_aide = "D'abord, écoutez bien la dictée, écrivez-la sur une feuille de brouillon. Puis saisissez-la dans la zone de texte&nbsp;: menu > saisir le texte...<br />";
	menu_aide = document.getElementById("menu_aide");
	menu_aide.addEventListener('click', menuAideTapOrClick, false);
	menu_aide.addEventListener('touchend', menuAideTapOrClick, false);
	
	function menuAideTapOrClick(event){
		message(message_aide);
		event.preventDefault();
		return false;
	}
	
	
	menu_ecouter = document.getElementById("menu_ecouter");
	menu_ecouter.addEventListener('mouseup', menuEcouterTapOrClick, false);
	menu_ecouter.addEventListener('touchend', menuEcouterTapOrClick, false);
		

	function menuEcouterTapOrClick(event){
		document.getElementById("section_1_bis").style.display = 'none';
		document.getElementById("section_1").style.display = 'block';
		event.preventDefault();
		return false;
	}
	
	menu_saisir = document.getElementById("menu_saisir");
	menu_saisir.addEventListener('mouseup', menuSaisirTapOrClick, false);
	menu_saisir.addEventListener('touchend', menuSaisirTapOrClick, false);

	function menuSaisirTapOrClick(event){
		document.getElementById("section_1").style.display = 'none';
		document.getElementById("section_1_bis").style.display = 'block';
		event.preventDefault();
		return false;
	}
	
	menu_mentions = document.getElementById("menu_mentions");
	menu_mentions.addEventListener('mouseup', menuMentionsTapOrClick, false);
	menu_mentions.addEventListener('touchend', menuMentionsTapOrClick, false);

	function menuMentionsTapOrClick(event){
		document.getElementById("mentions").style.display = 'block';
		event.preventDefault();
		return false;
	}


}); // Fin du chargement de l'interface
