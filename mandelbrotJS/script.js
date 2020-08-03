import Utils from "../js/Utils.js";

import MandelbrotExplorerElement from "./MandelbrotExplorerElement.js";
import {GeneralSettingsGroup,ToolsSettingsGroup} from "./Settings.js";
import OrbitPointsOverlay from "./OrbitPointsOverlay.js";

Utils.onPageLoad(()=>{
	/** @type {MandelbrotExplorerElement} */
	const fractalExplorer = document.querySelector("mandelbrot-explorer-element");
	const sidebar = document.querySelector("sidebar-element");
	const generalSettings = new GeneralSettingsGroup();
	const tools = new ToolsSettingsGroup();
	sidebar.appendChild(generalSettings);
	sidebar.appendChild(tools);
	generalSettings.link(fractalExplorer);
	const orbitPointsOverlay = new OrbitPointsOverlay();
	orbitPointsOverlay.slot = "overlay";
	fractalExplorer.appendChild(orbitPointsOverlay);
	fractalExplorer.fractalCanvas.onViewportChange((viewport)=>{
		orbitPointsOverlay.viewport = viewport;
	});
	tools.onFindOrbitButtonClick(()=>{
		orbitPointsOverlay.show();
		orbitPointsOverlay.showPoints(fractalExplorer.fractalCanvas.x,fractalExplorer.fractalCanvas.y);
	});
});