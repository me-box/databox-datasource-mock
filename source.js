var http = require('http');
var express = require('express');
var bodyparser = require('body-parser');

var app = express();
app.use('/', express.static("static"));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

var server = http.createServer(app);
var Readable = require('stream').Readable;
var mock = require('./mock');
var mqtt = require('./comms/mqtt');
var moment = require('moment');
var twitter = require('./data/twitter');

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

//mock of the blob store
app.post('/data/latest', function(req,res){
	var sensor = req.body.sensor_id;
	var ts = moment.utc();
	
	console.log("seen request for sensor " + sensor);
	
	switch  (sensor){
		
		case "twitterHashTagStream":
			res.send([{
							data:{
								text: twitter.tweets[Math.round(Math.random()*twitter.tweets.length-1)],	
							},
							timestamp:Date.now(),
							sensor_id:sensor, 
							vendor_id:1,
						
						} 	
					]);
			break;
				
		case "blub-bri":
			res.send([{data:Math.round(Math.random()*255), timestamp:Date.now(),sensor_id:sensor,vendor_id:1}]);
			break;
			
		case "bulb-hue":
			res.send([{data:Math.round(Math.random()*65000), timestamp:Date.now(),sensor_id:sensor,vendor_id:1}]);
			break;
			
		case "bulb-on":
			res.send([{data:!!Math.floor(Math.random() * 2) ? "on":"off", timestamp:Date.now(),sensor_id:sensor,vendor_id:1}]);
			break; 
	}
});


//mock of the timeseries store
app.post('/reading/latest', function(req,res){
	
	var sensor = req.body.sensor_id;
	
	
	var ts = moment.utc();
	
	switch  (sensor){
	
		case "freemem":
			res.send([[{ts:ts, value: (500000*Math.random()).toFixed(2)}]]);
			break;
		
		case "luminosity":
			res.send([[{ts:ts, value: (20000*Math.random()).toFixed(2)}]]);
			break;
		
		case "movement":
			res.send([[{ts:ts, value: (-10000 + (20000*Math.random())).toFixed(2)}]]);
			break;
				
		case "temp":
			res.send([[{ts:ts, value: (35*Math.random()).toFixed(2)}]]);
			break;
		
		default:
			res.send([[{ts:ts, value: (100*Math.random()).toFixed(2)}]]);	
	}
});



server.listen(8080);
