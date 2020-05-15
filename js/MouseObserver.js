export default class MouseObserver{
	
	constructor(element){
		this._element = element;
		this._mouseOn = false;
		this._mouseDown = false;
		element.addEventListener("mouseenter",(e)=>{
			this._mouseOn = true;
		});
		element.addEventListener("mouseleave",(e)=>{
			this._mouseOn = false;
			this._mouseDown = false;
		});
		element.addEventListener("mousedown",(e)=>{
			this._mouseDown = true;
		});
		element.addEventListener("mouseup",(e)=>{
			this._mouseDown = false;
		});
		element.addEventListener("mousemove",(e)=>{
			this._x = e.offsetX;
			this._y = e.offsetY;
		});
	}

	get mouseOn(){
		return this._mouseOn;
	}

	get mouseDown(){
		return this._mouseDown;
	}

	get mouseX(){
		return this._x;
	}

	get mouseY(){
		return this._y;
	}
}