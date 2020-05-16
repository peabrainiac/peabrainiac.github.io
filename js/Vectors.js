export class Vector3f {

	constructor(x=0,y=x,z=x){
		this.x = x;
		this.y = y;
		this.z = z;
	}

	*[Symbol.iterator](){
		yield this.x;
		yield this.y;
		yield this.z;
	}

	get length(){
		return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
	}

	set length(length){
		let l = this.length;
		if (l>0){
			this.scale(length/l);
		}
	}

	scale(s){
		this.x *= s;
		this.y *= s;
		this.z *= s;
	}
}