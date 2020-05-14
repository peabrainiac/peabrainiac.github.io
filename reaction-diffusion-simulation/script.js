import ReactionDiffusionSimulation from "./ReactionDiffusionSimulation.js";

Utils.onPageLoad(async()=>{
	const stepsPerFrameInput = document.getElementById("stepsPerFrameInput");
	const growthRateInput = document.getElementById("growthRateInput");
	const deathRateInput = document.getElementById("deathRateInput");
	const diffusionInputA = document.getElementById("diffusionInputA");
	const diffusionInputB = document.getElementById("diffusionInputB");
	const scaleInput = document.getElementById("scaleInput");
	const fpsSpan = document.getElementById("fps");

	stepsPerFrameInput.value = 5;
	growthRateInput.valueToString = (value)=>(`${(value*100).toPrecision(2)}% per tick`);
	deathRateInput.valueToString = (value)=>(`${(value*100).toPrecision(2)}% per tick`);
	diffusionInputA.valueToString = (value)=>(`${Math.round(value*100)}%`);
	diffusionInputB.valueToString = (value)=>(`${Math.round(value*100)}%`);

	const canvas = document.getElementById("canvas");
	const container = canvas.parentElement;
	const simulation = new ReactionDiffusionSimulation(canvas,480,360);
	container.style.width = 2*simulation.width+"px";
	container.style.height = 2*simulation.height+"px";

	let lastFpsTimestamp = Date.now();
	let frames = 0;

	while(true){
		await new Promise((resolve)=>(window.requestAnimationFrame(resolve)));
		simulation.scale = scaleInput.value;
		simulation.growthRate = 1*growthRateInput.value;
		simulation.deathRate = 1*deathRateInput.value;
		simulation.diffusionA = diffusionInputA.value;
		simulation.diffusionB = diffusionInputB.value;
		for (let i=0,l=stepsPerFrameInput.value;i<l;i++){
			simulation.update();
		}
		simulation.render();
		frames++;
		if (Date.now()-lastFpsTimestamp>1000){
			fpsSpan.innerText = frames+" fps";
			lastFpsTimestamp = Date.now();
			frames = 0;
		}
		//await new Promise((resolve)=>(setTimeout(resolve,500)));
	}
});