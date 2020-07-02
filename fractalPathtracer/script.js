import Utils from "../js/Utils.js";

Utils.onPageLoad(function(){
	var sandbox = document.getElementById("sandbox");
	var button = document.getElementById("button");
	var filterFunctionInput = document.getElementById("filterFunctionInput");
	var tracerFunctionInput = document.getElementById("tracerFunctionInput");
	var widthInput = document.getElementById("widthInput");
	var heightInput = document.getElementById("heightInput");
	var posInputX = document.getElementById("posInputX");
	var posInputY = document.getElementById("posInputY");
	var zoomInput = document.getElementById("zoomInput");
	var iterInput = document.getElementById("iterInput");
	var samplesInput = document.getElementById("samplesInput");
	
	filterFunctionInput.globalScope = {filterFunc:{}};
	tracerFunctionInput.globalScope = {tracerFunc:{},emitPoint:{}};
	filterFunctionInput.value = "//determines wether a point's path should be traced or not\n//this is used to exclude points within the set from beeing rendered\n\nfunction filterFunc(cx,cy,iter){\n\tvar x = cx;\n\tvar y = cy;\n\tvar a = 1;\n\tvar temp;\n\tfor (var i=0;i<iter&&x*x+y*y<10;i++){\n\t\ta *= -1;\n\t\ttemp = x*x-y*y+cx;\n\t\ty = 2*x*y*a+cy;\n\t\tx = temp;\n\t}\n\treturn i<iter;\n}";
	tracerFunctionInput.value = "//traces the path of a given point\n\nfunction tracerFunc(cx,cy,iter,emitPoint){\n\tvar x = cx;\n\tvar y = cy;\n\tvar a = 1;\n\tvar temp;\n\tfor (var i=0;i<iter&&x*x+y*y<10;i++){\n\t\ta *= -1;\n\t\ttemp = x*x-y*y+cx;\n\t\ty = 2*x*y*a+cy;\n\t\tx = temp;\n\t\temitPoint(x,y);\n\t}\n}";
	widthInput.value = 1280;
	heightInput.value = 960;
	posInputX.value = 0;
	posInputY.value = 0;
	zoomInput.value = 0.8;
	iterInput.value = 500;
	samplesInput.value = 25000000;
	
	button.addEventListener("click",function(){
		sandbox.contentWindow.postMessage({message:"setFormula",filterFunc:filterFunctionInput.value,tracerFunc:tracerFunctionInput.value},"*");
		sandbox.contentWindow.postMessage({message:"setSize",width:widthInput.value,height:heightInput.value},"*");
		sandbox.contentWindow.postMessage({message:"setPosition",posX:posInputX.value,posY:posInputY.value,zoom:zoomInput.value},"*");
		sandbox.contentWindow.postMessage({message:"setIterations",iterations:iterInput.value},"*");
		sandbox.contentWindow.postMessage({message:"setSamples",samples:samplesInput.value},"*");
		sandbox.contentWindow.postMessage({message:"render"},"*");
	});
});