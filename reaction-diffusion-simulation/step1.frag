#version 300 es
precision highp float;

in vec2 pass_textureCoords;
out vec4 color;

uniform float pixelWidth;
uniform vec3 kernelA;
uniform vec3 kernelB;
uniform sampler2D textureSampler;

void main(){
	vec2 pixelWidthVector = vec2(pixelWidth,0);
	vec2 average = vec2(0);
	average += vec2(kernelA.z,kernelB.z)*texture(textureSampler,pass_textureCoords-pixelWidthVector*2.0).xy;
	average += vec2(kernelA.y,kernelB.y)*texture(textureSampler,pass_textureCoords-pixelWidthVector).xy;
	average += vec2(kernelA.x,kernelB.x)*texture(textureSampler,pass_textureCoords).xy;
	average += vec2(kernelA.y,kernelB.y)*texture(textureSampler,pass_textureCoords+pixelWidthVector).xy;
	average += vec2(kernelA.z,kernelB.z)*texture(textureSampler,pass_textureCoords+pixelWidthVector*2.0).xy;
	color = vec4(average,0,1);
}