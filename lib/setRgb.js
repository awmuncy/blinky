module.exports = function setRgb(r=255, g=255, b=255) {
	var color = [g, r, b];
	var i = 0;
	var data = [];
	while(i < 8) {
		data.push(...color);
		i++;
	}

	return data;
};