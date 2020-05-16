import Framebuffer from "../js/gl/Framebuffer.js";
import Texture from "../js/gl/Texture.js";
import ShaderProgram from "../js/gl/ShaderProgram.js";
import Vao from "../js/gl/Vao.js";
import {Vector3f} from "../js/Vectors.js";

export default class WebGLReactionDiffusionSimulation {

	constructor(canvas,width=480,height=360){
		this._canvas = canvas;
		canvas.width = width;
		canvas.height = height;
		this._gl = canvas.getContext("webgl2",{preserveDrawingBuffer:true});
        let ext = this._gl.getExtension("EXT_COLOR_BUFFER_FLOAT");
		this._width = width;
		this._height = height;
		let data = new Float32Array(width*height*4);
		for (let i=0;i<data.length;i+=4){
			data[i] = Math.random();
			data[i+1] = Math.random();
		}
		this._texture = new Texture(this._gl);
		this._texture.setFormat(this._gl.RGBA16F,this._gl.RGBA,width,height,this._gl.FLOAT,data);
		this._framebuffer = new Framebuffer(this._gl);
		this._framebuffer.setSize(width,height);
		this._framebuffer.attachTexture(this._texture,this._gl.COLOR_ATTACHMENT0);
		this._tempTexture = new Texture(this._gl);
		this._tempTexture.setFormat(this._gl.RGBA16F,this._gl.RGBA,width,height,this._gl.FLOAT,null);
		this._tempFramebuffer = new Framebuffer(this._gl);
		this._tempFramebuffer.setSize(width,height);
		this._tempFramebuffer.attachTexture(this._tempTexture,this._gl.COLOR_ATTACHMENT0)
		this._mainFramebuffer = new Framebuffer(this._gl,null);
		this._mainFramebuffer.setSize(width,height);
		this._readyPromise = new Promise(async(resolve,reject)=>{
			try {
				let vertexSource = await (await fetch("generic.vert")).text();
				this._renderShader = await ShaderProgram.fetch(this._gl,vertexSource,"render.frag",{attribs:["position","textureCoords"],textures:["textureSampler"]});
				this._simulationShader1 = await ShaderProgram.fetch(this._gl,vertexSource,"step1.frag",{attribs:["position","textureCoords"],textures:["textureSampler"]});
				this._simulationShader1.uniforms.pixelWidth = 1/width;
				this._simulationShader2 = await ShaderProgram.fetch(this._gl,vertexSource,"step2.frag",{attribs:["position","textureCoords"],textures:["textureSampler"]});
				this._simulationShader2.uniforms.pixelHeight = 1/height;
				this._clickShader = await ShaderProgram.fetch(this._gl,vertexSource,"click.frag",{attribs:["position","textureCoords"]});
				this._clickShader.uniforms.screenSize = {x:width,y:height};
				resolve();
			}catch (e){
				reject(e);
			}
		});
		this._vao = new Vao(this._gl);
		this._vao.addVbo(0,2,[-1,1,-1,-1,1,-1,1,-1,1,1,-1,1]);
		this._vao.addVbo(1,2,[0,0,0,1,1,1,1,1,1,0,0,0]);
		this._gl.enable(this._gl.BLEND);
		this._gl.blendFunc(this._gl.SRC_ALPHA,this._gl.ONE_MINUS_SRC_ALPHA);
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

	async addLiquidB(x,y){
		this._clickShader.use();
		this._clickShader.uniforms.mousePosition = {x,y};
		this._clickShader.uniforms.radius = 5;
		this._framebuffer.bind();
		this._vao.bind();
		this._gl.drawArrays(this._gl.TRIANGLES,0,6);
	}

	rebuildKernel(){
		console.log("Triggered Kernel rebuild!");
		let diffusionA = this._diffusionA*this._diffusionScale;
		let diffusionB = this._diffusionB*this._diffusionScale;
		let kernelA = new Vector3f(1,Math.exp(-0.25/diffusionA),Math.exp(-1/diffusionA));
		let kernelB = new Vector3f(1,Math.exp(-0.25/diffusionB),Math.exp(-1/diffusionB));
		kernelA.scale(1/(kernelA.x+2*kernelA.y+2*kernelA.z));
		kernelB.scale(1/(kernelB.x+2*kernelB.y+2*kernelB.z));
		this._simulationShader1.use();
		this._simulationShader1.uniforms.kernelA = kernelA;
		this._simulationShader1.uniforms.kernelB = kernelB;
		this._simulationShader2.use();
		this._simulationShader2.uniforms.kernelA = kernelA;
		this._simulationShader2.uniforms.kernelB = kernelB;
		console.log(kernelA,kernelB);
	}

	set scale(scale){
		if (this._scale!=scale){
			this._scale = scale;
			this._diffusionScale = 1/(scale*scale);
			this.rebuildKernel();
		}
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
		if (this._diffusionA!=diffusionA){
			this._diffusionA = diffusionA;
			this.rebuildKernel();
		}
	}

	get diffusionA(){
		return this._diffusionA;
	}

	set diffusionB(diffusionB){
		if (this._diffusionB!=diffusionB){
			this._diffusionB = diffusionB;
			this.rebuildKernel();
		}
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