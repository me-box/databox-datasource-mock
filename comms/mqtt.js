import mqtt from 'mqtt';  
import config from '../config';

const products = [

						{id: "un-11-234", 	product: "buxton water"},
						{id: "un-1-234",  	product: "persil washing powder"},
						{id: "mv-21-234", 	product: "mcvities jaffa cakes"},
						{id: "kc-31-234", 	product: "kenco coffee"},
						{id: "ul-14-234", 	product: "fairy washing up liquid"},
						{id: "np-mmaa-s", 	product: "san miguel 4x330ml"},
						{id: "ul-234-908", 	product: "colgate toothpaste"},
						{id: "cc-998-sks", 	product: "crispy creme deep fat lard bar"}
					];

const ISODateString = function(d) {
    function pad(n) {return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
         + pad(d.getUTCMonth()+1)+'-'
         + pad(d.getUTCDate())+'T'
         + pad(d.getUTCHours())+':'
         + pad(d.getUTCMinutes())+':'
         + pad(d.getUTCSeconds())+'Z'
}

const generateTemperatureData = (tag, min, max)=>{
	const date = new Date();
    const time = ISODateString(date);

    return JSON.stringify({
							"id": "temperature/" + tag,
							"time": time,
							"value": (min + Math.random() * (max-min)).toFixed(1),
							"unit":"degrees celcius"
						})
}

const generateBulbData = ()=> {

	return JSON.stringify({
						  	
						  	id: "ds/bulbs",
						  	timestamp: Date.now(),
						  	values: [
								{name: 'bulb one', 		id: 1, value: !!Math.floor(Math.random() * 2) ? "on":"off"},
								{name: 'bulb two', 		id: 2, value: !!Math.floor(Math.random() * 2) ? "on":"off"},
						  		{name: 'bulb three',	id: 3, value: !!Math.floor(Math.random() * 2) ? "on":"off"},
						  		{name: 'bulb four', 	id: 4, value: !!Math.floor(Math.random() * 2) ? "on":"off"}
						  	]
						});
}

const generateUtensilData = ()=> {
	
	return JSON.stringify({
						  	id: "ds/utensils",
						  	timestamp: Date.now(),
						  	values: [
								{name: 'utensil1', 		id: 1, value: !!Math.floor(Math.random() * 2) ? "in use":"not in use"},
								{name: 'utensil2', 		id: 2, value: !!Math.floor(Math.random() * 2) ? "in use":"not in use"},
						  	]
						});
}

const generateFMCGData = ()=> {

	var product = products[Math.floor(8 * Math.random())];
	product.value = "moved";

	return JSON.stringify({
						  	id: "ds/fmcgs",
						  	timestamp: Date.now(),
						  	values: [product]
						});

}




export default function init(){

	const client = mqtt.connect('mqtt://mosquitto:1883');
	const fastmin = 2000;
	const fastmax = 3000;

	const mediummin = 4000;
	const mediummax = 8000;

	const slowmin = 15000;
	const slowmax = 20000;

	client.on('connect', () => {  
  		
  		if (config.sources.indexOf('temperature') != -1){
	  		setInterval(() => {
	  			client.publish('temperature/TA', generateTemperatureData("TA", 10, 20))
	  		}, Math.random() * (fastmax - fastmin) + fastmin) 
	  		
	  		setInterval(() => {
	  			client.publish('temperature/TB', generateTemperatureData("TB", 5, 30))
	  		}, Math.random() * (fastmax - fastmin) + fastmin) 
	  		
	  		setInterval(() => {
	  			client.publish('temperature/TC', generateTemperatureData("TC", -15, 20))
	  		}, Math.random() * (fastmax - fastmin) + fastmin) 
	  	}

	  	if (config.sources.indexOf('bulbs') != -1){	
	  		setInterval(() => {
	  			client.publish('ds/bulbs', generateBulbData())
	  		}, Math.random() * (fastmax - fastmin) + fastmin) 
	  	}
	  	if (config.sources.indexOf('utensils') != -1){	
  			setInterval(() => {
  				client.publish('ds/utensils', generateUtensilData())
  			}, 	Math.random() * (mediummax - mediummin) + mediummin) 
  		}

  		if (config.sources.indexOf('fmcgs') != -1){	

  			setInterval(() => {
  				client.publish('ds/fmcgs', generateFMCGData())
  			}, 	Math.random() * (slowmax - slowmin) + slowmin) 
  		}

	})

}
