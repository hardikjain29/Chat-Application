var PORT = process.env.PORT || 3100;
var express = require('express');
var app = express();
var moment = require('moment');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

function getCurrentUsers(socket) {
	var clientInfor = clientInfo[socket.id];

	if (typeof clientInfor === 'undefined')
		return;

	var users = [];

	Object.keys(clientInfo).forEach(function(socketid) {
		var userinfo = clientInfo[socketid];

		if (clientInfor.room === userinfo.room)
			users.push(userinfo.name);
	});

	socket.emit('message', {
		text: users.join(', '),
		name: 'System',
		timestamp: moment().valueOf()
	});
}

io.on('connection', function(socket) {
	console.log("Connection Made");

	socket.on('joinRoom', function(req) {
		socket.join(req.room);
		clientInfo[socket.id] = req;
	});

	socket.on('disconnect', function() {
		if (clientInfo[socket.id].name !== 'undefined')
			console.log(clientInfo[socket.id].name + " has left");
		delete clientInfo[socket.id];
	});

	socket.on('message', function(message) {
		console.log("Message from client:" + message.text);
		message.timestamp = moment.valueOf();

		if (message.text === '@currentusers')
			getCurrentUsers(socket);
		else
			io.to(clientInfo[socket.id].room).emit('message', message);
	});

	// socket.emit('message', {
	// 	text: "Message from Server"
	// });

});


http.listen(PORT, function() {
	console.log("Server Started");
})