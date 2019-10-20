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

	exports.enableSmartTab = function(element){
		console.log("Enabling smart tab for element:",element);
		element.addEventListener("keydown",function(e){
			if (e.code=="Tab"){
				e.preventDefault();
				var start = element.selectionStart;
				var end = element.selectionEnd;
				var value = element.value;
				var before = value.substring(0,start);
				var selection = value.substring(start,end)
				var after = value.substring(end);
				if(selection.indexOf("\n")==-1){
					element.value = before+"\t"+after;
					element.selectionStart = start+1;
					element.selectionEnd = element.selectionStart;
				}else{
					selection = (e.shiftKey?selection.replace(/\n\t/g,"\n"):selection.replace(/\n/g,"\n\t"))
					element.value = before+selection+after;
					element.selectionStart = start;
					element.selectionEnd = start+selection.length;
				}
			}
		});
	}
	
	return exports;
})();