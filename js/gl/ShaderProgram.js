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
	
	var uniformLocations = {};
	
	exports.bindAttribLocation = function(location,name){
		gl.bindAttribLocation(shaderProgram,location,name);
	};
	exports.getUniformLocation = function(name){
		if (!uniformLocations.hasOwnProperty(name)){
			if(name in uniformLocations){
				throw new Error("Invalid uniform name:  \""+name+"\"!");
			}else{
				uniformLocations[name] = gl.getUniformLocation(shaderProgram,name);
			}
		}
		return uniformLocations[name];
	};
	exports.bindTextureLocation = function(location,name){
		gl.uniform1i(exports.getUniformLocation(name),location);
	};
	exports.loadFloat = function(name,value){
		gl.uniform1f(exports.getUniformLocation(name),value);
	};
	exports.loadVector3f = function(name,vector){
		gl.uniform3f(exports.getUniformLocation(name),vector.x,vector.y,vector.z);
	};
	exports.loadMatrix3f = function(name,matrix){
		gl.uniformMatrix3fv(exports.getUniformLocation(name),false,matrix.toArray());
	};
	exports.loadInt = function(name,value){
		gl.uniform1i(exports.getUniformLocation(name),value);
	};
	
	Object.freeze(exports);
	return exports;
};