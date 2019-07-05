const Vector3f = (function(){
	var constructor = function(vx=0,vy=vx,vz=vx){
		this.x = vx;
		this.y = vy;
		this.z = vz;
	};
	constructor.prototype.add = function(vector){
		this.x += vector.x;
		this.y += vector.y;
		this.z += vector.z;
	};
	constructor.prototype.subtract = function(vector){
		this.x -= vector.x;
		this.y -= vector.y;
		this.z -= vector.z;
	};
	constructor.prototype.scale = function(scale){
		this.x *= scale;
		this.y *= scale;
		this.z *= scale;
	};
	constructor.prototype.copy = function(){
		var vector = new Vector3f();
		vector.x = this.x;
		vector.y = this.y;
		vector.z = this.z;
		return vector;
	};
    constructor.prototype.setTo = function(v){
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
    };
	constructor.prototype.abs = function(){
		return new Vector3f(Math.abs(this.x),Math.abs(this.y),Math.abs(this.z));
	};
	constructor.prototype.length = function(){
		return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
	};
    constructor.prototype.normalize = function(){
        this.scale(1/this.length());
    };
    constructor.prototype.multiplyComponents = function(v){
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
    };
	return constructor;
})();