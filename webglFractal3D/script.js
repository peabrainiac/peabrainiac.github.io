Utils.onPageLoad(function(){
	var canvas = document.getElementById("canvas");
	var rayMarcher = new RayMarcher(canvas);
	var camera = new Camera(canvas);
	
	requestAnimationFrame(render);
	
	function render(){
		var width = canvas.offsetWidth;
		var height = canvas.offsetHeight;
		canvas.width = width;
		canvas.height = height;
		
		camera.update();
		rayMarcher.render(width,height,camera);
		
		requestAnimationFrame(render);
	}
});