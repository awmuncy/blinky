var hexToRgb = require("./hexToRgb");
var devices = require("./devices");
var reduceLayers = require("./reduceLayers");

function refreshDeviceLights(device = 0) {


	colors = reduceLayers(devices[device].layers, 32);
	var finalLights = [];

	if(!Array.isArray(colors)) throw "Needs an array";
	colors.forEach(spot => {

        var c = hexToRgb(spot);

        // Because these dumb lights do GRB instead of RGB
		var triplet = [c[1], c[0], c[2]];
	

		finalLights.push(...triplet);
	});

	devices[device].deviceController.setColors(0, finalLights);
};

module.exports = refreshDeviceLights;