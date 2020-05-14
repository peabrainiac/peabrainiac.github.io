export default class Framebuffer {
	
	constructor(gl,buffer=gl.createFramebuffer()){
		this._gl = gl;
		this._id = buffer;
		this._width = 0;
		this._height = 0;
		this._textures = [];
	}

	bind(){
		this._gl.bindFramebuffer(this._gl.FRAMEBUFFER,this._id);
		this._gl.viewport(0,0,this._width,this._height);
	}

	attachTexture(texture,attachment){
		this._gl.bindFramebuffer(this._gl.FRAMEBUFFER,this._id);
		this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER,attachment,this._gl.TEXTURE_2D,texture.id,0);
		texture.setSize(this._width,this._height);
		this._textures.push(texture);
	}

	setSize(width,height){
		if (this._width!=width||this._height!=height){
			this._width = width;
			this._height = height;
			for (var i=0;i<this._textures.length;i++){
				this._textures[i].setSize(width,height);
			}
		}
	}
	
	clear(r,g,b,a){
		this._gl.clearColor(r,g,b,a);
		this._gl.clear(this._gl.COLOR_BUFFER_BIT);
	}
	
	destroy(){
		this._gl.deleteFramebuffers(this._id);
	}
}