export default class ReactionDiffusionSimulation {

	constructor(width=480,height=360){
		this._width = width;
		this._height = height;
		this._speed = 1;
		this._diffusionA = 1;
		this._diffusionB = 1;
		this._diffusionScale = 1;
		this._growthRateA = 0.023;
		this._deathRateB = 0.05;
		this._grid = new Float64Array(width*height*2);
		for (let i=0;i<this._grid.length;i++){
			this._grid[i] = Math.random()*Math.random();
		}
		this._prevGrid = new Float64Array(this._grid);
	}

	update(){
		const nextGrid = this._prevGrid;
		const prevGrid = this._grid;
		const speed = this._speed;
		const diffusionA = this._diffusionA*this._diffusionScale*0.95;
		const diffusionB = this._diffusionB*this._diffusionScale*0.95; 
		let growthRateA = this._growthRateA;
		let deathRateB = this._deathRateB;
		for (let x=1,w=this._width;x<w-1;x++){
			for (let y=1,h=this._height;y<h-1;y++){
				//growthRateA = (h-y)*0.125/w;
				//deathRateB = x*0.1/w;
				let i = (x+y*w)*2;
				let a = prevGrid[i];
				let b = prevGrid[i+1];
				let averageA = (prevGrid[i+2]+prevGrid[i-2]+prevGrid[i+w*2]+prevGrid[i-w*2])*0.2+(prevGrid[i+w*2+2]+prevGrid[i-w*2+2]+prevGrid[i+w*2-2]+prevGrid[i-w*2-2])*0.05;
				let averageB = (prevGrid[i+3]+prevGrid[i-1]+prevGrid[i+w*2+1]+prevGrid[i-w*2+1])*0.2+(prevGrid[i+w*2+3]+prevGrid[i-w*2+3]+prevGrid[i+w*2-1]+prevGrid[i-w*2-1])*0.05;
				nextGrid[i] = a+((averageA-a)*diffusionA-a*b*b+growthRateA*(1-a))*speed;
				nextGrid[i+1] = b+((averageB-b)*diffusionB+a*b*b-(deathRateB+growthRateA)*b)*speed;
			}
		}
		this._grid = nextGrid;
		this._prevGrid = prevGrid;
	}

	render(){
		let imageData = new ImageData(this._width,this._height);
		for (let i=0,l=this._width*this._height;i<l;i++){
			let c = this._grid[i*2+1]*256;
			imageData.data[i*4] = c;
			imageData.data[i*4+1] = c;
			imageData.data[i*4+2] = c;
			imageData.data[i*4+3] = 255;
		}
		return imageData;
	}

	set scale(scale){
		this._scale = scale;
		this._diffusionScale = 1/(scale*scale);
	}

	get scale(){
		return this._scale;
	}

	set growthRate(growthRate){
		this._growthRateA = growthRate;
		console.log("new growth rate:",growthRate);
	}

	get growthRate(){
		return this._growthRateA;
	}

	set deathRate(deathRate){
		this._deathRateB = deathRate;
		console.log("new death rate:",deathRate);
	}

	get deathRate(){
		return this._deathRateB;
	}

	set diffusionA(diffusionA){
		this._diffusionA = diffusionA;
	}

	get diffusionA(){
		return this._diffusionA;
	}

	set diffusionB(diffusionB){
		this._diffusionB = diffusionB;
	}

	get diffusionB(){
		return this._diffusionB;
	}

	get width(){
		return this._width;
	}

	get height(){
		return this._height;
	}

}