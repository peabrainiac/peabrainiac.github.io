#version 300 es
precision highp float;

in vec2 pass_textureCoords;
out vec4 color;

uniform float pixelHeight;
uniform vec3 kernel;
uniform sampler2D textureSampler;

uniform float growthRateA;
uniform float deathRateB;

void main(){
	vec2 pixelHeightVector = vec2(0,pixelHeight);
	vec2 average = vec2(0);
	average += kernel.z*texture(textureSampler,pass_textureCoords-pixelHeightVector*2.0).xy;
	average += kernel.y*texture(textureSampler,pass_textureCoords-pixelHeightVector).xy;
	average += kernel.x*texture(textureSampler,pass_textureCoords).xy;
	average += kernel.y*texture(textureSampler,pass_textureCoords+pixelHeightVector).xy;
	average += kernel.z*texture(textureSampler,pass_textureCoords+pixelHeightVector*2.0).xy;
	vec2 newValue = average+vec2(-1,1)*average.x*average.y*average.y;
	newValue += vec2(growthRateA,deathRateB)*(vec2(1,0)-newValue);
	color = vec4(newValue,0,1);
}