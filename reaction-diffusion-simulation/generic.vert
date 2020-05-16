#version 300 es

in vec2 position;
in vec2 textureCoords;
out vec2 pass_textureCoords;

void main(){
	pass_textureCoords = textureCoords;
	gl_Position = vec4(position,0,1);
}