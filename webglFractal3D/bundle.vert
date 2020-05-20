#version 300 es

in vec2 position;
out vec3 pass_direction;

uniform float screenRatio;
uniform mat3 viewMatrix;

void main(){
    pass_direction = viewMatrix*vec3(position.x*0.5*sqrt(screenRatio),position.y*0.5/sqrt(screenRatio),1);
    gl_Position = vec4(position,0,1);
}