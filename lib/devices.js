var blinkstick = require("blinkstick");

var devicesFound = blinkstick.findAll();

if(devicesFound.length<1) {
    console.error("You don't seem to have lights attached. Check the connection to your blinkstick and try again");
}

var devices = [];

devicesFound.forEach((device, i) => {
    devices.push(    {
        deviceController: device,
        numberOfLights: [process.argv[i+2] || 8],
        layers: [[]]
    });
});


module.exports = devices;