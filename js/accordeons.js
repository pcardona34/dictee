
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


document.addEventListener("DOMContentLoaded", function(){
	
	/*
    * Gestion des tiroirs
    */
    var accordeons = document.querySelectorAll('.degrade');
    for ( let i = 0 ; i < accordeons.length ; i++ ){
			accordeons[i].style.display = 'none';
	}
	
	var titres = document.querySelectorAll('h3');
	for ( let i = 0; i < titres.length; i++){
		titres[i].addEventListener('click', function(){
			let tiroirs = document.querySelectorAll('.degrade');
			montreAccordeon(tiroirs[i].getAttribute('id'));
			titres[i].style.color = 'black';
	});
	} // Fin de la boucle for sur les titres
	
});
