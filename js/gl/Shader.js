export default class Shader {
	constructor(gl,type,source){
		this._gl = gl;
		this._id = gl.createShader(type);
		this._isReady = false;
		if (source){
			this.compile(source);
		}
	}

	compile(source){
		this._gl.shaderSource(this._id,source);
		this._gl.compileShader(this._id);
		if (!this._gl.getShaderParameter(this._id,this._gl.COMPILE_STATUS)){
			this._isReady = false;
			throw new Error("Could not compile shader!\n"+this._gl.getShaderInfoLog(this._id));
		}else{
			this._isReady = true;
		}
	}

	get id(){
		return this._id;
	}

	get isReady(){
		return this._isReady;
	}
}