var http = require('http');
var express = require('express');
var bodyparser = require('body-parser');

var app = express();
app.use('/', express.static("static"));
var server = http.createServer(app);
var Readable = require('stream').Readable;
var mock = require('./mock');
var mqtt = require('./comms/mqtt');

mqtt.init();

var _intervalFor = function(sensor){
	switch(sensor){
		case "bluetooth":
		case "battery":
			return 10000;
		
		default:
			return 800;
	}
	
}

app.get('/', function(req,res){
  res.send({result:true});
});

app.post('/api/:subtype', function(req,res){
   
        var sensor = req.params.subtype;
   	var interval = _intervalFor(sensor);
   	 
        var s = new Readable();
	s._read = function noop() {}; // redundant? see update below
        var periodic = setInterval(function(){s.push(mock.next(sensor));}, _intervalFor(sensor));
	try{
  		s.pipe(res);
  	}catch(err){
  		console.log(`stopping pushing for ${sensor}`);
  		clearInterval(periodic);
  	}
});



server.listen(8080);
