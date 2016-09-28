var http = require('http');
var express = require('express');
var bodyparser = require('body-parser');

var app = express();
app.use('/', express.static("static"));
var server = http.createServer(app);
var Readable = require('stream').Readable;
import next from './mock';
 
import mqttinit from './comms/mqtt';

mqttinit();

app.get('/', function(req,res){
  res.send({result:true});
});

app.post('/api/:subtype', function(req,res){
    console.log("seen request!");
    var s = new Readable();
	s._read = function noop() {}; // redundant? see update below
    setInterval(()=>{s.push(next(req.params.subtype));}, 500);
	//s.push(null);
  	s.pipe(res)	
});

server.listen(8080);
