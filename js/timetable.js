const fill = document.querySelector('.basefill');
const empties = document.querySelectorAll('.empty');

//Fill listeners - nadsluchiwanie przyjścia wypełnienia

fill.addEventListener('dragstart', dragStart);
fill.addEventListener('dragend', dragEnd);

// Funkcje przeciągania
function dragStart() {
	this.className += ' hold';
	
}


function dragEnd () {
	this.className += 'fill';
	
	
}