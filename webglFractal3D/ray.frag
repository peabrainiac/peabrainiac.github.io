#version 300 es
precision highp float;

in vec3 pass_direction;
in vec2 pass_textureCoords;
out vec4 color;

uniform sampler2D startValuesSampler;

uniform vec3 cameraPosition;

uniform mat3 fractalTransformation1;
uniform vec3 fractalOffset1;
uniform int iterations;
uniform int shadowMode;
uniform float minDistance;

const int maxSteps = 128;
const float maxDistance = 25.0;

float trace(inout vec3 position, vec3 direction, float startDistance, int startSteps);
float dst_scene(vec3 pos);
float dst_sphere(vec3 pos, vec3 spherePos, float radius);
vec3 fractalColor(vec3 pos);
float surfaceAngle(vec3 pos, vec3 direction);

void main(){
	vec3 direction = normalize(pass_direction);
	vec3 position = cameraPosition;
    vec4 startValues = texture(startValuesSampler,pass_textureCoords);
	float steps = trace(position,direction,startValues.r,int(startValues.a));
	float angle = 0.5+0.5*surfaceAngle(position,direction);
	float result = 1.0;
	if (shadowMode%2==1){
		result *= steps*steps;
	}
	if (shadowMode%4>=2){
		result *= angle;
	}
	
	color = vec4(result*fractalColor(position),1);
}

float trace(inout vec3 position, vec3 direction, float startDistance, int startSteps){
	float totalDistance = startDistance;
	int steps;
	vec3 p;
	float distance;
	float prevDistance;
	for (steps=startSteps;steps<maxSteps;steps++){
		p = position+totalDistance*direction;
		prevDistance = distance;
		distance = dst_scene(p);
		totalDistance += distance;
		if (distance<totalDistance*minDistance){
			break;
		}
		if (totalDistance>maxDistance){
			steps = maxSteps;
			break;
		}
	}
	position += totalDistance*(1.0-minDistance)*direction;
	if (steps==maxSteps){
		return 0.0;
	}else{
		return 1.0-(float(steps)-(totalDistance*minDistance-distance)/(prevDistance-distance))/float(maxSteps);
	}
}

float dst_scene(vec3 pos){
	float det = pow(determinant(fractalTransformation1),0.33333);
	float factor = 1.0;
	vec3 p = pos;
	float sphereRad = 1.0;
	for (int i=0;i<iterations;i++){
		p.xyz = abs(p.xyz);
		p -= fractalOffset1;
		p = fractalTransformation1*p;
		factor *= det;
		if (length(p)>maxDistance){
			sphereRad *= det/(det-1.0);
			break;
		}
	}
	return (length(p)-sphereRad)/factor;
}

vec3 fractalColor(vec3 pos){
	float det = pow(determinant(fractalTransformation1),0.33333);
	float factor = 1.0;
	vec3 p = pos;
	float sphereRad = 1.0;
    vec3 color = vec3(0.0);
	for (int i=0;i<iterations;i++){
		p.xyz = abs(p.xyz);
		p -= fractalOffset1;
		p = fractalTransformation1*p;
		factor *= det;
        color = max(color,p);
		if (length(p)>maxDistance){
			break;
		}
	}
    color = min(color,vec3(1.0));
    return color;
}

float surfaceAngle(vec3 pos, vec3 direction){
	float det = pow(determinant(fractalTransformation1),0.33333);
	vec3 p = pos;
	vec3 d = direction;
	for (int i=0;i<iterations;i++){
		if (p.x<0.0){
			d.x *= -1.0;
		}
		if (p.y<0.0){
			d.y *= -1.0;
		}
		if (p.z<0.0){
			d.z *= -1.0;
		}
		p.xyz = abs(p.xyz);
		p -= fractalOffset1;
		p = fractalTransformation1*p;
		d = fractalTransformation1*d;
		if (length(p)>maxDistance){
			break;
		}
	}
	return -dot(normalize(d),normalize(p));
}

float dst_sphere(vec3 pos, vec3 spherePos, float radius){
	return length(pos-spherePos)-radius;
}