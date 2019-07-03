const InputManager = function(){
	var exports = {};
	
	var inputs = {};
	inputs.rotation1 = document.getElementById("input-rotation-1");
	inputs.rotation2 = document.getElementById("input-rotation-2");
	inputs.rotation3 = document.getElementById("input-rotation-3");
	inputs.scale = document.getElementById("input-scale");
	inputs.spans = {};
	inputs.spans.rotation1 = document.getElementById("input-rotation-1-span");
	inputs.spans.rotation2 = document.getElementById("input-rotation-2-span");
	inputs.spans.rotation3 = document.getElementById("input-rotation-3-span");
	inputs.spans.scale = document.getElementById("input-scale-span");
	
	inputs.settings = {};
	inputs.settings.pixelSize = document.getElementById("input-pixelsize");
	inputs.settings.shadowMode = document.getElementById("input-shadowmode");
	inputs.settings.smoothing = document.getElementById("input-smoothing");
    inputs.settings.speed = document.getElementById("input-speed");
    inputs.settings.bundling = document.getElementById("input-bundling-checkbox");
    inputs.settings.bundleSize = document.getElementById("input-bundlesize");
	inputs.settings.spans = {};
	inputs.settings.spans.pixelSize = document.getElementById("input-pixelsize-span");
	inputs.settings.spans.smoothing = document.getElementById("input-smoothing-span");
    inputs.settings.spans.speed = document.getElementById("input-speed-span");
    inputs.settings.spans.bundleSize = document.getElementById("input-bundlesize-span");
	
	inputs.rotation1.addEventListener("input",updateTransformation1);
	inputs.rotation2.addEventListener("input",updateTransformation1);
	inputs.rotation3.addEventListener("input",updateTransformation1);
	inputs.scale.addEventListener("input",updateTransformation1);
	
	inputs.settings.pixelSize.addEventListener("input",updatePixelSize);
	inputs.settings.shadowMode.addEventListener("change",updateShadowMode);
	inputs.settings.smoothing.addEventListener("input",updateSmoothingRadius);
    inputs.settings.speed.addEventListener("input",updateSpeedModifier);
    inputs.settings.bundling.addEventListener("input",updateBundling);
    inputs.settings.bundleSize.addEventListener("input",updateBundleSize);
	
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
	
	exports.onTransformationChange1 = function(callback){
		callbacks.transformation1 = callback;
		updateTransformation1();
	};
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
	
	return exports;
};