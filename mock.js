const devices = [
	"iPhone, de:ad:be:ee:ff:aa",
	"none, ee:ff:aa:ff:12:23",
	"Julie hak, 12:34:45:67:65:1f"
];

export default function next(type){
	switch (type){
		
		case "bluetooth":
			return `${Date.now()-1045},${Date.now()},${devices[Math.ceil(Math.random() * devices.length-1)]},${ (100*Math.random()).toFixed(2)}\n`
			
		case "accelerometer":
		case "linear-acceleration":
		case "magnetometer":
		case "gravity":
		case "gyroscope":
			return  `${Date.now()-1045},${(50*Math.random()).toFixed(2)},${(50*Math.random()).toFixed(2)},${(50*Math.random()).toFixed(2)}\n`;
		
		case "rotation":
			return  `${Date.now()-1045},${(50*Math.random()).toFixed(2)},${(50*Math.random()).toFixed(2)},${(50*Math.random()).toFixed(2)},0,0\n`;
		
		case "battery":
			return `${Date.now()},${Math.floor(100*Math.random())},${Math.floor(300*Math.random())},${Math.floor(300*Math.random())},usb,not charging,good\n`;
			
		case "audio-level":
		case "light":
			return `${Date.now()},${(20000*Math.random()).toFixed(2)}\n`
		
	}
	return ""
}