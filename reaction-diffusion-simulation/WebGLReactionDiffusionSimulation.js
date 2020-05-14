import Framebuffer from "../js/gl/Framebuffer.js";
import Texture from "../js/gl/Texture.js";
import ShaderProgram from "../js/gl/ShaderProgram.js";
import Vao from "../js/gl/Vao.js";

export default class WebGLReactionDiffusionSimulation {

	constructor(canvas,width=480,height=360){
		this._canvas = canvas;
		canvas.width = width;
		canvas.height = height;
		this._gl = canvas.getContext("webgl2");
		this._width = width;
		this._height = height;
		let data = new Uint8Array(width*height*4);
		for (let i=0;i<data.length;i+=4){
			data[i] = Math.floor(256*Math.random());
			data[i+1] = Math.floor(256*Math.random());
		}
		this._texture = new Texture(this._gl,width,height,data);
		this._framebuffer = new Framebuffer(this._gl);
		this._framebuffer.setSize(width,height);
		this._framebuffer.attachTexture(this._texture,this._gl.COLOR_ATTACHMENT0);
		this._mainFramebuffer = new Framebuffer(this._gl,null);
		this._mainFramebuffer.setSize(width,height);
		this._readyPromise = new Promise(async(resolve,reject)=>{
			try {
				let vertexSource = await (await fetch("render.vert")).text();
				let fragmentSource = await (await fetch("render.frag")).text();
				this._renderShader = new ShaderProgram(this._gl,vertexSource,fragmentSource);
				this._renderShader.bindAttribLocation(0,"position");
				this._renderShader.bindAttribLocation(1,"textureCoords");
				this._renderShader.bindTextureLocation(0,"textureSampler");
				resolve();
			}catch (e){
				reject(e);
			}
		});
		this._vao = new Vao(this._gl);
		this._vao.addVbo(0,2,[-1,1,-1,-1,1,-1,1,-1,1,1,-1,1]);
		this._vao.addVbo(1,2,[0,0,0,1,1,1,1,1,1,0,0,0]);
	}

	async waitUntilReady(){
		await this._readyPromise;
	}

	async update(){

	}

	async render(){
		this._mainFramebuffer.bind();
		this._renderShader.use();
		this._vao.bind();
		this._gl.activeTexture(this._gl.TEXTURE0);
		this._gl.bindTexture(this._gl.TEXTURE_2D,this._texture.id);
		this._gl.drawArrays(this._gl.TRIANGLES,0,6);
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