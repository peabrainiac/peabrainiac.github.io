const Vao = function(gl){
	var exports = {};
	
	var vao = gl.createVertexArray();
	var vbos = [];
	
	exports.addVbo = function(location,dimensionality,data){
		var vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
		gl.bindVertexArray(vao);
		gl.vertexAttribPointer(location,dimensionality,gl.FLOAT,false,0,0);
		gl.enableVertexAttribArray(0);
		gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
		vbos.push(vbo);
	};
	
	return exports;
};