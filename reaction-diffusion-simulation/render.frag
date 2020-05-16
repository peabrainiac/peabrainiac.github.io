#version 300 es
precision highp float;

in vec2 pass_textureCoords;
out vec4 color;
uniform sampler2D textureSampler;

void main(){
	vec4 textureValue = texture(textureSampler,pass_textureCoords);
	color = vec4(vec3(1.0-textureValue.xxx),1);
}