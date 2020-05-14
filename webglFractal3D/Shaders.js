import ShaderProgram from "../js/gl/ShaderProgram.js";

export default class Shaders {
	
	static async createShaderProgram(gl){
		var vertexSource = await ((await fetch("rayVertex.glsl")).text());
		var fragmentSource = await ((await fetch("rayFragment.glsl")).text());
		var shaderProgram = new ShaderProgram(gl,vertexSource,fragmentSource);
		shaderProgram.bindAttribLocation(0,"position");
		return shaderProgram;
	}

	static async createBundleShaderProgram(gl){
		var vertexSource = await ((await fetch("bundleVertex.glsl")).text());
		var fragmentSource = await ((await fetch("bundleFragment.glsl")).text());
		var shaderProgram = new ShaderProgram(gl,vertexSource,fragmentSource);
		shaderProgram.bindAttribLocation(0,"position");
		return shaderProgram;
	};
    
	static async createSimpleShaderProgram(gl){
		var vertexSource = await ((await fetch("simpleVertex.glsl")).text());
		var fragmentSource = await ((await fetch("simpleFragment.glsl")).text());
		var shaderProgram = new ShaderProgram(gl,vertexSource,fragmentSource);
		shaderProgram.bindAttribLocation(0,"position");
		return shaderProgram;
	};
};