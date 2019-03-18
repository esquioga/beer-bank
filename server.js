var winston = require('winston');
var express = require('express');
var app = express();
var path = require('path');
var public = path.join(__dirname, 'public');
console.log(public);

app.get('/', function(req, res) {
 	res.sendFile(path.join(public, 'index.html'));
});


app.listen(5000);

console.log('Init!')