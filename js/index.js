document.addEventListener("DOMContentLoaded", function(){
	
    /*
    * Gestion des tiroirs
    */
    var template = document.getElementById("modele").innerHTML;
    var nouvel = document.createElement("div");
    nouvel.innerHTML = template;
    
    var accordeons = nouvel.querySelectorAll('.degrade');
    for ( let i = 0 ; i < accordeons.length ; i++ ){
			accordeons[i].style.display = 'none';
	}
	
	var titres = nouvel.querySelectorAll('h3');
	for ( let i = 0; i < titres.length; i++){
		titres[i].addEventListener('click', function(){
			let tiroirs = nouvel.querySelectorAll('.degrade');
			montreAccordeon(tiroirs[i].getAttribute('id'));
			titres[i].style.color = 'black';
	});
	} // Fin de la boucle for sur les titres
	
    document.getElementById("conteneur").innerHTML = "";
    document.getElementById("conteneur").appendChild(nouvel);
	
});
