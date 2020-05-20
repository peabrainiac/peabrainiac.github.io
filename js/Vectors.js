export class Vector3f {

	/**
	 * Creates a new Vector3f.
	 * @param {number} x initial value for x, defaults to zero
	 * @param {number} y initial value for y, defaults to x
	 * @param {number} z initial value for z, defaults to x
	 */
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

	/**
	 * Returns a copy of the vector.
	 */
	copy(){
		return new Vector3f(this.x,this.y,this.z);
	}

	/**
	 * Applies the function componentwise and returns a new vector with the result.
	 * @param {(x:number)=>(number)} f 
	 */
	map(f){
		return new Vector3f(f(this.x),f(this.y),f(this.z));
	}

	/**
	 * Scales the vector by the given factor.
	 * @param {number} s 
	 */
	scale(s){
		this.x *= s;
		this.y *= s;
		this.z *= s;
	}

	/**
	 * Adds the given vector to this one.
	 * @param {Vector3f} v 
	 */
	add(v){
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
	}

	/**
	 * Subtracts the given vector from this one.
	 * @param {Vector3f} v 
	 */
	subtract(v){
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
	}

	/**
	 * Copies the values from another vector into this one.
	 * @param {Vector3f} v 
	 */
	setTo(v){
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
	}

	/**
	 * Sets the length of the vector to one unless it is currently zero.
	 */
	normalize(){
		this.length = 1;
	}

	/**
	 * Multiplies the vector componentwise with another vector.
	 * @param {Vector3f} v 
	 */
	multiply(v){
		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;
	}
}
["x","y","z"].forEach((x1,i1,chars)=>{
	chars.forEach((x2)=>{
		chars.forEach((x3)=>{
			Object.defineProperty(Vector3f.prototype,x1+x2+x3,{get:function(){
				return new Vector3f(this[x1],this[x2],this[x3]);
			},set:(x1!=x2&&x2!=x3&&x3!=x1)?function(v){
				this[x1] = v.x;
				this[x2] = v.y;
				this[x3] = v.z;
			}:()=>{
				throw new Error("Invalid swizzle mask assignment "+x1+x2+x3);
			}});
		});
	});
});
console.log("Loaded Vector3f class:",Vector3f);