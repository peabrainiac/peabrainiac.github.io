import ReactionDiffusionSimulation from "./ReactionDiffusionSimulation.js";

Utils.onPageLoad(async()=>{
	const stepsPerFrameInput = document.getElementById("stepsPerFrameInput");
	const fpsSpan = document.getElementById("fps");

	stepsPerFrameInput.value = 5;

	const canvas = document.getElementById("canvas");
	const simulation = new ReactionDiffusionSimulation();
	canvas.width = simulation.width;
	canvas.height = simulation.height;
	canvas.parentElement.style.width = 2*simulation.width+"px";
	canvas.parentElement.style.height = 2*simulation.height+"px";
	const ctx = canvas.getContext("2d");

	let lastFpsTimestamp = Date.now();
	let frames = 0;

	while(true){
		await new Promise((resolve)=>(window.requestAnimationFrame(resolve)));
		for (let i=0,l=stepsPerFrameInput.value;i<l;i++){
			simulation.update();
		}
		ctx.putImageData(simulation.render(),0,0);
		frames++;
		if (Date.now()-lastFpsTimestamp>1000){
			fpsSpan.innerText = frames+" fps";
			lastFpsTimestamp = Date.now();
			frames = 0;
		}
		//await new Promise((resolve)=>(setTimeout(resolve,500)));
	}
});