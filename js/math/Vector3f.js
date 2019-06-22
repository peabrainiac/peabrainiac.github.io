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
	return constructor;
})();