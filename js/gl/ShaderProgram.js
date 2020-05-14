import Shader from "./Shader.js";

export default class ShaderProgram {
	constructor(gl,vertexSource,fragmentSource){
		this._gl = gl;
		this._vertexSource = vertexSource;
		this._fragmentSource = fragmentSource;
		this._vertexShader = new Shader(gl,gl.VERTEX_SHADER);
		this._fragmentShader = new Shader(gl,gl.FRAGMENT_SHADER);
		this._id = gl.createProgram();
		gl.attachShader(this._id,this._vertexShader.id);
		gl.attachShader(this._id,this._fragmentShader.id);
		this._uniformLocations = {};
		this._uniformTypes = {};
		this.uniforms = new Proxy({},{set:(target,property,value,receiver)=>{
			target[property] = value;
			if (this._isReady){
				this.load(property,value);
			}
			return true;
		}});
		this.flags = new Proxy({},{set:(target,property,value,receiver)=>{
			if (target[property]!=value){
				target[property] = value;
				if (this._isReady){
					this.compile(this._vertexSource,this._fragmentSource);
				}
			}
			return true;
		}});
		this._isReady = false;
		if (vertexSource&&fragmentSource){
			this.compile(vertexSource,fragmentSource);
		}
	}

	compile(vertexSource,fragmentSource){
		this._vertexSource = vertexSource;
		this._fragmentSource = fragmentSource;
		console.log("Compiling!");
		let flags = Object.getOwnPropertyNames(this.flags).filter((flag)=>(this.flags[flag]));
		console.log("Active flags:",flags);
		let flagString = (flags.length?"\n#define "+flags.join("\n#define "):"")+"\n";
		console.log("Flagstring:",flagString);
		this._vertexShader.compile(vertexSource.replace("\n",flagString));
		this._fragmentShader.compile(fragmentSource.replace("\n",flagString));
		this._gl.linkProgram(this._id);
		if (!this._gl.getProgramParameter(this._id,this._gl.LINK_STATUS)){
			this._isReady = false;
			throw new Error("Could not link shader program!\n"+this._gl.getProgramInfoLog(this._id));
		}else{
			this._isReady = true;
		}
		this._gl.useProgram(this._id);
		this._uniformLocations = {};
		this._uniformTypes = {};
		this._uniformNames = {};
		let count = this._gl.getProgramParameter(this._id,this._gl.ACTIVE_UNIFORMS);
		let infos = [];
		for (let i=0;i<count;i++){
			let info = this._gl.getActiveUniform(this._id,i);
			let name = info.name.match(/^[^[]*/);
			this._uniformTypes[name] = info.type;
			this._uniformNames[name] = info.name;
			this._uniformLocations[name] = this._gl.getUniformLocation(this._id,name);
			infos.push(info);
		}
		console.log("Active Uniforms:",infos);
		let uniforms = Object.getOwnPropertyNames(this.uniforms);
		for (let i=0;i<uniforms.length;i++){
			this.load(uniforms[i],this.uniforms[uniforms[i]]);
		}
	}

	get isReady(){
		return this._isReady;
	}

	use(){
		this._gl.useProgram(this._id);
	}

	bindAttribLocation(location,name){
		this._gl.bindAttribLocation(this._id,location,name);
	}

	bindTextureLocation(location,name){
		this.loadInt(name,location);
	}

	load(name,value){
		let type = this._uniformTypes[name];
		if(!this._uniformLocations[name]){
			console.warn("Error loading uniform! Name:",name,", type:",type,", value:",value);
		}else if (type==this._gl.INT){
			this.loadInt(name,value);
		}else if(type==this._gl.FLOAT){
			this.loadFloat(name,value);
		}else if(type==this._gl.FLOAT_VEC3){
			if (this._uniformNames[name].endsWith("[0]")){
				this.loadVector3fArray(name,value);
			}else{
				this.loadVector3f(name,value);
			}
		}else if(type==this._gl.FLOAT_MAT3){
			this.loadMatrix3f(name,value);
		}
	}

	loadInt(name,value){
		this._gl.uniform1i(this._uniformLocations[name],value);
	}

	loadFloat(name,value){
		this._gl.uniform1f(this._uniformLocations[name],value);
	}

	loadVector3f(name,vector){
		this._gl.uniform3f(this._uniformLocations[name],vector.x,vector.y,vector.z);
	}

	loadMatrix3f(name,matrix){
		this._gl.uniformMatrix3fv(this._uniformLocations[name],false,matrix.toArray());
	}

	loadVector3fArray(name,vectors){
		let array = new Float32Array(3*vectors.length);
		for (let i=0;i<vectors.length;i++){
			array[3*i] = vectors[i].x;
			array[3*i+1] = vectors[i].y;
			array[3*i+2] = vectors[i].z;
		}
		this._gl.uniform3fv(this._uniformLocations[name],array);
	}
}