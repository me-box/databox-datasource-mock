var http = require('http');
var express = require('express');
var bodyparser = require('body-parser');

var app = express();
app.use('/', express.static("static"));
var server = http.createServer(app);

import mqttinit from './comms/mqtt';

mqttinit();

app.get('/', function(req,res){
  res.send({result:true});
});

server.listen(9001);
