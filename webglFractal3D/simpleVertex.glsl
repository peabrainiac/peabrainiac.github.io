#version 300 es

in vec2 position;
out vec2 textureCoords;

void main(){
	textureCoords = position*0.5+vec2(0.5);
	gl_Position = vec4(position,0,1);
}