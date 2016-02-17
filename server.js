var express = require('express');
var app			= express();
var port 		= 3030;

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));

app.get('/',function(req,res) {
	res.render('index');
});

var http 	= require('http').Server(app);
var io		= require('socket.io')(http);

// SOCKET IO SERVER
io.on('connection',function(socket) {

	/* Menerima status ON kondisi dari python raspberry ketika ada yang melakukan scan */
	socket.on('status_added',function(status) {
		/* Mengirim status ke angular client untuk kondisi ON */
		io.emit('refresh_add',status);
	});

	/* Menerima status OFF kondisi dari python raspberry ketika ada mematikan komputer */
	socket.on('status_updated',function(status) {
		/* Mengirim status ke angular client untuk kondisi OFF */
		io.emit('refresh_update',status);
	});
});

http.listen(port,function() {
	console.log("Server Monitoring aktif pada port " + port);
});