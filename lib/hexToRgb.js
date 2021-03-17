module.exports = function hexToRgb(hex) {
	if(!hex) return [0,0,0];
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	var ob = result ? {
	  r: parseInt(result[1], 16),
	  g: parseInt(result[2], 16),
	  b: parseInt(result[3], 16)
	} : null;
	return [ob.r, ob.g, ob.b];
};