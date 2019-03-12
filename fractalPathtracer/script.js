Utils.onPageLoad(function(){
	const WIDTH = 1280;
	const HEIGHT = 960;
	const POS_X = 0.75;
	const POS_Y = -1.15;
	const ZOOM = 4;
	const ITERATIONS = 2000;
	const MIN_X = -2.1;
	const MIN_Y = -2.1;
	const MAX_X = 2.1;
	const MAX_Y = 2.1;
	const STEPSIZE = 0.0005;
	const LINES_PER_FRAME = 10;
	
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	
	Utils.setSize(canvas,WIDTH,HEIGHT);
	Utils.setSize(canvas.parentElement,WIDTH,HEIGHT);
	
	var tracer = new FractalPathtracer();
	tracer.setSize(WIDTH,HEIGHT);
	tracer.setProgressCallback(onProgress);
	tracer.render();
	
	function onProgress(progress){
		ctx.putImageData(tracer.drawToImageData(),0,0);
		ctx.fillStyle = "#ffaf00";
		ctx.fillRect(0,0,(1-progress)*WIDTH,5);
	}
});