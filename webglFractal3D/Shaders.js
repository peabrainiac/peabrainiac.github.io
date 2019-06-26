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
			precision highp float;
			
			in vec3 pass_direction;
			out vec4 color;
			
			uniform vec3 cameraPosition;
			
			uniform mat3 fractalTransformation1;
			uniform vec3 fractalOffset1;
			
			const int maxSteps = 128;
			const float minDistance = 0.00125;
			const float maxDistance = 25.0;
			
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
					if (distance<totalDistance*minDistance){
						break;
					}
					if (totalDistance>maxDistance){
						steps = maxSteps;
						break;
					}
				}
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
				for (int i=0;i<22;i++){
					p.xyz = abs(p.xyz);
					p -= fractalOffset1;
					p = fractalTransformation1*p;
					factor *= det;
					if (length(p)>maxDistance){
						break;
					}
				}
				return (length(p)-2.0)/factor;
			}
			
			float dst_sphere(vec3 pos, vec3 spherePos, float radius){
				return length(pos-spherePos)-radius;
			}
		`;
	};
	exports.getSimpleVertexSource = function(){
		return `#version 300 es
			
			in vec2 position;
			out vec2 textureCoords;
			
			void main(){
				textureCoords = position*0.5+vec2(0.5);
				gl_Position = vec4(position,0,1);
			}
		`;
	};
	exports.getSimpleFragmentSource = function(){
		return `#version 300 es
			precision highp float;
			
			in vec2 textureCoords;
			out vec4 color;
			uniform sampler2D sampler;
			
			void main(){
				color = texture(sampler,textureCoords);
			}
		`;
	};
	exports.createShaderProgram = function(gl){
		var shaderProgram = new ShaderProgram(gl,exports.getVertexShaderSource(),exports.getFragmentShaderSource());
		shaderProgram.bindAttribLocation(0,"position");
		return shaderProgram;
	};
	exports.createSimpleShaderProgram = function(gl){
		var shaderProgram = new ShaderProgram(gl,exports.getSimpleVertexSource(),exports.getSimpleFragmentSource());
		shaderProgram.bindAttribLocation(0,"position");
		return shaderProgram;
	};
	
	Object.freeze(exports);
	return exports;
})();;