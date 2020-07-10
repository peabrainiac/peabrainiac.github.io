import Utils from "../js/Utils.js";

import MandelbrotExplorerElement from "./MandelbrotExplorerElement.js";
import {GeneralSettingsGroup,ToolsSettingsGroup} from "./Settings.js";

Utils.onPageLoad(()=>{
	/** @type {MandelbrotExplorerElement} */
	const fractalExplorer = document.querySelector("mandelbrot-explorer-element");
	const sidebar = document.querySelector("sidebar-element");
	const generalSettings = new GeneralSettingsGroup();
	const tools = new ToolsSettingsGroup();
	sidebar.appendChild(generalSettings);
	sidebar.appendChild(tools);
	generalSettings.onResolutionChange((width,height)=>{
		fractalExplorer.width = width;
		fractalExplorer.height = height;
	});
	generalSettings.onScreenshotTake(async()=>{
		let blob = await fractalExplorer.toBlob();
		let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = "image.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
	});
	generalSettings.onZoomFactorChange((zoomFactor)=>{
		fractalExplorer.zoomFactor = zoomFactor;
	});
	tools.onFindOrbitButtonClick(()=>{
		let x = fractalExplorer.fractalCanvas.x;
		let y = fractalExplorer.fractalCanvas.y;
		console.log(x,y,MandelMaths.approxNearbyOrbitPoints(x,y,20));
	});
});