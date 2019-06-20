Utils.onPageLoad(function(){
	var canvas = document.getElementById("canvas");
	var rayMarcher = new RayMarcher(canvas);
	
	requestAnimationFrame(render);
	
	function render(){
		var width = canvas.offsetWidth;
		var height = canvas.offsetHeight;
		canvas.width = width;
		canvas.height = height;
		rayMarcher.render(width,height);
		
		requestAnimationFrame(render);
	}
});