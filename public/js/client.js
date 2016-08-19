var socket = io();

// socket.emit('message', {
// 	text: "Some Random message from client"
// });

var name = getQueryVariable('name');
var room = getQueryVariable('room');

jQuery('.messages').find('h1').text(room);

socket.on('connect', function() {
	socket.emit('joinRoom', {
		name: name,
		room: room
	});
});

socket.on('message', function(message) {
	//console.log(message.text);
	var timestamp = moment.utc(message.timestamp);
	jQuery('.messages').append('<p>' + message.name + '</p>');
	jQuery('.messages').append('<p>' + message.text + '</p>' + '<strong>' + timestamp.local().format('h:mm a') + '</strong>');
});

var $form = jQuery('#chat-form');

$form.on('submit', function(event) {
	event.preventDefault();

	socket.emit('message', {
		name: name,
		text: $form.find('input[name=message]').val()
	});

	$form.find('input[name=message]').val('');
});