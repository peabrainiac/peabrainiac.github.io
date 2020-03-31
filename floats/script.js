Utils.onPageLoad(()=>{
	let inputA = document.getElementById("input-a");
	let inputB = document.getElementById("input-b");
	let buttonA = document.getElementById("input-a-button");
	let buttonB = document.getElementById("input-b-button");
	let bits = (float)=>(Array.from(new Uint8Array(new Float64Array([float]).buffer),(byte)=>(byte.toString(2).padStart(8,"0"))).reverse().join(" "));
	let float = (string)=>(new Float64Array(Uint8Array.from(string.split(" ").reverse(),(str)=>(1*("0b"+str))).buffer)[0]);
	let string = (float)=>(float.toString(2));
	let precision = (float)=>(1023+52-("0b"+bits(float).substring(1,13).replace(" ","")));
	buttonA.addEventListener("click",()=>{
		inputA.value = bits(Math.random());
		refresh();
	});
	buttonB.addEventListener("click",()=>{
		inputB.value = bits(Math.random());
		refresh();
	});
	function refresh(){
		let a = float(inputA.value);
		let b = float(inputB.value);
		let labels = ["a","b","a+b","(a+b)-b"];
		let values = [a,b,a+b,(a+b)-b];
		let maxPrecision = Math.max(...values.map((float)=>(precision(float))));
		console.log("maxPrecision:",maxPrecision);
		let strings = values.map((float)=>(string(float))).map((string)=>(string.padEnd(string.indexOf(".")+maxPrecision+2,"0")));
		let maxLength = Math.max(...strings.map((string)=>(string.length)));
		let maxLabelLength = Math.max(...labels.map((string)=>(string.length)));
		let text = strings.map((string,index)=>((labels[index]+":").padEnd(maxLabelLength+1," ")+string.padStart(maxLength," "))).join("\n");
		document.getElementById("results").innerText = text;
	}
	inputA.value = bits(Math.random());
	inputB.value = bits(Math.random());
	refresh();
});