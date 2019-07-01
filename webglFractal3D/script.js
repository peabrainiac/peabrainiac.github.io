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
    camera.setPosition(new Vector3f(0,0,-5));
    camera.setViewMatrix(new Matrix3f());
	
	requestAnimationFrame(render);
	
	function render(){
		var width = canvas.offsetWidth;
		var height = canvas.offsetHeight;
		canvas.width = width;
		canvas.height = height;
		
		camera.setSpeed(rayMarcher.getDistanceToFractal(camera.getPosition()));
		camera.update();
		rayMarcher.render(width,height,camera);
		
		requestAnimationFrame(render);
	}
});