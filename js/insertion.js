'use strict'

/* Dictee : insertion.js
 ( c ) 2012-2019 - Patrick Cardona
 Version 3.0
 */

/* =================================================================== */
/* LICENCE
/* =================================================================== */
/*
@licstart  The following is the entire license notice for the 
    JavaScript code in this page.

Copyright (C) 2012-2019  Patrick CARDONA - Dictee de JDicto

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
