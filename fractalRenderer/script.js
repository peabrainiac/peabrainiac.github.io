Utils.onPageLoad(function(){
	const WIDTH = 1280;
	const HEIGHT = 960;
	const POS_X = 0;
	const POS_Y = 0;
	const ZOOM = 1;
	const ITERATIONS = 500;
	const MIN_X = -2.1;
	const MIN_Y = -2.1;
	const MAX_X = 2.1;
	const MAX_Y = 2.1;
	const LINES_PER_FRAME = 10;
	
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var imageData = new ImageData(WIDTH,HEIGHT);
	
	Utils.setSize(canvas,WIDTH,HEIGHT);
	Utils.setSize(canvas.parentElement,WIDTH,HEIGHT);
	
	renderFrame(0);
	
	function renderFrame(startX){
		var endX = Math.min(startX+LINES_PER_FRAME,WIDTH);
		for (var x=startX;x<endX;x++){
			for (let y=0;y<HEIGHT;y++){
				fillPixel(x,y);
			}
		}
		ctx.putImageData(imageData,0,0);
		ctx.fillStyle = "#ffaf00";
		ctx.fillRect(0,0,(1-x/WIDTH)*WIDTH,5);
		if (x<WIDTH){
			setTimeout(function(){
				renderFrame(x);
			},0);
		}
	}
	
	function fillPixel(pixelX,pixelY){
		var cx = POS_X+(pixelX-WIDTH/2)*ZOOM*(MAX_X-MIN_X)/WIDTH;
		var cy = POS_Y+(pixelY-HEIGHT/2)*ZOOM*(MAX_X-MIN_X)/WIDTH;
		var x = cx;
		var y = cy;
		var temp;
		for (var i=0;i<ITERATIONS&&(x*x+y*y<16);i++){
			if (i%2==0){
				temp = x*x-y*y+cx/2;//+cx;
				y = 2*x*y+cy/2;//+cy;
				x = temp;
			}else{
				temp = x*x-y*y+cx;
				y = 2*x*y+cy;
				x = temp;
			}
			//temp = (x*x*x-3*y*y*x)+cx;
			//y = (3*x*x*y-y*y*y)+cy;
			//x = temp;
			//cy *= -1;
		}
		var c = Math.sqrt((i/ITERATIONS)%1);
		var pixelI = pixelX+pixelY*WIDTH;
		imageData.data[pixelI*4] = Math.floor(256*c);
		imageData.data[pixelI*4+1] = Math.floor(192*c);
		imageData.data[pixelI*4+2] = 0;
		imageData.data[pixelI*4+3] = 255;
	}
});