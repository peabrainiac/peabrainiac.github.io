export default class Camera {
	constructor(canvasElement){
		this._position = new Vector3f(0,0,-5);
		this._velocity = new Vector3f(0);
		this._viewMatrix = new Matrix3f();
		this._maxAcceleration = 0.0005;
		this._speedModifier = 1;
		
		this._keyDown = {};
		canvasElement.addEventListener("keydown",(e)=>{
			this._keyDown[e.key] = true;
		});
		canvasElement.addEventListener("keyup",(e)=>{
			this._keyDown[e.key] = false;
		});
		let locked = false;
		let cancelRightClick = false;
		canvasElement.addEventListener("click",()=>{
			canvasElement.requestPointerLock();
		});
		document.addEventListener("pointerlockchange",()=>{
			if (document.pointerLockElement==canvasElement){
				locked = true;
			}else{
				locked = false;
				canvasElement.blur();
			}
		});
		canvasElement.addEventListener("mousemove",(e)=>{
			if (locked){
				this._viewMatrix.rotate(e.movementY/10,e.movementX/10,0);
			}
		});
		canvasElement.addEventListener("mousedown",(e)=>{
			if (locked&&e.which==3){
				cancelRightClick = true;
				document.exitPointerLock();
			}
		});
		canvasElement.addEventListener("contextmenu",(e)=>{
			console.log("contextmenu event! cancelRightClick: "+cancelRightClick);
			if (cancelRightClick){
				cancelRightClick = false;
				e.preventDefault();
			}
		});
	}
	
	update(){
		let acceleration = new Vector3f(0,0,0);
		if (this._keyDown.a){
			acceleration.x -= this._maxAcceleration*this._speedModifier;
		}
		if (this._keyDown.d){
			acceleration.x += this._maxAcceleration*this._speedModifier;
		}
		if (this._keyDown.s){
			acceleration.z -= this._maxAcceleration*this._speedModifier;
		}
		if (this._keyDown.w){
			acceleration.z += this._maxAcceleration*this._speedModifier;
		}
		this._viewMatrix.apply(acceleration);
		this._velocity.scale(0.95);
		this._velocity.add(acceleration);
		this._position.add(this._velocity);
	}

	set distanceToFractal(d){
		this._velocity.scale((d/200)/this._maxAcceleration);
		this._maxAcceleration = d/200;
	}

    set speedModifier(speedModifier){
        this._speedModifier = speedModifier;
    }
	
	set position(position){
        this._position = position;
	}
	
	get position(){
		return this._position;
	}

    set viewMatrix(matrix){
        this._viewMatrix = matrix;
	}
	
	get viewMatrix(){
		return this._viewMatrix;
	}
};