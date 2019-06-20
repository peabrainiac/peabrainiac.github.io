const RayMarcher = function(canvas){
	var exports = {};
	
	var gl = canvas.getContext("webgl2");
	
	
	var shaderProgram = Shaders.createShaderProgram(gl);
	var vao = new Vao(gl);
	vao.addVbo(0,2,[-1,1,-1,-1,1,-1,1,-1,1,1,-1,1]);
	
	exports.render = function(width,height){
		gl.viewport(0,0,width,height);
		gl.clearColor(0,0,0,1);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.drawArrays(gl.TRIANGLES,0,6)
	}
	
	return exports;
};