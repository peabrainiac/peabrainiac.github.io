const FractalPathtracer = function(){
	var exports = {};
	
	var width = 480;
	var height = 360;
	var posX = 0;
	var posY = 0;
	var zoom = 0.8;
	var iterations = 25000;
	var minX = -2.1;
	var minY = -2.1;
	var maxX = 2.1;
	var maxY = 2.1;
	var stepSize = 0.0005;
	var totalFrames = 500;
	var progressCallback;
	
	var grid;
	var imageData;
	var frame = 0;
	
	exports.setSize = function(w,h){
		width = w;
		height = h;
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
			imageData.data[i*4] = Math.floor(256*c);
			imageData.data[i*4+1] = Math.floor(192*c);
			imageData.data[i*4+2] = 0;
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
		var x = xPos;
		var y = yPos;
		var temp;
		var a = 1;
		for (var i=0;i<iterations&&x*x+y*y<10;i++){
			a *= -1;
			temp = x*x-y*y+xPos;
			//y = Math.abs(2*x*y)+yPos;
			y = 2*x*y*a+yPos;
			x = temp;
		}
		if (i<iterations){
			x = xPos;
			y = yPos;
			a = 1;
			var x2,y2,i2;
			for (var i=0;i<iterations&&x*x+y*y<10;i++){
				a *= -1;
				temp = x*x-y*y+xPos;
				//y = Math.abs(2*x*y)+yPos;
				y = 2*x*y*a+yPos;
				x = temp;
				var x2 = Math.round((x-posY)*zoom*(width/4)+width/2);
				var y2 = Math.round((y-posX)*zoom*(width/4)+height/2);
				if (x2>=0&&y2>=0&&x2<width&&y2<height){
					i2 = x2+y2*width;
					grid[i2]++;
				}
			}
		}
	}
	
	return exports;
};