const Camera = function(canvasElement){
	var exports = {};
	
	var position = new Vector3f(0);
	var velocity = new Vector3f(0);
	var viewMatrix = new Matrix3f();
	
	var keyDown = {};
	canvasElement.addEventListener("keydown",function(e){
		keyDown[e.key] = true;
	});
	canvasElement.addEventListener("keyup",function(e){
		keyDown[e.key] = false;
	});
	var locked = false;
	var cancelRightClick = false;
	canvasElement.addEventListener("click",function(){
		canvasElement.requestPointerLock();
	});
	document.addEventListener("pointerlockchange",function(){
		if (document.pointerLockElement==canvasElement){
			locked = true;
		}else{
			locked = false;
			canvasElement.blur();
		}
	});
	canvasElement.addEventListener("mousemove",function(e){
		if (locked){
			viewMatrix.rotate(e.movementY/10,e.movementX/10,0);
		}
	});
	canvasElement.addEventListener("mousedown",function(e){
		if (locked&&e.which==3){
			cancelRightClick = true;
			document.exitPointerLock();
		}
	});
	canvasElement.addEventListener("contextmenu",function(e){
		console.log("contextmenu event! cancelRightClick: "+cancelRightClick);
		if (cancelRightClick){
			cancelRightClick = false;
			e.preventDefault();
		}
	});
	
	exports.update = function(){
		var acceleration = new Vector3f(0,0,0);
		if (keyDown.a){
			acceleration.x -= 0.01;
		}
		if (keyDown.d){
			acceleration.x += 0.01;
		}
		if (keyDown.s){
			acceleration.z -= 0.01;
		}
		if (keyDown.w){
			acceleration.z += 0.01;
		}
		viewMatrix.apply(acceleration);
		velocity.scale(0.95);
		velocity.add(acceleration);
		position.add(velocity);
		viewMatrix.rotate(0.03,0.05,0.07);
	};
	exports.getPosition = function(){
		return position;
	};
	exports.getViewMatrix = function(){
		return viewMatrix;
	};
	
	return exports;
};