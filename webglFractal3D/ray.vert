#version 300 es

in vec2 position;
out vec3 pass_direction;
out vec2 pass_textureCoords;

uniform float screenRatio;
uniform mat3 viewMatrix;

void main(){
	pass_direction = viewMatrix*vec3(position.x*0.5*sqrt(screenRatio),position.y*0.5/sqrt(screenRatio),1);
	pass_textureCoords = position*0.5+vec2(0.5);
	gl_Position = vec4(position,0,1);
}