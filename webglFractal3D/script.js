Utils.onPageLoad(function(){
	var canvas = document.getElementById("canvas");
	var rayMarcher = new RayMarcher(canvas);
	var camera = new Camera(canvas);
	
	var inputManager = new InputManager();
	inputManager.onTransformationChange1(function(rotation1,rotation2,rotation3,scale){
        var pos = camera.getPosition();
        var dir = camera.getViewMatrix();
        var newTransform = rayMarcher.genTransformationMatrix(rotation1,rotation2,rotation3,scale);
        rayMarcher.changePointWithFormula(pos,dir,rayMarcher.getTransformation1(),rayMarcher.getOffset1(),newTransform,rayMarcher.getOffset1());
        camera.setPosition(pos);
        camera.setViewMatrix(dir);
		rayMarcher.setTransformation1(rotation1,rotation2,rotation3,scale);
	});
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
    camera.setPosition(new Vector3f(0,0,-5));
    camera.setViewMatrix(new Matrix3f());
	
	requestAnimationFrame(render);
    
    var prevTime = performance.now();
    var deltaTime = 0;
	
	function render(time){
		var width = canvas.offsetWidth;
		var height = canvas.offsetHeight;
		canvas.width = width;
		canvas.height = height;
		
		camera.setDistanceToFractal(rayMarcher.getDistanceToFractal(camera.getPosition()));
		camera.update();
		rayMarcher.render(width,height,camera);
        
        deltaTime *= 0.9;
        deltaTime += 0.1*(time-prevTime);
        document.getElementById("span-fps").innerHTML = "FPS: "+Math.round(1000/deltaTime);
        prevTime = time;
		
		requestAnimationFrame(render);
	}
});