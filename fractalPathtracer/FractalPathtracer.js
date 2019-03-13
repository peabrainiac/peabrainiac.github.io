const FractalPathtracer = function(){
	var exports = {};
	
	var width = 480;
	var height = 360;
	var posX = 0;
	var posY = 0;
	var zoom = 0.8;
	var iterations = 500;
	var minX = -2.25;
	var minY = -2.25;
	var maxX = 2.25;
	var maxY = 2.25;
	var stepSize = 0.001;
	var totalFrames = 500;
	var progressCallback;
	var fractalFilterFunction = standardFilter;
	var fractalTracerFunction = standardTracer;
	var colorR = 255;
	var colorG = 192;
	var colorB = 0;
	
	var grid;
	var imageData;
	var frame = 0;
	
	exports.setSize = function(w,h){
		width = w;
		height = h;
	};
	
	exports.setPosition = function(x,y){
		posX = x;
		posY = y;
	};
	
	exports.setZoom = function(z){
		zoom = z;
	};
	
	exports.setIterationCount = function(n){
		iterations = n;
	};
	
	exports.setStepSize = function(s){
		stepSize = s;
	};
	
	exports.setFrameCount = function(n){
		totalFrames = n;
	};
	
	exports.setColor = function(r,g,b){
		colorR = r;
		colorG = g;
		colorB = b;
	};
	
	exports.setFilterFunction = function(f){
		fractalFilterFunction = f;
	};
	
	exports.setTracerFunction = function(f){
		fractalTracerFunction = f;
	};
	
	exports.render = function(){
		frame = 0;
		grid = new Uint32Array(width*height);
		imageData = new ImageData(width,height);
		renderFrame(minX);
	};
	
	exports.setProgressCallback = function(callback){
		progressCallback = callback;
	};
	
	exports.drawToImageData = function(){
		var max = 0;
		for (let i=0,l=grid.length;i<l;i++){
			if (grid[i]>max){
				max = grid[i];
			}
		}
		var c;
		for (let i=0,l=grid.length;i<l;i++){
			c = Math.sqrt(grid[i]/(max+1));
			imageData.data[i*4] = Math.floor(colorR*c);
			imageData.data[i*4+1] = Math.floor(colorG*c);
			imageData.data[i*4+2] = Math.floor(colorB*c);
			imageData.data[i*4+3] = 255;
		}
		return imageData;
	};
	
	function renderFrame(startX){
		frame++;
		var endX = Math.min(minX+(frame/totalFrames)*(maxX-minX),maxX);
		for (var x=startX;x<endX;x+=stepSize){
			for (let y=minY;y<maxY;y+=stepSize){
				tracePath(x,y);
			}
		}
		if (progressCallback){
			progressCallback(frame/totalFrames);
		}
		if (x<maxX){
			setTimeout(function(){
				renderFrame(x);
			},0);
		}
	}

	function tracePath(xPos,yPos){
		if (fractalFilterFunction(xPos,yPos,iterations)){
			fractalTracerFunction(xPos,yPos,iterations,emitPoint);
		}
	}
	
	function emitPoint(x,y){
		let x2 = Math.round((x-posY)*zoom*(width/4)+width/2);
		let y2 = Math.round((y-posX)*zoom*(width/4)+height/2);
		if (x2>=0&&y2>=0&&x2<width&&y2<height){
			i2 = x2+y2*width;
			grid[i2]++;
		}
	}
	
	function standardFilter(cx,cy,iter){
		let x = cx;
		let y = cy;
		for (var i=0;i<iter&&x*x+y*y<10;i++){
			temp = x*x-y*y+cx;
			y = 2*x*y+cy;
			x = temp;
		}
		return i<iter;
	}
	
	function standardTracer(cx,cy,iter,emit){
		var x = cx;
		var y = cy;
		var temp;
		for (var i=0;i<iter&&x*x+y*y<10;i++){
			temp = x*x-y*y+cx;
			y = 2*x*y+cy;
			x = temp;
			emit(x,y);
		}
	};
	
	return exports;
};