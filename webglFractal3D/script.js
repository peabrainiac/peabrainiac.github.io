Utils.onPageLoad(function(){
	var canvas = document.getElementById("canvas");
	var rayMarcher = new RayMarcher(canvas);
	var camera = new Camera(canvas);
	
	var inputManager = new InputManager();
	inputManager.onTransformationChange1(function(rotation1,rotation2,rotation3,scale){
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