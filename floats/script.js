Utils.onPageLoad(()=>{
	let inputA = document.getElementById("input-a");
	let inputB = document.getElementById("input-b");
	let buttonA = document.getElementById("input-a-button");
	let buttonB = document.getElementById("input-b-button");
	let bits = (float)=>(Array.from(new Uint8Array(new Float64Array([float]).buffer),(byte)=>(byte.toString(2).padStart(8,"0"))).reverse().join(" "));
	let float = (string)=>(new Float64Array(Uint8Array.from(string.split(" ").reverse(),(str)=>(1*("0b"+str))).buffer)[0]);
	let precision = (float)=>(1023+52-("0b"+bits(float).substring(1,13).replace(" ","")));
	let mantissa = (float)=>(bits(float).substring(13).replace(/ /g,""));
	let string = (float,minPrecision=0,minLength=0,mantissaStartText="",mantissaEndText="")=>{
		let string = float.toString(2);
		let p = precision(float);
		string = string.padEnd(string.indexOf(".")+p+1,"0");
		let l = string.length;
		string = string.substring(0,l-52)+mantissaStartText+string.substring(l-52)+mantissaEndText;
		if (p<minPrecision){
			string += "0".repeat(minPrecision-p);
			l += minPrecision-p;
		}
		if (l<minLength){
			string = " ".repeat(minLength-l)+string;
		}
		return string;
	};
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
		let minPrecision = Math.min(...values.map((float)=>(precision(float))));
		let length = Math.max(54+maxPrecision-minPrecision,maxPrecision+2);
		let strings = values.map((float)=>(string(float,maxPrecision+1,length+1,`<span class="mantissa">`,`</span>`)));
		document.getElementById("results").innerHTML = strings.map((string,index)=>(`<span class="label">${labels[index]}: </span><span class="number">${string}</span>`)).join("<br>");
	}
	inputA.value = bits(Math.random());
	inputB.value = bits(Math.random());
	refresh();
});