const Utils = (function(){
	var exports = {};
	
	exports.onPageLoad = function(f){
		if (document.readyState!="loading"){
			f();
		}else{
			window.addEventListener("load",f);
		}
	};
	
	exports.setSize = function(element,width,height){
		element.style.width = width+"px";
		element.style.height = height+"px";
		if (element instanceof HTMLCanvasElement){
			element.width = width;
			element.height = height;
		}
	};
	
	return exports;
})();