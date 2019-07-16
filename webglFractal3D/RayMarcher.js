const RayMarcher = function(canvas){
	var exports = {};
	
	var gl = canvas.getContext("webgl2",{preserveDrawingBuffer:true});
    if (!gl){
        throw new Error("Couldn't get webgl2 context!")
    }
    var ext = gl.getExtension("EXT_COLOR_BUFFER_FLOAT");
    if (!ext){
        throw new Error("Couldn't get EXT_COLOR_BUFFER_FLOAT extension!")
    }
	
	var shaderProgram = Shaders.createShaderProgram(gl);
	shaderProgram.use();
    shaderProgram.bindTextureLocation(0),"startValuesSampler";
    
	var simpleShader = Shaders.createSimpleShaderProgram(gl);
    simpleShader.use();
	simpleShader.bindTextureLocation(0,"sampler");
    
    var bundleShader = Shaders.createBundleShaderProgram(gl);
    bundleShader.use();

	var transformation1, offset1,  iterations;
	
    var bundling = true;
    var bundleSize = 8;
    var bundlePrecision = 0.2;
	var smoothingRadius = 5;
	var pixelSize = 4;
	
	function init(){
		exports.setTransformation1(0,0,0,2);
        exports.setOffset1(0,0,1);
		exports.setShadowMode(exports.AMBIENT_OCCLUSION+exports.NORMAL_SHADOWS);
	}
	
    var texture = new Texture(gl);
    texture.setFormat(gl.RGBA32F,gl.RGBA,0,0,gl.FLOAT);
    var framebuffer = new Framebuffer(gl);
    framebuffer.attachTexture(texture,gl.COLOR_ATTACHMENT0)
    
	var texture2 = new Texture(gl);
	var framebuffer2 = new Framebuffer(gl);
	framebuffer2.attachTexture(texture2,gl.COLOR_ATTACHMENT0);
	var defaultBuffer = new Framebuffer(gl,null);
	defaultBuffer.bind();
	
	var vao = new Vao(gl);
	vao.addVbo(0,2,[-1,1,-1,-1,1,-1,1,-1,1,1,-1,1]);
	
	exports.render = function(width,height,camera){
        framebuffer.setSize(width/(pixelSize*bundleSize),height/(pixelSize*bundleSize));
        framebuffer.bind();
        framebuffer.clear(0,0,0,0);
        if (bundling){
            bundleShader.use();
            bundleShader.loadFloat("screenRatio",width/height);
            bundleShader.loadFloat("bundleSize",bundlePrecision*(smoothingRadius+bundleSize)*pixelSize/Math.sqrt(width*height));
            bundleShader.loadVector3f("cameraPosition",camera.getPosition());
            bundleShader.loadMatrix3f("viewMatrix",camera.getViewMatrix());
            gl.drawArrays(gl.TRIANGLES,0,6);
        }
        
		framebuffer2.setSize(width/pixelSize,height/pixelSize);
		framebuffer2.bind();
		framebuffer2.clear(0,0,0,1);
		shaderProgram.use();
		shaderProgram.loadFloat("minDistance",smoothingRadius*pixelSize/Math.sqrt(width*height));
		shaderProgram.loadFloat("screenRatio",width/height);
		shaderProgram.loadVector3f("cameraPosition",camera.getPosition());
		shaderProgram.loadMatrix3f("viewMatrix",camera.getViewMatrix());
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D,texture.texture);
		gl.drawArrays(gl.TRIANGLES,0,6);
		
		defaultBuffer.setSize(width,height);
		defaultBuffer.bind();
		defaultBuffer.clear(0,0,0,1);
		simpleShader.use();
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D,texture2.texture);
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
		transformation1 = exports.genTransformationMatrix(rotation1,rotation2,rotation3,scale);
		iterations = Math.min(Math.floor(7/Math.log10(scale)),200);
		shaderProgram.use();
		shaderProgram.loadMatrix3f("fractalTransformation1",transformation1);
		shaderProgram.loadInt("iterations",iterations);
		bundleShader.use();
		bundleShader.loadMatrix3f("fractalTransformation1",transformation1);
		bundleShader.loadInt("iterations",iterations);
	};
	exports.setOffset1 = function(x,y,z){
		offset1 = new Vector3f(x,y,z);
		shaderProgram.use();
		shaderProgram.loadVector3f("fractalOffset1",offset1);
        bundleShader.use();
        bundleShader.loadVector3f("fractalOffset1",offset1);
	};
    exports.getTransformation1 = function(){
        return transformation1;
    };
    exports.getOffset1 = function(){
        return offset1;
    };
	exports.setPixelSize = function(ps){
		pixelSize = ps;
	};
	exports.setSmoothingRadius = function(rad){
		smoothingRadius = rad;
	};
    exports.setBundling = function(b){
        bundling = b;
    };
    exports.setBundleSize = function(bs){
        bundleSize = bs;
    };
    exports.setBundlePrecision = function(p){
        bundlePrecision = p;
    };
    exports.genTransformationMatrix = function(rotation1,rotation2,rotation3,scale){
        var matrix = new Matrix3f();
        matrix.rotate(rotation1,rotation2,rotation3);
        matrix.scale(scale);
        return matrix;
    };
    exports.changePointWithFormula = function(position,direction,oldTransform,oldOffset,newTransform,newOffset){
        var iter = 0;
        var p = position.copy();
        var d = direction.copy();
        var oldTransformNormalized = oldTransform.copy();
        oldTransformNormalized.normalize();
        var signs = [];
        while(p.length()<5&&iter<100){
            signs.push(new Vector3f(p.x>0?1:-1,p.y>0?1:-1,p.z>0?1:-1));
            p = p.abs();
            d.scaleColumns(signs[iter]);
            p.subtract(oldOffset);
            oldTransform.apply(p);
            oldTransformNormalized.apply(d);
            iter++;
        }
        var newTransformInverse = newTransform.getInverse();
        var newTransformInverseNormalized = newTransformInverse.copy();
        newTransformInverseNormalized.normalize();
        while(iter>0){
            iter--;
            newTransformInverseNormalized.apply(d);
            newTransformInverse.apply(p);
            p.add(newOffset);
            d.scaleColumns(signs[iter]);
            p.x = Math.max(p.x,0);
            p.y = Math.max(p.y,0);
            p.z = Math.max(p.z,0);
            p.multiplyComponents(signs[iter]);
        }
        position.setTo(p);
        direction.setTo(d);
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