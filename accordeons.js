'use strict'

/* accordeons.js
 * ( c ) 2019 - Patrick Cardona
 * Gestion des menus avec accordéons
 */

/* =================================================================== */
/* LICENCE
/* =================================================================== */
/*
@licstart  The following is the entire license notice for the 
    JavaScript code in this page.

Copyright (C) 2012-2019  Patrick CARDONA - Accordéons

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


/* **************************************************************** */
/* Fonctions de gestion de l'affichage des accordéons               */
/* **************************************************************** */

function montreAccordeon(id){
	
	/* On replie tous les accordéons */
	let accordeons = document.querySelectorAll('.degrade');
	for ( let i = 0; i < accordeons.length; i++ ){
		let ida = accordeons[i].getAttribute('id');
		cacherAccordeon(ida);
	}
	/* On remet les titres en gris */
	let titres = document.querySelectorAll('h3');
	for ( let i = 0; i < titres.length; i++){
		titres[i].style.color = 'gray';
	}
	
	/* On affiche celui qui a été sélectionné */
	document.getElementById(id).style.display = 'block';
}

function cacherAccordeon(id){
	
	document.getElementById(id).style.display = 'none';
	
}

