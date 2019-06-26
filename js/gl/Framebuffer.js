const Framebuffer = function(gl,buffer=gl.createFramebuffer()){
	this.framebuffer = buffer;
	this.width = 0;
	this.height = 0;
	var textures = [];
	
	this.bind = function(){
		gl.bindFramebuffer(gl.FRAMEBUFFER,this.framebuffer);
		gl.viewport(0,0,this.width,this.height);
	};
	this.attachTexture = function(texture,attachment){
		gl.bindFramebuffer(gl.FRAMEBUFFER,this.framebuffer);
		gl.framebufferTexture2D(gl.FRAMEBUFFER,attachment,gl.TEXTURE_2D,texture.texture,0);
		texture.setSize(this.width,this.height);
		textures.push(texture);
	};
	this.setSize = function(width,height){
		if (this.width!=width||this.height!=height){
			this.width = width;
			this.height = height;
			for (var i=0;i<textures.length;i++){
				textures[i].setSize(width,height);
			}
		}
	};
	this.clear = function(r,g,b,a){
		gl.clearColor(r,g,b,a);
		gl.clear(gl.COLOR_BUFFER_BIT);
	};
	this.destroy = function(){
		gl.deleteFramebuffers(this.framebuffer);
	};
};