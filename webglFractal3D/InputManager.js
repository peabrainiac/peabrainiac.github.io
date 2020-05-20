export default class InputManager {
	constructor(){
		this._inputs = {};
		this._inputs.rotation1 = document.getElementById("input-rotation-1");
		this._inputs.rotation2 = document.getElementById("input-rotation-2");
		this._inputs.rotation3 = document.getElementById("input-rotation-3");
		this._inputs.scale = document.getElementById("input-scale");
		this._inputs.offsetX = document.getElementById("input-offset-x");
		this._inputs.offsetY = document.getElementById("input-offset-y");
		this._inputs.offsetZ = document.getElementById("input-offset-z");
		
		this._inputs.settings = {};
		this._inputs.settings.pixelSize = document.getElementById("input-pixelsize");
		this._inputs.settings.shadowMode = document.getElementById("input-shadowmode");
		this._inputs.settings.smoothing = document.getElementById("input-smoothing");
		this._inputs.settings.speed = document.getElementById("input-speed");
		this._inputs.settings.bundling = document.getElementById("input-bundling-checkbox");
		this._inputs.settings.bundleSize = document.getElementById("input-bundlesize");
		this._inputs.settings.bundlePrecision = document.getElementById("input-bundleprecision");
		this._inputs.settings.pixelSize.innerToOuterValue = (x)=>(Math.pow(2,x-1));
		this._inputs.settings.smoothing.innerToOuterValue = (x)=>(Math.pow(2,x-1));
		this._inputs.settings.smoothing.valueToString = (x)=>(x+"px");
		this._inputs.settings.speed.innerToOuterValue = (x)=>(x/100);
		this._inputs.settings.speed.valueToString = (x)=>(Math.round(x*100)+"%");
		this._inputs.settings.bundleSize.valueToString = (x)=>(x+"px");
		
		this._inputs.width = document.getElementById("input-width");
		this._inputs.height = document.getElementById("input-height");
		
		
		this.updateTransformation1 = ()=>{
			let rotation1 = this._inputs.rotation1.value;
			let rotation2 = this._inputs.rotation2.value;
			let rotation3 = this._inputs.rotation3.value;
			let scale = this._inputs.scale.value;
			this._callbacks.transformation1(rotation1,rotation2,rotation3,scale);
		}
		this.updateOffset1 = ()=>{
			let offsetX = this._inputs.offsetX.value;
			let offsetY = this._inputs.offsetY.value;
			let offsetZ = this._inputs.offsetZ.value;
			this._callbacks.offset1(offsetX,offsetY,offsetZ)
		}
		this.updateShadowMode = ()=>{
			this._callbacks.shadowMode(this._inputs.settings.shadowMode.value);
		}
		this.updateBundling = ()=>{
			this._callbacks.bundling(this._inputs.settings.bundling.checked);
		}
		this.updateSize = ()=>{
			let width = this._inputs.width.value;
			let height = this._inputs.height.value;
			this._callbacks.size(width,height);
		}
		
		this._inputs.rotation1.addEventListener("input",this.updateTransformation1);
		this._inputs.rotation2.addEventListener("input",this.updateTransformation1);
		this._inputs.rotation3.addEventListener("input",this.updateTransformation1);
		this._inputs.scale.addEventListener("input",this.updateTransformation1);
		this._inputs.offsetX.addEventListener("input",this.updateOffset1);
		this._inputs.offsetY.addEventListener("input",this.updateOffset1);
		this._inputs.offsetZ.addEventListener("input",this.updateOffset1);
		
		this._inputs.settings.shadowMode.addEventListener("change",this.updateShadowMode);
		this._inputs.settings.bundling.addEventListener("input",this.updateBundling);
		
		this._inputs.width.addEventListener("input",this.updateSize);
		this._inputs.height.addEventListener("input",this.updateSize);
		
		this._callbacks  = {};

		document.getElementById("input-button-screenshot").addEventListener("click",()=>{
			let width = document.getElementById("input-screenshot-width").value;
			let height = document.getElementById("input-screenshot-height").value;
			this._callbacks.screenshot(width,height);
		});
	}
	
	onTransformationChange1(callback){
		this._callbacks.transformation1 = callback;
		this.updateTransformation1();
	}

	onOffsetChange1(callback){
		this._callbacks.offset1 = callback;
		this.updateOffset1();
	}

	onPixelSizeChange(callback){
		this._inputs.settings.pixelSize.onChange(callback)
	}

	onShadowModeChange(callback){
		this._callbacks.shadowMode = callback;
		this.updateShadowMode();
	}

	onSmoothingRadiusChange(callback){
		this._inputs.settings.smoothing.onChange(callback);
	}

	onSpeedModifierChange(callback){
		this._inputs.settings.speed.onChange(callback);
	}

	onBundlingChange(callback){
		this._callbacks.bundling = callback;
		this.updateBundling();
	}

	onBundleSizeChange(callback){
		this._inputs.settings.bundleSize.onChange(callback);
	}

	onBundlePrecisionChange(callback){
		this._inputs.settings.bundlePrecision.onChange(callback);
	}

	onSizeChange(callback){
		this._callbacks.size = callback;
		this.updateSize();
	}

	onScreenshotTake = function(callback){
		this._callbacks.screenshot = callback;
	}
	
	setTransformation1(rotation1,rotation2,rotation3,scale){
		this._inputs.rotation1.value = rotation1;
		this._inputs.rotation2.value = rotation2;
		this._inputs.rotation3.value = rotation3;
		this._inputs.scale.value = scale;
	}

	setOffset1(offsetX,offsetY,offsetZ){
		this._inputs.offsetX.value = offsetX;
		this._inputs.offsetY.value = offsetY;
		this._inputs.offsetZ.value = offsetZ;
	}

	setSizeDisplay(width,height){
		this._inputs.width.value = width;
		this._inputs.height.value = height;
	}
}