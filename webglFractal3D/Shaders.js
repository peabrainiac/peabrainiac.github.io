const Shaders = (function(){
	var exports = {};
	
	exports.createShaderProgram = async function(gl){
		var vertexSource = await ((await fetch("rayVertex.glsl")).text());
		var fragmentSource = await ((await fetch("rayFragment.glsl")).text());
		var shaderProgram = new ShaderProgram(gl,vertexSource,fragmentSource);
		shaderProgram.bindAttribLocation(0,"position");
		return shaderProgram;
	};

	exports.createBundleShaderProgram = async function(gl){
		var vertexSource = await ((await fetch("bundleVertex.glsl")).text());
		var fragmentSource = await ((await fetch("bundleFragment.glsl")).text());
		var shaderProgram = new ShaderProgram(gl,vertexSource,fragmentSource);
		shaderProgram.bindAttribLocation(0,"position");
		return shaderProgram;
	};
    
	exports.createSimpleShaderProgram = async function(gl){
		var vertexSource = await ((await fetch("simpleVertex.glsl")).text());
		var fragmentSource = await ((await fetch("simpleFragment.glsl")).text());
		var shaderProgram = new ShaderProgram(gl,vertexSource,fragmentSource);
		shaderProgram.bindAttribLocation(0,"position");
		return shaderProgram;
	};
	
	Object.freeze(exports);
	return exports;
})();;