const Shaders = (function(){
	var exports = {};
	
	exports.getVertexShaderSource = function(){
		return `#version 300 es
			
			in vec2 position;
			out vec3 pass_direction;
			
			uniform float screenRatio;
			uniform mat3 viewMatrix;
			
			void main(){
				pass_direction = viewMatrix*vec3(position.x*0.5*sqrt(screenRatio),position.y*0.5/sqrt(screenRatio),1);
				gl_Position = vec4(position,0,1);
			}
		`;
	};
	exports.getFragmentShaderSource = function(){
		return `#version 300 es
			precision mediump float;
			
			in vec3 pass_direction;
			out vec4 color;
			
			uniform vec3 cameraPosition;
			
			const int maxSteps = 128;
			const float minDistance = 0.01;
			
			float trace(vec3 position, vec3 direction);
			float dst_scene(vec3 pos);
			float dst_sphere(vec3 pos, vec3 spherePos, float radius);
			
			void main(){
				vec3 direction = normalize(pass_direction);
				float result = trace(cameraPosition,direction);
				
				color = vec4(result,result,result,1);
			}
			
			float trace(vec3 position, vec3 direction){
				float totalDistance = 0.0;
				int steps;
				vec3 p;
				float distance;
				float prevDistance;
				for (steps=0;steps<maxSteps;steps++){
					p = position+totalDistance*direction;
					prevDistance = distance;
					distance = dst_scene(p);
					totalDistance += distance;
					if (distance<minDistance){
						break;
					}
				}
				if (steps==maxSteps){
					return 0.0;
				}else{
					return 1.0-(float(steps)-(minDistance-distance)/(prevDistance-distance))/float(maxSteps);
				}
			}
			
			float dst_scene(vec3 pos){
				//return min(dst_sphere(pos,vec3(0),1.0),min(dst_sphere(pos,vec3(-1.4,0,-1.4),1.0),dst_sphere(pos,vec3(1.4,0,1.4),1.0)));
				return dst_sphere(mod(pos,4.0),vec3(2.0),0.1);
			}
			
			float dst_sphere(vec3 pos, vec3 spherePos, float radius){
				return length(pos-spherePos)-radius;
			}
		`;
	};
	exports.createShaderProgram = function(gl){
		var shaderProgram = new ShaderProgram(gl,exports.getVertexShaderSource(),exports.getFragmentShaderSource());
		shaderProgram.bindAttribLocation(0,"position");
		return shaderProgram;
	};
	
	Object.freeze(exports);
	return exports;
})();;