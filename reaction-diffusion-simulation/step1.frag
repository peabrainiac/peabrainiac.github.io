#version 300 es
precision highp float;

in vec2 pass_textureCoords;
out vec4 color;

uniform float pixelWidth;
uniform vec3 kernel;
uniform sampler2D textureSampler;

void main(){
	vec2 pixelWidthVector = vec2(pixelWidth,0);
	vec2 average = vec2(0);
	average += kernel.z*texture(textureSampler,pass_textureCoords-pixelWidthVector*2.0).xy;
	average += kernel.y*texture(textureSampler,pass_textureCoords-pixelWidthVector).xy;
	average += kernel.x*texture(textureSampler,pass_textureCoords).xy;
	average += kernel.y*texture(textureSampler,pass_textureCoords+pixelWidthVector).xy;
	average += kernel.z*texture(textureSampler,pass_textureCoords+pixelWidthVector*2.0).xy;
	color = vec4(average,0,1);
}