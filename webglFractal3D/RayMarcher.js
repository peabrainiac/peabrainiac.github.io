const RayMarcher = function(canvas){
	var exports = {};
	
	var gl = canvas.getContext("webgl2");
	
	var transformation1 = new Matrix3f();
	transformation1.scale(2);
	var offset1 = new Vector3f(0.5,0.5,0.5)
	
	var shaderProgram = Shaders.createShaderProgram(gl);
	shaderProgram.use();
	shaderProgram.loadMatrix3f("fractalTransformation1",transformation1);
	shaderProgram.loadVector3f("fractalOffset1",offset1);
	
	var vao = new Vao(gl);
	vao.addVbo(0,2,[-1,1,-1,-1,1,-1,1,-1,1,1,-1,1]);
	
	exports.render = function(width,height,camera){
		gl.viewport(0,0,width,height);
		gl.clearColor(0,0,0,1);
		gl.clear(gl.COLOR_BUFFER_BIT);
		shaderProgram.use();
		shaderProgram.loadFloat("screenRatio",width/height);
		shaderProgram.loadVector3f("cameraPosition",camera.getPosition());
		shaderProgram.loadMatrix3f("viewMatrix",camera.getViewMatrix());
		gl.drawArrays(gl.TRIANGLES,0,6);
	};
	
	exports.getDistanceToFractal = function(pos){
		var det = Math.pow(transformation1.getDeterminant(),0.33333);
		var factor = 1;
		var p = pos;
		for (var i=0;i<22;i++){
			p = p.abs();
			p.subtract(offset1);
			transformation1.apply(p);
			factor *= det;
		}
		return (p.length()-1)/factor;
	};
	exports.setTransformation1 = function(rotation1,rotation2,rotation3,scale){
		transformation1 = new Matrix3f();
		transformation1.rotate(rotation1,rotation2,rotation3);
		transformation1.scale(scale);
		shaderProgram.use();
		shaderProgram.loadMatrix3f("fractalTransformation1",transformation1);
	};
	exports.setOffset1 = function(x,y,z){
		offset1 = new Vector3f(x,y,z);
		shaderProgram.use();
		shaderProgram.loadVector3f("fractalOffset1",offset1);
	};
	
	
	return exports;
};