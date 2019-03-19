var winston = require('winston');
var express = require('express');
var app = express();
var path = require('path');
var public = path.join(__dirname, 'public');
console.log(public);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
	console.log('Redirect.');
 	res.sendFile(path.join(public, 'index.html'));
});

port = 5000
app.listen(port);

console.log('Init! Listening on http://127.0.0.1:' + port);