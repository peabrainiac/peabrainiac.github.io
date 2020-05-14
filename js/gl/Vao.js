export default class Vao {
	
	constructor(gl){
		this._gl = gl;
		this._id = gl.createVertexArray();
		this._vbos = [];
	}

	bind(){
		this._gl.bindVertexArray(this._id);
	}
	
	addVbo(location,dimensionality,data){
		let vbo = this._gl.createBuffer();
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER,vbo);
		this._gl.bindVertexArray(this._id);
		this._gl.vertexAttribPointer(location,dimensionality,this._gl.FLOAT,false,0,0);
		this._gl.enableVertexAttribArray(location);
		this._gl.bufferData(this._gl.ARRAY_BUFFER,new Float32Array(data),this._gl.STATIC_DRAW);
		this._vbos.push(vbo);
	}

	destroy(){
		for (let i=0;i<this._vbos.length;i++){
			this._gl.deleteBuffer(this._vbos[i]);
		}
		this._gl.deleteVertexArray(this._id);
	}

	get id(){
		return this._id;
	}
}