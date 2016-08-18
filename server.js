var PORT = process.env.PORT || 3100;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
	console.log("Connection Made");

	socket.on('message', function(message) {
		console.log("Message from client:" + message.text);

		io.emit('message', message);
	});

	// socket.emit('message', {
	// 	text: "Message from Server"
	// });

});


http.listen(PORT, function() {
	console.log("Server Started");
})