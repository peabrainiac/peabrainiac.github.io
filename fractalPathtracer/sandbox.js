import Utils from "../js/Utils.js";

Utils.onPageLoad(function(){
	var WIDTH = 1280;
	var HEIGHT = 960;
	const ITERATIONS = 500;
	const STEPSIZE = 0.001;
	
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	
	var tracer = new FractalPathtracer();
	tracer.setSize(WIDTH,HEIGHT);
	tracer.setPosition(0,0);
	tracer.setZoom(0.8);
	tracer.setIterationCount(500);
	tracer.setSamples(25000000);
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
				}else{
					console.log("error, eval result is no function:");
					console.log(filterFunction,tracerFunction);
				}
			}catch (error){
				console.log("eval error!");
			}
		}else if (message.message=="setSize"){
			WIDTH = Math.round(message.width);
			HEIGHT = Math.round(message.height);
			canvas.width = WIDTH;
			canvas.height = HEIGHT;
			tracer.setSize(WIDTH,HEIGHT);
		}else if(message.message=="setPosition"){
			tracer.setPosition(1*message.posX,1*message.posY);
			tracer.setZoom(1*message.zoom);
		}else if (message.message=="setIterations"){
			tracer.setIterationCount(Math.round(message.iterations));
		}else if (message.message=="setSamples"){
			tracer.setSamples(message.samples);
		}else if (message.message=="render"){
			tracer.render();
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