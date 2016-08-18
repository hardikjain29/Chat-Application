var socket = io();

socket.emit('message', {
	text: "Some Random message from client"
});

socket.on('message', function(message) {
	console.log(message.text);
});

var $form = jQuery('form');

$form.on('submit',function (event) {
	event.preventDefault();

	socket.emit('message',{
		text:$form.find('input[name=message]').val()
	});

	$form.find('input[name=message]').val('');
});