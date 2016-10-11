var mqtt = require('mqtt');  

var products = [

						{id: "un-11-234", 	product: "buxton water"},
						{id: "un-1-234",  	product: "persil washing powder"},
						{id: "mv-21-234", 	product: "mcvities jaffa cakes"},
						{id: "kc-31-234", 	product: "kenco coffee"},
						{id: "ul-14-234", 	product: "fairy washing up liquid"},
						{id: "np-mmaa-s", 	product: "san miguel 4x330ml"},
						{id: "ul-234-908", 	product: "colgate toothpaste"},
						{id: "cc-998-sks", 	product: "crispy creme deep fat lard bar"}
					];


var generateTemperatureData = (tag)=>{
	return JSON.stringify({
							"id": "temperature/" + tag,
							"time": (new Date()).toISOString(),
							"value": (15 + Math.random() * 10).toFixed(1),
							"unit":"degrees celcius"
						})
}

var generateBulbData = ()=> {

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

var generateUtensilData = ()=> {
	
	return JSON.stringify({
						  	id: "ds/utensils",
						  	timestamp: Date.now(),
						  	values: [
								{name: 'utensil1', 		id: 1, value: !!Math.floor(Math.random() * 2) ? "in use":"not in use"},
								{name: 'utensil2', 		id: 2, value: !!Math.floor(Math.random() * 2) ? "in use":"not in use"},
						  	]
						});
}

var generateFMCGData = ()=> {

	var product = products[Math.floor(8 * Math.random())];
	product.value = "moved";

	return JSON.stringify({
						  	id: "ds/fmcgs",
						  	timestamp: Date.now(),
						  	values: [product]
						});

}

module.exports = {

	init: function(){

		const client = mqtt.connect('mqtt://mosquitto:1883');
		const fastmin = 500;
		const fastmax = 5000;

		const mediummin = 1000;
		const mediummax = 10000;

		const slowmin = 10000;
		const slowmax = 60000;

		client.on('connect', () => {  
		
			setInterval(() => {
				client.publish('temperature/TA', generateTemperatureData("TA"))
			}, Math.random() * (fastmax - fastmin) + fastmin) 
		
			setInterval(() => {
				client.publish('temperature/TB', generateTemperatureData("TB"))
			}, Math.random() * (fastmax - fastmin) + fastmin) 
		
			setInterval(() => {
				client.publish('temperature/TC', generateTemperatureData("TC"))
			}, Math.random() * (fastmax - fastmin) + fastmin) 
		
			setInterval(() => {
				client.publish('ds/bulbs', generateBulbData())
			}, Math.random() * (fastmax - fastmin) + fastmin) 

			setInterval(() => {
				client.publish('ds/utensils', generateUtensilData())
			}, Math.random() * (mediummax - mediummin) + mediummin) 

			setInterval(() => {
				client.publish('ds/fmcgs', generateFMCGData())
			}, Math.random() * (slowmax - slowmin) + slowmin) 


		})
	}
}
