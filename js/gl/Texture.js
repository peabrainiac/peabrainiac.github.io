const Texture = function(gl){
	this.texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D,this.texture);
	gl.texParameterf(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
	gl.texParameterf(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
	
	this.setFormat = function(internalFormat,format,width=this.width,height=this.height,type=this.type){
		gl.bindTexture(gl.TEXTURE_2D,this.texture);
		gl.texImage2D(gl.TEXTURE_2D,0,internalFormat,width,height,0,format,type,null);
		this.width = width;
		this.height = height;
		this.internalFormat = internalFormat;
		this.format = format;
        this.type = type;
		console.log("Set texture size to "+width+"x"+height);
	};
	this.setSize = function(width,height){
		if (this.width!=width||this.height!=height){
			this.setFormat(this.internalFormat,this.format,width,height);
		}
	};
	
	this.setFormat(gl.RGBA8,gl.RGBA,0,0,gl.UNSIGNED_BYTE);
	
	this.destroy = function(){
		gl.deleteTexture(this.texture);
	};
};