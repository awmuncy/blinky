var blinkstick = require("blinkstick");
var devices = require('./lib/devices');
var express  = require("express");
var app = express();
// var { setRgb, hexToRgb, SetColors, from } = require("./util");
var refreshDeviceLights = require("./lib/refreshDeviceLights");

// Read persistent light data, set lights

app.listen(80, ()=>{
	console.log("Server started at " + new Date().toTimeString());
});



var template = props => {
	return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>${props.title} | Blinky</title>
			<style>
			.main {
				padding: 10px;
				max-width: 600px;
			}
			</style>
		</head>
		<body>
			<div class="main">
				${props.main}
			</div>	
		</body>
		</html>
	`;
}

app.use((req, res, next) => {
	var method, path, now, date, time, moment;

	method = req.method;
	path = req.path;
	now = new Date();
	date = now.toDateString();
	time = now.toTimeString();
	moment = `${date}, ${time}`;

	console.log(`${method} request to "${path}" at ${moment}`);
	next();
});

app.get("/", (req, res) => {
	res.json({
		metadata: [
			{name: "author", value: "Allen Muncy"},
			{name: "version", value: "1.0.0"}
		],
		links: [
			{name: 'self', href: '/'},
			{name: 'home', href: '/'},
			{name: 'shorthand', href: '/shorthand'}
		]
	
	});
});

app.get("/ui", (req, res) => {
	res.send(template({main: "Hello there", title: "WebUI for Blinky"}))
});

var shorthand = require("./routes/shorthand.js");
app.use("/shorthand", shorthand);


app.get("/layers", (req, res) => {
	res.send(devices[1].layers);
});

app.get("/clearDevice/:device", (req, res) => {

    devices[parseInt(req.params.device)].layers = [];
	refreshDeviceLights(req.params.device);
    res.send({message:`Cleared device ${req.params.device}`});
});

app.get("/clearAll", (req, res) => {
	devices.forEach((device, index) => {
		devices[index].layers = [];
		refreshDeviceLights(index);
	});

	res.send({message:"All devices cleared"});
});

app.get("/:loc/:color(([a-fA-F0-9]{6}|clear))", (req, res, next) => {
	var layer = req.query.layer ?? (parseInt(req.query.layer) || 0);
	var color = req.params.color;
	var spots = []; 
	var device = req.query.device ?? (parseInt(req.query.device) || 0);
	var locations = req.params.loc.split("-");
	if(locations.length==2) {
		let start = parseInt(locations[0]);
		let finish = parseInt(locations[1]);

		while (start<=finish) {
			spots[start] = color;
			start++;
		}

	} else {

		spots[req.params.loc] = color;
	}
	
	spots.forEach((spot, index) => {
		
		devices[device].layers[layer] ? null : devices[device].layers[layer] = [];
		devices[device].layers[layer][index] = spot == "clear" ? undefined : color;
	});




	refreshDeviceLights(device);

	res.json({success: true, deviceLayers: devices[device].layers});
});


app.get("/healthcheck", (req, res) => {
	var sticks = blinkstick.findAll();
	if(sticks.length < 1) {
		console.log("Someone checked and there was no stick connected");
		res.status(503).json({status: "bad"});
	} else {
		res.json({status: "good"});
	}

});


var signedOff = false;
var exit = function() {
	
    if(!signedOff) {
		console.log("\n Closing server");
		signedOff = true;
	}
	
    process.exit();
}

process.on('exit', exit);
process.on('SIGINT', exit);
