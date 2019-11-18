#version 300 es
precision highp float;

in vec2 textureCoords;
out vec4 color;
uniform sampler2D sampler;

void main(){
	color = texture(sampler,textureCoords);
}