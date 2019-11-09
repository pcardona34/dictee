function insertion(car) {
		var input = document.forms['formulaire'].elements['dictee'];
		input.focus();
  
		if(typeof input.selectionStart != 'undefined')
		{
			/* Insertion du code */
		var start = input.selectionStart;
		var end = input.selectionEnd;
		var insText = input.value.substring(start, end);
		input.value = input.value.substr(0, start) + car + input.value.substr(end);
			/* Ajustement de la position du curseur */
		var pos;
		pos = start + car.length;
		input.selectionStart = pos;
		input.selectionEnd = pos;
		}
		}
