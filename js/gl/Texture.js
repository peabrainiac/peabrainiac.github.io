export default class Texture {
	
	constructor(gl,width=0,height=0,data=null){
		this._gl = gl;
		this._id = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D,this._id);
		gl.texParameterf(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
		gl.texParameterf(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
		this.setFormat(gl.RGBA8,gl.RGBA,width,height,gl.UNSIGNED_BYTE,data);
	}
	
	setFormat(internalFormat,format,width=this._width,height=this._height,type=this._type,data=null){
		this._gl.bindTexture(this._gl.TEXTURE_2D,this._id);
		this._gl.texImage2D(this._gl.TEXTURE_2D,0,internalFormat,width,height,0,format,type,data);
		this._width = width;
		this._height = height;
		this._internalFormat = internalFormat;
		this._format = format;
        this._type = type;
		console.log("Set texture size to "+width+"x"+height);
	}
	
	setSize(width,height){
		if (this._width!=width||this._height!=height){
			this.setFormat(this._internalFormat,this._format,width,height);
		}
	}

	get id(){
		return this._id;
	}
	
	destroy(){
		this._gl.deleteTexture(this._id);
	};
};