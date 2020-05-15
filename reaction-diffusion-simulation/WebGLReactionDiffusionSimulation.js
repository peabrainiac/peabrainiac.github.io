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
		this._tempTexture = new Texture(this._gl,width,height);
		this._tempFramebuffer = new Framebuffer(this._gl);
		this._tempFramebuffer.setSize(width,height);
		this._tempFramebuffer.attachTexture(this._tempTexture,this._gl.COLOR_ATTACHMENT0)
		this._mainFramebuffer = new Framebuffer(this._gl,null);
		this._mainFramebuffer.setSize(width,height);
		this._readyPromise = new Promise(async(resolve,reject)=>{
			try {
				let renderVertexSource = await (await fetch("render.vert")).text();
				let renderFragmentSource = await (await fetch("render.frag")).text();
				this._renderShader = new ShaderProgram(this._gl,renderVertexSource,renderFragmentSource);
				this._renderShader.bindAttribLocation(0,"position");
				this._renderShader.bindAttribLocation(1,"textureCoords");
				this._renderShader.bindTextureLocation(0,"textureSampler");
				let step1VertexSource = await (await fetch("step1.vert")).text();
				let step1FragmentSource = await (await fetch("step1.frag")).text();
				this._simulationShader1 = new ShaderProgram(this._gl,step1VertexSource,step1FragmentSource);
				this._simulationShader1.bindAttribLocation(0,"position");
				this._simulationShader1.bindAttribLocation(1,"textureCoords");
				this._simulationShader1.bindTextureLocation(0,"textureSampler");
				this._simulationShader1.uniforms.pixelWidth = 1/width;
				this._simulationShader1.uniforms.kernel = {x:0.5,y:0.2,z:0.05};
				let step2VertexSource = await (await fetch("step2.vert")).text();
				let step2FragmentSource = await (await fetch("step2.frag")).text();
				this._simulationShader2 = new ShaderProgram(this._gl,step2VertexSource,step2FragmentSource);
				this._simulationShader2.bindAttribLocation(0,"position");
				this._simulationShader2.bindAttribLocation(1,"textureCoords");
				this._simulationShader2.bindTextureLocation(0,"textureSampler");
				this._simulationShader2.uniforms.pixelHeight = 1/height;
				this._simulationShader2.uniforms.kernel = {x:0.5,y:0.2,z:0.05};
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
		this._tempFramebuffer.bind();
		this._simulationShader1.use();
		this._vao.bind();
		this._gl.activeTexture(this._gl.TEXTURE0);
		this._gl.bindTexture(this._gl.TEXTURE_2D,this._texture.id);
		this._gl.drawArrays(this._gl.TRIANGLES,0,6);
		
		this._framebuffer.bind();
		this._simulationShader2.use();
		this._vao.bind();
		this._gl.activeTexture(this._gl.TEXTURE0);
		this._gl.bindTexture(this._gl.TEXTURE_2D,this._tempTexture.id);
		this._gl.drawArrays(this._gl.TRIANGLES,0,6);
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
			this._simulationShader2.use();
			this._simulationShader2.uniforms.growthRateA = growthRate;
			this._simulationShader2.uniforms.deathRateB = growthRate+this._deathRateB;
			console.log("new growth rate:",growthRate);
		}
	}

	get growthRate(){
		return this._growthRateA;
	}

	set deathRate(deathRate){
		if (this._deathRateB!=deathRate){
			this._deathRateB = deathRate;
			this._simulationShader2.use();
			this._simulationShader2.uniforms.deathRateB = this._growthRateA+deathRate;
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