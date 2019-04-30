Utils.onPageLoad(function(){
	var sandbox = document.getElementById("sandbox");
	var button = document.getElementById("button");
	var filterFunctionInput = document.getElementById("filterFunctionInput");
	var tracerFunctionInput = document.getElementById("tracerFunctionInput");
	
	filterFunctionInput.value = "//determines wether a point's path should be traced or not\n//this is used to exclude points within the set from beeing rendered\n\nfunction filterFunc(cx,cy,iter){\n\tvar x = cx;\n\tvar y = cy;\n\tvar a = 1;\n\tvar temp;\n\tfor (var i=0;i<iter&&x*x+y*y<10;i++){\n\t\ta *= -1;\n\t\ttemp = x*x-y*y+cx;\n\t\ty = 2*x*y*a+cy;\n\t\tx = temp;\n\t}\n\treturn i<iter;\n}";
	tracerFunctionInput.value = "//traces the path of a given point\n\nfunction tracerFunc(cx,cy,iter,emitPoint){\n\tvar x = cx;\n\tvar y = cy;\n\tvar a = 1;\n\tvar temp;\n\tfor (var i=0;i<iter&&x*x+y*y<10;i++){\n\t\ta *= -1;\n\t\ttemp = x*x-y*y+cx;\n\t\ty = 2*x*y*a+cy;\n\t\tx = temp;\n\t\temitPoint(x,y);\n\t}\n}";
	
	button.addEventListener("click",function(){
		sandbox.contentWindow.postMessage({message:"setFormula",filterFunc:filterFunctionInput.value,tracerFunc:tracerFunctionInput.value},"*");
	});
});