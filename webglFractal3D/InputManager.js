const InputManager = function(){
	var exports = {};
	
	var inputs = {};
	inputs.rotation1 = document.getElementById("input-rotation-1");
	inputs.rotation2 = document.getElementById("input-rotation-2");
	inputs.rotation3 = document.getElementById("input-rotation-3");
	inputs.scale = document.getElementById("input-scale");
    inputs.offsetX = document.getElementById("input-offset-x");
    inputs.offsetY = document.getElementById("input-offset-y");
    inputs.offsetZ = document.getElementById("input-offset-z");
	inputs.spans = {};
	inputs.spans.rotation1 = document.getElementById("input-rotation-1-span");
	inputs.spans.rotation2 = document.getElementById("input-rotation-2-span");
	inputs.spans.rotation3 = document.getElementById("input-rotation-3-span");
	inputs.spans.scale = document.getElementById("input-scale-span");
    inputs.spans.offsetX = document.getElementById("input-offset-x-span");
    inputs.spans.offsetY = document.getElementById("input-offset-y-span");
    inputs.spans.offsetZ = document.getElementById("input-offset-z-span");
	
	inputs.settings = {};
	inputs.settings.pixelSize = document.getElementById("input-pixelsize");
	inputs.settings.shadowMode = document.getElementById("input-shadowmode");
	inputs.settings.smoothing = document.getElementById("input-smoothing");
    inputs.settings.speed = document.getElementById("input-speed");
    inputs.settings.bundling = document.getElementById("input-bundling-checkbox");
    inputs.settings.bundleSize = document.getElementById("input-bundlesize");
    inputs.settings.bundlePrecision = document.getElementById("input-bundleprecision");
	inputs.settings.spans = {};
	inputs.settings.spans.pixelSize = document.getElementById("input-pixelsize-span");
	inputs.settings.spans.smoothing = document.getElementById("input-smoothing-span");
    inputs.settings.spans.speed = document.getElementById("input-speed-span");
    inputs.settings.spans.bundleSize = document.getElementById("input-bundlesize-span");
    inputs.settings.spans.bundlePrecision = document.getElementById("input-bundleprecision-span");
    
    inputs.width = document.getElementById("input-width");
    inputs.height = document.getElementById("input-height");
	
	inputs.rotation1.addEventListener("input",updateTransformation1);
	inputs.rotation2.addEventListener("input",updateTransformation1);
	inputs.rotation3.addEventListener("input",updateTransformation1);
	inputs.scale.addEventListener("input",updateTransformation1);
    inputs.offsetX.addEventListener("input",updateOffset1);
    inputs.offsetY.addEventListener("input",updateOffset1);
    inputs.offsetZ.addEventListener("input",updateOffset1);
	
	inputs.settings.pixelSize.addEventListener("input",updatePixelSize);
	inputs.settings.shadowMode.addEventListener("change",updateShadowMode);
	inputs.settings.smoothing.addEventListener("input",updateSmoothingRadius);
    inputs.settings.speed.addEventListener("input",updateSpeedModifier);
    inputs.settings.bundling.addEventListener("input",updateBundling);
    inputs.settings.bundleSize.addEventListener("input",updateBundleSize);
    inputs.settings.bundlePrecision.addEventListener("input",updateBundlePrecision);
    
    inputs.width.addEventListener("input",updateSize);
    inputs.height.addEventListener("input",updateSize);
	
	var callbacks = {};
	
	function updateTransformation1(){
		var rotation1 = inputs.rotation1.value*1;
		var rotation2 = inputs.rotation2.value*1;
		var rotation3 = inputs.rotation3.value*1;
		var scale = inputs.scale.value*1;
		inputs.spans.rotation1.innerHTML = ":"+rotation1;
		inputs.spans.rotation2.innerHTML = ":"+rotation2;
		inputs.spans.rotation3.innerHTML = ":"+rotation3;
		inputs.spans.scale.innerHTML = ":"+scale;
		callbacks.transformation1(rotation1,rotation2,rotation3,scale);
	}
	function updateOffset1(){
        var offsetX = inputs.offsetX.value*1;
        var offsetY = inputs.offsetY.value*1;
        var offsetZ = inputs.offsetZ.value*1;
        inputs.spans.offsetX.innerHTML = ":"+offsetX;
        inputs.spans.offsetY.innerHTML = ":"+offsetY;
        inputs.spans.offsetZ.innerHTML = ":"+offsetZ;
        callbacks.offset1(offsetX,offsetY,offsetZ)
    };
	function updatePixelSize(){
		var pixelSize = Math.pow(2,inputs.settings.pixelSize.value-1);
		inputs.settings.spans.pixelSize.innerHTML = ":"+pixelSize;
		callbacks.pixelSize(pixelSize);
	}
	function updateShadowMode(){
		callbacks.shadowMode(inputs.settings.shadowMode.value);
	}
	function updateSmoothingRadius(){
		var smoothingRadius = Math.pow(2,inputs.settings.smoothing.value-1);
		inputs.settings.spans.smoothing.innerHTML = ":"+smoothingRadius+"px";
		callbacks.smoothing(smoothingRadius);
	}
    function updateSpeedModifier(){
        var speedPercentage = inputs.settings.speed.value;
        inputs.settings.spans.speed.innerHTML = ":"+speedPercentage+"%";
        callbacks.speed(speedPercentage/100);
    }
    function updateBundling(){
        var bundling = inputs.settings.bundling.checked;
        callbacks.bundling(bundling);
    }
    function updateBundleSize(){
        var bundleSize = inputs.settings.bundleSize.value;
        inputs.settings.spans.bundleSize.innerHTML = ":"+bundleSize+"px";
        callbacks.bundleSize(bundleSize);
    }
    function updateBundlePrecision(){
        var precision = inputs.settings.bundlePrecision.value*1;
        inputs.settings.spans.bundlePrecision.innerHTML = ":"+precision;
        callbacks.bundlePrecision(precision);
    }
    function updateSize(){
        var width = inputs.width.value;
        var height = inputs.height.value;
        callbacks.size(width,height);
    }
	
	exports.onTransformationChange1 = function(callback){
		callbacks.transformation1 = callback;
		updateTransformation1();
	};
    exports.onOffsetChange1 = function(callback){
        callbacks.offset1 = callback;
        updateOffset1();
    }
	exports.onPixelSizeChange = function(callback){
		callbacks.pixelSize = callback;
		updatePixelSize();
	};
	exports.onShadowModeChange = function(callback){
		callbacks.shadowMode = callback;
		updateShadowMode();
	};
	exports.onSmoothingRadiusChange = function(callback){
		callbacks.smoothing = callback;
		updateSmoothingRadius();
	}
    exports.onSpeedModifierChange = function(callback){
        callbacks.speed = callback;
        updateSpeedModifier();
    };
    exports.onBundlingChange = function(callback){
        callbacks.bundling = callback;
        updateBundling();
    };
    exports.onBundleSizeChange = function(callback){
        callbacks.bundleSize = callback;
        updateBundleSize();
    };
    exports.onBundlePrecisionChange = function(callback){
        callbacks.bundlePrecision = callback;
        updateBundlePrecision();
    };
    exports.onSizeChange = function(callback){
        callbacks.size = callback;
        updateSize();
    };
    
    exports.setTransformation1 = function(rotation1,rotation2,rotation3,scale){
        inputs.rotation1.value = rotation1;
        inputs.rotation2.value = rotation2;
        inputs.rotation3.value = rotation3;
        inputs.scale.value = scale;
		inputs.spans.rotation1.innerHTML = ":"+inputs.rotation1.value;
		inputs.spans.rotation2.innerHTML = ":"+inputs.rotation2.value;
		inputs.spans.rotation3.innerHTML = ":"+inputs.rotation3.value;
		inputs.spans.scale.innerHTML = ":"+inputs.scale.value;
    };
    exports.setOffset1 = function(offsetX,offsetY,offsetZ){
        inputs.offsetX.value = offsetX;
        inputs.offsetY.value = offsetY;
        inputs.offsetZ.value = offsetZ;
        inputs.spans.offsetX.innerHTML = ":"+inputs.offsetX.value;
        inputs.spans.offsetY.innerHTML = ":"+inputs.offsetY.value;
        inputs.spans.offsetZ.innerHTML = ":"+inputs.offsetZ.value;
    };
    exports.setSizeDisplay = function(width,height){
        inputs.width.value = width;
        inputs.height.value = height;
    };
	
	return exports;
};