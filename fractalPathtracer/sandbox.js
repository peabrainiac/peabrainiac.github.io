Utils.onPageLoad(function(){
	const WIDTH = 1280;
	const HEIGHT = 960;
	const POS_X = 0;
	const POS_Y = 0;
	const ZOOM = 0.8;
	const ITERATIONS = 500;
	const STEPSIZE = 0.001;
	
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	
	var tracer = new FractalPathtracer();
	tracer.setSize(WIDTH,HEIGHT);
	tracer.setPosition(POS_X,POS_Y);
	tracer.setZoom(ZOOM);
	tracer.setIterationCount(ITERATIONS);
	tracer.setStepSize(STEPSIZE);
	tracer.setFrameCount(500);
	tracer.setColor(255,192,0);
	tracer.setProgressCallback(onProgress);
	tracer.setFilterFunction(filterFunc);
	tracer.setTracerFunction(tracerFunc);
	tracer.render();
	
	window.addEventListener("message",function(e){
		console.log(e);
		var message = e.data;
		if (message.message=="setFormula"){
			try {
				var filterFunction = eval("("+message.filterFunc+")");
				var tracerFunction = eval("("+message.tracerFunc+")");
				if (filterFunction.constructor==Function||tracerFunction.constructor==Function){
					tracer.setFilterFunction(filterFunction);
					tracer.setTracerFunction(tracerFunction);
					tracer.render();
				}else{
					console.log("error, eval result is no function:");
					console.log(filterFunction,tracerFunction);
				}
			}catch (error){
				console.log("eval error!");
			}
		}
	});
	
	function onProgress(progress){
		ctx.putImageData(tracer.drawToImageData(),0,0);
		ctx.fillStyle = "#ffaf00";
		ctx.fillRect(0,0,(1-progress)*WIDTH,5);
	}
	
	function filterFunc(cx,cy,iter){
		var x = cx;
		var y = cy;
		var a = 1;
		var temp;
		for (var i=0;i<iter&&x*x+y*y<10;i++){
			a *= -1;
			temp = x*x-y*y+cx;
			y = 2*x*y*a+cy;
			x = temp;
		}
		return i<iter;
	}
	
	function tracerFunc(cx,cy,iter,emitPoint){
		var x = cx;
		var y = cy;
		var a = 1;
		var temp;
		for (var i=0;i<iter&&x*x+y*y<10;i++){
			a *= -1;
			temp = x*x-y*y+cx;
			y = 2*x*y*a+cy;
			x = temp;
			emitPoint(x,y);
		}
	}
});