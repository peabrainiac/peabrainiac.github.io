const Matrix3f = (function(){
	var constructor = function(){
		this.setIdentity();
	};
	constructor.prototype.setIdentity = function(){
		this.m00 = 1;
		this.m01 = 0;
		this.m02 = 0;
		this.m10 = 0;
		this.m11 = 1;
		this.m12 = 0;
		this.m20 = 0;
		this.m21 = 0;
		this.m22 = 1;
	};
	constructor.prototype.scale = function(scale){
		this.m00 *= scale;
		this.m01 *= scale;
		this.m02 *= scale;
		this.m10 *= scale;
		this.m11 *= scale;
		this.m12 *= scale;
		this.m20 *= scale;
		this.m21 *= scale;
		this.m22 *= scale;
	};
	constructor.prototype.copy = function(){
		var matrix = new Matrix3f();
		matrix.m00 = this.m00;
		matrix.m01 = this.m01;
		matrix.m02 = this.m02;
		matrix.m10 = this.m10;
		matrix.m11 = this.m11;
		matrix.m12 = this.m12;
		matrix.m20 = this.m20;
		matrix.m21 = this.m21;
		matrix.m22 = this.m22;
		return matrix;
	};
	constructor.prototype.apply = function(vector){
		var v = vector.copy();
		vector.x = this.m00*v.x+this.m10*v.y+this.m20*v.z;
		vector.y = this.m01*v.x+this.m11*v.y+this.m21*v.z;
		vector.z = this.m02*v.x+this.m12*v.y+this.m22*v.z;
	};
	constructor.prototype.multiply = function(b){
		var a = this.copy();
		this.m00 = a.m00*b.m00+a.m10*b.m01+a.m20*b.m02;
		this.m10 = a.m00*b.m10+a.m10*b.m11+a.m20*b.m12;
		this.m20 = a.m00*b.m20+a.m10*b.m21+a.m20*b.m22;
		this.m01 = a.m01*b.m00+a.m11*b.m01+a.m21*b.m02;
		this.m11 = a.m01*b.m10+a.m11*b.m11+a.m21*b.m12;
		this.m21 = a.m01*b.m20+a.m11*b.m21+a.m21*b.m22;
		this.m02 = a.m02*b.m00+a.m12*b.m01+a.m22*b.m02;
		this.m12 = a.m02*b.m10+a.m12*b.m11+a.m22*b.m12;
		this.m22 = a.m02*b.m20+a.m12*b.m21+a.m22*b.m22;
	};
	constructor.prototype.toArray = function(){
		return [this.m00,this.m01,this.m02,this.m10,this.m11,this.m12,this.m20,this.m21,this.m22];
	};
	constructor.prototype.getDeterminant = function(){
		return this.m00*(this.m11*this.m22-this.m21*this.m12)-this.m10*(this.m01*this.m22-this.m21*this.m02)+this.m20*(this.m01*this.m12-this.m11*this.m02);
	};
	constructor.prototype.rotate = function(rx,ry,rz){
		this.rotateX(rx);
		this.rotateY(ry);
		this.rotateZ(rz);
	};
	constructor.prototype.rotateX = function(rotation){
		if (rotation!=0){
			var matrix = new Matrix3f();
			matrix.setRotationMatrixX(rotation);
			this.multiply(matrix);
		}
	};
	constructor.prototype.rotateY = function(rotation){
		if (rotation!=0){
			var matrix = new Matrix3f();
			matrix.setRotationMatrixY(rotation);
			this.multiply(matrix);
		}
	};
	constructor.prototype.rotateZ = function(rotation){
		if (rotation!=0){
			var matrix = new Matrix3f();
			matrix.setRotationMatrixZ(rotation);
			this.multiply(matrix);
		}
	};
	constructor.prototype.setRotationMatrixX = function(rotation){
		this.setIdentity();
		var cos = Math.cos(rotation*Math.PI/180);
		var sin = Math.sin(rotation*Math.PI/180);
		this.m11 = cos;
		this.m21 = -sin;
		this.m12 = sin;
		this.m22 = cos;
	};
	constructor.prototype.setRotationMatrixY = function(rotation){
		this.setIdentity();
		var cos = Math.cos(rotation*Math.PI/180);
		var sin = Math.sin(rotation*Math.PI/180);
		this.m22 = cos;
		this.m02 = -sin;
		this.m20 = sin;
		this.m00 = cos;
	};
	constructor.prototype.setRotationMatrixZ = function(rotation){
		this.setIdentity();
		var cos = Math.cos(rotation*Math.PI/180);
		var sin = Math.sin(rotation*Math.PI/180);
		this.m00 = cos;
		this.m10 = -sin;
		this.m01 = sin;
		this.m11 = cos;
	};
	return constructor;
})();