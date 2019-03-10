Utils.onPageLoad(function(){
	const WIDTH = 960;
	const HEIGHT = 720;
	const POS_X = 0.75;
	const POS_Y = -1.15;
	const ZOOM = 4;
	const ITERATIONS = 5000;
	const MIN_X = -2.1;
	const MIN_Y = -2.1;
	const MAX_X = 2.1;
	const MAX_Y = 2.1;
	const STEPSIZE = 0.00025;
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
	
	/*var grid = new Uint32Array(WIDTH*HEIGHT);
	var imageData = ctx.createImageData(WIDTH,HEIGHT);
	
	renderFrame(MIN_X);
		
	function renderFrame(startX){
		var endX = Math.min(startX+LINES_PER_FRAME*STEPSIZE,MAX_X);
		for (var x=startX;x<endX;x+=STEPSIZE){
			for (let y=MIN_Y;y<MAX_Y;y+=STEPSIZE){
				tracePath(x,y);
			}
		}
		draw(x);
		if (x<MAX_X){
			setTimeout(function(){
				renderFrame(x);
			},0);
		}
	}
	
	function draw(x){
		var max = 0;
		for (let i=0,l=grid.length;i<l;i++){
			if (grid[i]>max){
				max = grid[i];
			}
		}
		var c;
		for (let i=0,l=grid.length;i<l;i++){
			c = Math.sqrt(grid[i]/(max+1));
			imageData.data[i*4] = Math.floor(256*c);
			imageData.data[i*4+1] = Math.floor(192*c);
			imageData.data[i*4+2] = 0;
			imageData.data[i*4+3] = 255;
		}
		ctx.putImageData(imageData,0,0);
		ctx.fillStyle = "#ffaf00";
		ctx.fillRect(0,0,WIDTH*(x-MIN_X)/(MAX_X-MIN_X),5);
	}
	
	function tracePath(xPos,yPos){
		var x = xPos;
		var y = yPos;
		var temp;
		for (var i=0;i<ITERATIONS&&x*x+y*y<10;i++){
			temp = x*x-y*y+xPos;
			y = Math.abs(2*x*y)+yPos;
			x = temp;
		}
		if (i<ITERATIONS){
			x = xPos;
			y = yPos;
			var x2,y2,i2;
			for (var i=0;i<ITERATIONS&&x*x+y*y<10;i++){
				temp = x*x-y*y+xPos;
				y = Math.abs(2*x*y)+yPos;
				x = temp;
				var x2 = Math.round((x-POS_X)*ZOOM*(WIDTH/4)+WIDTH/2);
				var y2 = Math.round((y-POS_Y)*ZOOM*(WIDTH/4)+HEIGHT/2);
				if (x2>=0&&y2>=0&&x2<WIDTH&&y2<HEIGHT){
					i2 = x2+y2*WIDTH;
					grid[i2]++;
				}
			}
		}
	}*/
});