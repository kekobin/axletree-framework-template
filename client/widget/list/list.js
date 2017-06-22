var list = document.querySelectorAll('.list-item')[0];
var parentNode = list.parentNode;

parentNode.addEventListener('click', function() {
	console.log(this)
});