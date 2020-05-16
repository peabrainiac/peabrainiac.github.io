#version 300 es
precision highp float;

in vec2 pass_textureCoords;
out vec4 color;

uniform vec2 screenSize;
uniform vec2 mousePosition;
uniform float radius;

void main(){
	vec2 relativePosition = mod((pass_textureCoords+vec2(0.5))*screenSize-vec2(mousePosition.x,screenSize.y-mousePosition.y),screenSize)-0.5*screenSize;
	color = vec4(1,1,0,step(length(relativePosition),radius)*0.125);
}