/*
 * interface.js
 *
 * ( c ) 2012-2015 Patrick Cardona
 * Dicto version 1.1.0
 * Gestion des événements de l'interface
 *
 */

/* =================================================================== */
/* LICENCE
/* =================================================================== */
/*
@licstart  The following is the entire license notice for the
    JavaScript code in this page.

Copyright (C) 2012-2015  Patrick CARDONA - A propos

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
function obtenirParametre (sVar) {
  return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

var numero = obtenirParametre("numero");
if (!numero) {
	alert("Syntaxe : http://votre_serveur/dictee/dictee.html?numero=54 pour charger la dictée 54.");
}

/* ***************************************** */
/*
 * Gestion effective des données de la dictée
 */
var dictee = new oDictee();
// On charge les données de cet exercice à partir du fichier data.json
	$.getJSON('json/dictee' + numero + '.json', function(data) {
		if(data.app_name == "jDicto"){
			dictee.prof = data.prof;
			dictee.titre = data.titre;
			dictee.texte = data.texte;
			dictee.auteur = data.auteur;
			dictee.ouvrage = data.ouvrage;
			dictee.audio = data.audio;

			// On actualise les étiquettes à afficher dans l'interface
			$("#titre_principal").html( dictee.titre );
			$("#prof").append( dictee.prof );
			$("#titre_lecture").html( dictee.audio );
			$("#ouvrage").html( dictee.ouvrage );
			$("#auteur").html( dictee.auteur );


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



    		$("#lecteur_audio").html(source_audio);




		}
		else{
			jAlert("<p>Une erreur s'est produite : le fichier de données n'est pas conforme.")
		}
	});

$(document).ready(function(){

	/*
	 * Etat de l'interface par défaut :
	 */
	// On masque la section de correction
	$("#section_2").hide();
	// On masque la section de solution
	$("#section_3").hide();
	// On masque le bouton recommencer
	$("#section_4").hide();


	// Animation de l'écran d'accueil
/* Désactivation de l'animation - début
$("#accueil").hide();
$("#accueil").fadeIn(2000, function() {
	$(this).animate(
			{top: -225},{
			duration: 1000,
		 	easing: 'swing',
			complete: function(){
				$("#logo").animate(
					{width: 0,
					top:0,
					opacity: 0},{
						duration: 2500,
    					easing: 'swing',
    					complete: function(){
    						$(this).fadeOut(500);
							}
						});

					}
			});
});
Désactivation - fin */

	// Caractères spéciaux
	$(".spec").click(function(){
			var carspec = $(this).text();
			insertion(carspec);
			e.preventDefault();
		});

	// Aide contextuelle
	$(".aide").click(function(e){
			jAlert ("Placez le curseur de texte à l'endroit désiré, puis cliquez sur un bouton caractère spécial pour l'insérer dans votre texte.","Aide : insertion de caractères");
			e.preventDefault();
		});

	/*
	 * Licence
	 */
	$("a[title='Licence']").click(function(){
		jAlert(lic,"Licence");
		e.preventDefault();
	});

	// Gestion des boutons
	$("input:submit").click(function(e){
		var instruction = $(this).val();
		switch ( instruction ){

			case "Corriger la dictée":
				dictee.saisie = $("#dictee").val();
				if(dictee.saisie.length > 0){
					var correction = dictee.corrige();
					if (correction != -1 ){
						$("#correction").html( correction );
						$("#section_2").show();
						$("#section_1").hide();
						$("#section_1_bis").hide();
						$("#section_4").show();
					}
				}else{
					jAlert("Veuillez d'abord saisir le texte de votre dictée.","Erreur : aucun texte saisi");
					return false;
				}
			break;

			case "Afficher la solution":
				$("#solution").html( dictee.affiche() );
				$("#section_3").show();
				$("#section_1").hide();
				$("#section_1_bis").hide();
				$("#section_2").hide();
				$("#section_4").show();
			break;

			case "Recommencer":
				jConfirm('Voulez-vous vraiment tout recommencer ?', 'Recommencer ?', function(r) {
					if(r){
						$("#dictee").val( "" );
						$("#section_2").hide();
						$("#section_3").hide();
						$("#section_4").hide();
						$("#section_1").show();
						$("#section_1_bis").show();
					}
				});
			break;

			case "Reprendre":
				$("#section_2").hide();
				$("#section_3").hide();
				$("#section_4").hide();
				$("#section_1").show();
				$("#section_1_bis").show();
			break;

			default:
			jAlert ( "Aucune action définie !");
		}
		e.preventDefault(); // pour empêcher la soumission effective du formulaire.
	});

});
