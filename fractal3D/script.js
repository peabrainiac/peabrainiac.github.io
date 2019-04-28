Utils.onPageLoad(function(){
	const WIDTH = 1280;
	const HEIGHT = 960;
	const POS_X = 0.25;
	const POS_Y = 0;
	const POS_Z = 0;
	const ZOOM = 1;
	const ITERATIONS = 10;
	const MIN_X = -2.1;
	const MIN_Y = -2.1;
	const MIN_Z = -2.1;
	const MAX_X = 2.1;
	const MAX_Y = 2.1;
	const MAX_Z = 2.1;
	const RESOLUTION = 501;
	const LINES_PER_FRAME = 10;
	
	const VIEWMATRIX = [Math.sin(-Math.PI*2/3),Math.cos(-Math.PI*2/3),0,1,Math.sin(Math.PI*2/3),Math.cos(Math.PI*2/3)];
	const SCALE = 10;
	
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var imageData = new ImageData(WIDTH,HEIGHT);
	
	Utils.setSize(canvas,WIDTH,HEIGHT);
	Utils.setSize(canvas.parentElement,WIDTH,HEIGHT);
	
	renderFrame(0,0);
	
	function renderFrame(startX,startZ){
		var endX = Math.min(startX+LINES_PER_FRAME,RESOLUTION);
		var z = startZ;
		for (var x=startX;x<endX;x++){
			for (let y=0;y<RESOLUTION;y++){
				renderVoxel(MIN_X+(MAX_X-MIN_X)*(x+0.5)/RESOLUTION,MIN_Y+(MAX_Y-MIN_Y)*(y+0.5)/RESOLUTION,MIN_Z+(MAX_Z-MIN_Z)*(z+0.5)/RESOLUTION);
			}
		}
		ctx.fillStyle = "#ffaf00";
		ctx.fillRect(0,0,(z/RESOLUTION)*WIDTH,5);
		if (!(x<RESOLUTION)){
			x = 0;
			z++;
		}
		if (z<RESOLUTION){
			setTimeout(function(){
				renderFrame(x,z);
			},0);
		}
	}
	
	function renderVoxel(x,y,z){
		if (isInFractal(-x,-y,-z)){
			drawCube(x-POS_X,y-POS_Y,z-POS_Z);
		}
	}
	
	function isInFractal(cx,cy,cz,cw=0){
		var x = cx;
		var y = cy;
		var z = cz;
		var w = cw;
		var tx,ty,tz,tw;
		for (var i=0;(i<ITERATIONS)&&(x*x+y*y+z*z+w*w<4);i++){
			tx = x*x-y*y-z*z-w*w+cx;
			ty = 2*(x*y/*+z*w*/)+cy;
			tz = -2*(x*z/*+w*y*/)+cz;
			tw = 2*(x*w/*+y*z*/)+cw;
			x = tx;
			y = ty;
			z = tz;
			w = tw;
		}
		return (x*x+y*y+z*z+w*w<4);
	}
	
	function drawCube(x,y,z){
		var r = 1.1*(MAX_X-MIN_X)/RESOLUTION;
		ctx.fillStyle = "#808080";
		ctx.beginPath();
		lineTo(x+r/2,y-r/2,z-r/2);
		lineTo(x+r/2,y+r/2,z-r/2);
		lineTo(x+r/2,y+r/2,z+r/2);
		lineTo(x+r/2,y-r/2,z+r/2);
		ctx.fill();
		ctx.fillStyle = "#505050";
		ctx.beginPath();
		lineTo(x-r/2,y-r/2,z+r/2);
		lineTo(x+r/2,y-r/2,z+r/2);
		lineTo(x+r/2,y+r/2,z+r/2);
		lineTo(x-r/2,y+r/2,z+r/2);
		ctx.fill();
		ctx.fillStyle = "#b0b0b0";
		ctx.beginPath();
		lineTo(x-r/2,y+r/2,z-r/2);
		lineTo(x+r/2,y+r/2,z-r/2);
		lineTo(x+r/2,y+r/2,z+r/2);
		lineTo(x-r/2,y+r/2,z+r/2);
		ctx.fill();
	}
	
	function lineTo(x,y,z){
		ctx.lineTo(WIDTH/2+0.25*WIDTH*(x*VIEWMATRIX[0]+y*VIEWMATRIX[2]+z*VIEWMATRIX[4]),HEIGHT/2-0.25*WIDTH*(x*VIEWMATRIX[1]+y*VIEWMATRIX[3]+z*VIEWMATRIX[5]));
	}
});