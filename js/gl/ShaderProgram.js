const ShaderProgram = function(gl, vertexSource, fragmentSource){
	var exports = {};
	
	var vertexShader = loadShader(gl,gl.VERTEX_SHADER,vertexSource);
	var fragmentShader = loadShader(gl,gl.FRAGMENT_SHADER,fragmentSource);
	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram,vertexShader);
	gl.attachShader(shaderProgram,fragmentShader);
	gl.linkProgram(shaderProgram);
	gl.useProgram(shaderProgram);
	if (!gl.getProgramParameter(shaderProgram,gl.LINK_STATUS)){
		throw new Error("Failed to link shader program! "+gl.getProgramInfoLog());
	}
	
	function loadShader(gl, type, source){
		var shader = gl.createShader(type);
		gl.shaderSource(shader,source);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
			throw new Error("Could not compile shader! "+gl.getShaderInfoLog(shader));
		}
		return shader;
	}
	exports.use = function(){
		gl.useProgram(shaderProgram);
	};
	
	exports.attribLocations = {};
	exports.uniformLocations = {};
	
	exports.bindAttribLocation = function(location,name){
		gl.bindAttribLocation(shaderProgram,location,name);
	};
	
	Object.freeze(exports);
	return exports;
};