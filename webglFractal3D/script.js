Utils.onPageLoad(function(){
	var scrollbar = new Scrollbar(document.getElementById("scroll-container"));
    try {
        var canvas = document.getElementById("canvas");
        var rayMarcher = new RayMarcher(canvas);
        var camera = new Camera(canvas);
    }catch (e){
        Errors.showError(e);
    }
	
    var formula = {};
    formula.copy = function(){
        return {rotation:this.rotation.copy(),scale:this.scale,offset:this.offset.copy(),copy:this.copy};  
    };
    
	var inputManager = new InputManager();
	inputManager.onTransformationChange1(setTransformation);
    inputManager.onOffsetChange1(setOffset);
	inputManager.onPixelSizeChange(function(pixelSize){
		rayMarcher.setPixelSize(pixelSize);
	});
	inputManager.onShadowModeChange(function(mode){
		rayMarcher.setShadowMode(mode);
	});
	inputManager.onSmoothingRadiusChange(function(smoothingRadius){
		rayMarcher.setSmoothingRadius(smoothingRadius);
	});
    inputManager.onSpeedModifierChange(function(speedModifier){
        camera.setSpeedModifier(speedModifier);
    });
    inputManager.onBundlingChange(function(bundling){
        rayMarcher.setBundling(bundling);
    });
    inputManager.onBundleSizeChange(function(bundleSize){
        rayMarcher.setBundleSize(bundleSize);
    });
    inputManager.onBundlePrecisionChange(function(precision){
        rayMarcher.setBundlePrecision(precision);
    });
    inputManager.onSizeChange(function(width,height){
        canvas.parentElement.style.width = width+"px";
        canvas.parentElement.style.height = height+"px";
    });
    camera.setPosition(new Vector3f(0,0,-5));
    camera.setViewMatrix(new Matrix3f());
	
	requestAnimationFrame(render);
    
    var prevTime = performance.now();
    var deltaTime = 0;
    
    var animating = false;
    var repeatAnimation = false;
    var animationLength = document.getElementById("input-animation-length").value;
    var animationProgress = 0;
    
    var prevFormula, nextFormula;
    
    document.getElementById("input-animation-length").addEventListener("input",function(){
        animationLength = document.getElementById("input-animation-length").value;
    });
    
    document.getElementById("input-animation-repeat").addEventListener("change",function(){
        repeatAnimation = document.getElementById("input-animation-repeat").checked;
    });
    
    document.getElementById("input-button-animate").addEventListener("click",function(){
        prevFormula = formula.copy();
        nextFormula = formula.copy();
        nextFormula.rotation.x = Math.floor(Math.random()*360);
        nextFormula.rotation.y = Math.floor(Math.random()*360);
        nextFormula.rotation.z = Math.floor(Math.random()*360);
        nextFormula.scale = 1.2+Math.random();
        nextFormula.offset.x = 2-3*Math.random()*Math.random();
        nextFormula.offset.y = 2-3*Math.random()*Math.random();
        nextFormula.offset.z = 2-3*Math.random()*Math.random();
        nextFormula.offset.normalize();
        nextFormula.offset.scale(1-0.75*Math.random()*Math.random());
        animating = true;
        animationProgress = 0;
    });
    
    var width = 0;
    var height = 0;
	
	function render(time){
        if (width!=canvas.offsetWidth||height!=canvas.offsetHeight){
            width = canvas.offsetWidth;
            height = canvas.offsetHeight;
            canvas.width = width;
            canvas.height = height;
            inputManager.setSizeDisplay(width,height);
        }
        
        if (animating){
            animationProgress += (time-prevTime)/(animationLength*1000);
            if (animationProgress>=1){
                animationProgress = 1;
                animating = false;
            }
            if (repeatAnimation&&animationProgress>0.5){
                document.getElementById("input-button-animate").click();
            }
            formula.rotation = animationBlend3f(prevFormula.rotation,nextFormula.rotation);
            formula.scale = animationBlend(prevFormula.scale,nextFormula.scale);
            formula.offset = animationBlend3f(prevFormula.offset,nextFormula.offset);
            inputManager.setTransformation1(formula.rotation.x,formula.rotation.y,formula.rotation.z,formula.scale);
            inputManager.setOffset1(formula.offset.x,formula.offset.y,formula.offset.z);
            setTransformation(formula.rotation.x,formula.rotation.y,formula.rotation.z,formula.scale);
            setOffset(formula.offset.x,formula.offset.y,formula.offset.z);
        }
		
		camera.setDistanceToFractal(rayMarcher.getDistanceToFractal(camera.getPosition()));
		camera.update();
		rayMarcher.render(width,height,camera);
        
        deltaTime *= 0.98;
        deltaTime += 0.02*(time-prevTime);
        document.getElementById("span-fps").innerHTML = "FPS: "+Math.round(1000/deltaTime);
        prevTime = time;
		
		requestAnimationFrame(render);
	}
    
    function animationBlend(v1,v2){
        return v1+(v2-v1)*(1-(1-animationProgress)*(1-animationProgress));
    }
    
    function animationBlend3f(v1,v2){
        return new Vector3f(animationBlend(v1.x,v2.x),animationBlend(v1.y,v2.y),animationBlend(v1.z,v2.z));
    }
    
    function setTransformation(rotation1,rotation2,rotation3,scale){
        formula.rotation = new Vector3f(rotation1,rotation2,rotation3);
        formula.scale = scale;
        var pos = camera.getPosition();
        var dir = camera.getViewMatrix();
        var newTransform = rayMarcher.genTransformationMatrix(rotation1,rotation2,rotation3,scale);
        rayMarcher.changePointWithFormula(pos,dir,rayMarcher.getTransformation1(),rayMarcher.getOffset1(),newTransform,rayMarcher.getOffset1());
        camera.setPosition(pos);
        camera.setViewMatrix(dir);
		rayMarcher.setTransformation1(rotation1,rotation2,rotation3,scale);
	}
    
    function setOffset(offsetX,offsetY,offsetZ){
        formula.offset = new Vector3f(offsetX,offsetY,offsetZ);
        var pos = camera.getPosition();
        var dir = camera.getViewMatrix();
        var newOffset = new Vector3f(offsetX,offsetY,offsetZ);
        rayMarcher.changePointWithFormula(pos,dir,rayMarcher.getTransformation1(),rayMarcher.getOffset1(),rayMarcher.getTransformation1(),newOffset);
        camera.setPosition(pos);
        camera.setViewMatrix(dir);
        rayMarcher.setOffset1(offsetX,offsetY,offsetZ);
    }
});