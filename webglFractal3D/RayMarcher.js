const RayMarcher = function(canvas){
	var exports = {};
	
	var gl = canvas.getContext("webgl2",{preserveDrawingBuffer:true});
	
	var shaderProgram = Shaders.createShaderProgram(gl);
	shaderProgram.use();

	var transformation1, offset1,  iterations;
	
	function init(){
		exports.setTransformation1(0,0,0,2);
		offset1 = new Vector3f(0.5,0.5,0.5);
		shaderProgram.loadVector3f("fractalOffset1",offset1);
		exports.setShadowMode(exports.AMBIENT_OCCLUSION+exports.NORMAL_SHADOWS);
	}
	
	var simpleShader = Shaders.createSimpleShaderProgram(gl);
	simpleShader.bindTextureLocation(0,"sampler");
	
	var pixelSize = 4;
	var smoothingRadius = 5;
	
	var texture = new Texture(gl);
	var framebuffer = new Framebuffer(gl);
	framebuffer.attachTexture(texture,gl.COLOR_ATTACHMENT0);
	var defaultBuffer = new Framebuffer(gl,null);
	defaultBuffer.bind();
	
	var vao = new Vao(gl);
	vao.addVbo(0,2,[-1,1,-1,-1,1,-1,1,-1,1,1,-1,1]);
	
	exports.render = function(width,height,camera){
		framebuffer.setSize(width/pixelSize,height/pixelSize);
		framebuffer.bind();
		framebuffer.clear(0,0,0,1);
		shaderProgram.use();
		shaderProgram.loadFloat("minDistance",smoothingRadius*pixelSize/Math.sqrt(width*height));
		shaderProgram.loadFloat("screenRatio",width/height);
		shaderProgram.loadVector3f("cameraPosition",camera.getPosition());
		shaderProgram.loadMatrix3f("viewMatrix",camera.getViewMatrix());
		gl.drawArrays(gl.TRIANGLES,0,6);
		
		defaultBuffer.setSize(width,height);
		defaultBuffer.bind();
		defaultBuffer.clear(0,0,0,1);
		simpleShader.use();
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D,texture.texture);
		gl.drawArrays(gl.TRIANGLES,0,6);
	};
	
	exports.getDistanceToFractal = function(pos){
		var det = Math.pow(transformation1.getDeterminant(),0.33333);
		var factor = 1;
		var p = pos;
		for (var i=0;i<iterations;i++){
			p = p.abs();
			p.subtract(offset1);
			transformation1.apply(p);
			factor *= det;
		}
		return (p.length()-1)/factor;
	};
	exports.setTransformation1 = function (rotation1,rotation2,rotation3,scale){
		transformation1 = new Matrix3f();
		transformation1.rotate(rotation1,rotation2,rotation3);
		transformation1.scale(scale);
		shaderProgram.use();
		shaderProgram.loadMatrix3f("fractalTransformation1",transformation1);
		iterations = Math.min(Math.floor(7/Math.log10(scale)),200);
		shaderProgram.loadInt("iterations",iterations);
	};
	exports.setOffset1 = function(x,y,z){
		offset1 = new Vector3f(x,y,z);
		shaderProgram.use();
		shaderProgram.loadVector3f("fractalOffset1",offset1);
	};
	exports.setPixelSize = function(ps){
		pixelSize = ps;
	};
	exports.setSmoothingRadius = function(rad){
		smoothingRadius = rad;
	};
	
	exports.AMBIENT_OCCLUSION = 1;
	exports.NORMAL_SHADOWS = 2;
	exports.setShadowMode = function (mode){
		shaderProgram.use();
		shaderProgram.loadInt("shadowMode",mode);
	};
	
	init();
	return exports;
};