var blinkstick = require("blinkstick");
var fetch = require("node-fetch");
var {
	setRgb,
	hexToRgb
} = require("./util");
const fs  = require('fs');

setInterval(() => {
    // fetch("http://localhost/healthcheck").then(result => {
    fetch("http://zero.allenmuncy.com/healthcheck").then(result => {


		if(result.status>200) {
            // PROBLEMS
			var colors = setRgb(...hexToRgb(`#ff0011`));
			statusIndicator.setColors(0, colors);
		} else {
            // All good
			setTimeout(() => {
				var colors = setRgb(...hexToRgb(`#000100`)); // Perm
				statusIndicator.setColors(0, colors);				
			}, 100); 
		}  


		var colors = setRgb(...hexToRgb(`#000200`)); // Blink
		statusIndicator.setColors(0, colors);
   
    }).catch(err => {
		fs.appendFile("newfile.txt", new Date().toDateString() + " " + new Date().toLocaleTimeString() + "\n", () => {});
		var colors = setRgb(...hexToRgb(`#ff0000`));
		statusIndicator.setColors(0, colors);
    });
}, 60000);

var arr = blinkstick.findAll();
var statusIndicator = arr[0];


var exit = function() {
    console.log("Don't be effing rude.");
    statusIndicator.setColor("#000000");
    process.exit();
}

console.log("We're up");

process.on('exit', exit);
process.on('SIGINT', exit);
