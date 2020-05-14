//import Framebuffer from "../js/gl/Framebuffer.js";
//import Texture from "../js/gl/Texture.js";

export default class WebGLReactionDiffusionSimulation {

	constructor(canvas,width=480,height=360){
		this._canvas = canvas;
		canvas.width = width;
		canvas.height = height;
		this._gl = canvas.getContext("webgl2");
		this._width = width;
		this._height = height;
	}

	async update(){

	}

	async render(){

	}

	set scale(scale){
		this._scale = scale;
		this._diffusionScale = 1/(scale*scale);
	}

	get scale(){
		return this._scale;
	}

	set growthRate(growthRate){
		if (this._growthRateA!=growthRate){
			this._growthRateA = growthRate;
			console.log("new growth rate:",growthRate);
		}
	}

	get growthRate(){
		return this._growthRateA;
	}

	set deathRate(deathRate){
		if (this._deathRateB!=deathRate){
			this._deathRateB = deathRate;
			console.log("new death rate:",deathRate);
		}
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