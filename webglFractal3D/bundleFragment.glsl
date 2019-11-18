#version 300 es
precision highp float;

in vec3 pass_direction;
out vec4 out_values;

uniform vec3 cameraPosition;
uniform float bundleSize;

uniform mat3 fractalTransformation1;
uniform vec3 fractalOffset1;
uniform int iterations;

const float maxDistance = 25.0;

float dst_scene(vec3 pos);

void main(){
    vec3 direction = normalize(pass_direction);
	float totalDistance = 0.0;
	int steps;
	vec3 p;
	float distance;
	float prevDistance;
	for (steps=0;steps<10;steps++){
		p = cameraPosition+totalDistance*direction;
		prevDistance = distance;
		distance = dst_scene(p);
		totalDistance += distance;
		if (distance<totalDistance*bundleSize||distance>maxDistance){
			break;
		}
	}
    
	out_values = vec4(totalDistance-distance-prevDistance,0,0,steps-1);
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

vec3 nearestPoint(vec3 pos){
    vec3 p = pos;
    mat3 transformationInverse = inverse(fractalTransformation1);
    float sphereRad = 1.0;
    int i;
    for (i=0;i<iterations;i++){
        p.xyz = abs(p.xyz);
    }
    return p;
}