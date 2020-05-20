import Framebuffer from "../js/gl/Framebuffer.js";
import Texture from "../js/gl/Texture.js";
import Vao from "../js/gl/Vao.js";
import ShaderProgram from "../js/gl/ShaderProgram.js";
import {Vector3f} from "../js/Vectors.js";

export default class RayMarcher {
    constructor(canvas){
        this._gl = canvas.getContext("webgl2",{preserveDrawingBuffer:true});
        if (!this._gl){
            throw new Error("Couldn't get webgl2 context!")
        }
        let ext = this._gl.getExtension("EXT_COLOR_BUFFER_FLOAT");
        if (!ext){
            throw new Error("Couldn't get EXT_COLOR_BUFFER_FLOAT extension!")
        }
        
        this._readyPromise = new Promise(async(resolve,reject)=>{
            try {
                this._shaderProgram = await ShaderProgram.fetch(this._gl,"ray.vert","ray.frag",{attribs:["position"],textures:["startValuesSampler"]});
                this._simpleShader = await ShaderProgram.fetch(this._gl,"simple.vert","simple.frag",{attribs:["position"],textures:["sampler"]});
                this._bundleShader = await ShaderProgram.fetch(this._gl,"bundle.vert","bundle.frag",{attribs:["position"]});
                this.setTransformation1(0,0,0,2);
                this.setOffset1(0,0,1);
                this.shadowMode = this.AMBIENT_OCCLUSION+this.NORMAL_SHADOWS;
                resolve();
            }catch(e){
                reject(e);
            }
        });
        
        this._bundling = true;
        this._bundleSize = 8;
        this._bundlePrecision = 0.2;
        this._smoothingRadius = 5;
        this._pixelSize = 4;
        
        this._texture = new Texture(this._gl);
        this._texture.setFormat(this._gl.RGBA32F,this._gl.RGBA,0,0,this._gl.FLOAT);
        this._framebuffer = new Framebuffer(this._gl);
        this._framebuffer.attachTexture(this._texture,this._gl.COLOR_ATTACHMENT0)
        
        this._texture2 = new Texture(this._gl);
        this._framebuffer2 = new Framebuffer(this._gl);
        this._framebuffer2.attachTexture(this._texture2,this._gl.COLOR_ATTACHMENT0);
        this._defaultBuffer = new Framebuffer(this._gl,null);
        this._defaultBuffer.bind();
        
        this._vao = new Vao(this._gl);
        this._vao.addVbo(0,2,[-1,1,-1,-1,1,-1,1,-1,1,1,-1,1]);
        
    }

    async waitUntilReady(){
        await this._readyPromise;
    }
    
    render(width,height,camera){
        this._framebuffer.setSize(width/(this._pixelSize*this._bundleSize),height/(this._pixelSize*this._bundleSize));
        this._framebuffer.bind();
        this._framebuffer.clear(0,0,0,0);
        if (this._bundling){
            this._bundleShader.use();
            this._bundleShader.uniforms.screenRatio = width/height;
            this._bundleShader.uniforms.bundleSize = this._bundlePrecision*(this._smoothingRadius+this._bundleSize)*this._pixelSize/Math.sqrt(width*height);
            this._bundleShader.uniforms.cameraPosition = camera.position;
            this._bundleShader.uniforms.viewMatrix = camera.viewMatrix;
            this._gl.drawArrays(this._gl.TRIANGLES,0,6);
        }
        
        this._framebuffer2.setSize(width/this._pixelSize,height/this._pixelSize);
        this._framebuffer2.bind();
        this._framebuffer2.clear(0,0,0,1);
        this._shaderProgram.use();
        this._shaderProgram.uniforms.minDistance = this._smoothingRadius*this._pixelSize/Math.sqrt(width*height);
        this._shaderProgram.uniforms.screenRatio = width/height;
        this._shaderProgram.uniforms.cameraPosition = camera.position;
        this._shaderProgram.uniforms.viewMatrix = camera.viewMatrix;
        this._gl.activeTexture(this._gl.TEXTURE0);
        this._gl.bindTexture(this._gl.TEXTURE_2D,this._texture.id);
        this._gl.drawArrays(this._gl.TRIANGLES,0,6);
        
        this._defaultBuffer.setSize(width,height);
        this._defaultBuffer.bind();
        this._defaultBuffer.clear(0,0,0,1);
        this._simpleShader.use();
        this._gl.activeTexture(this._gl.TEXTURE0);
        this._gl.bindTexture(this._gl.TEXTURE_2D,this._texture2.id);
        this._gl.drawArrays(this._gl.TRIANGLES,0,6);
    }
    
    getDistanceToFractal(pos){
        var det = Math.pow(this._transformation1.getDeterminant(),0.33333);
        var factor = 1;
        var p = pos;
        for (var i=0;i<this._iterations;i++){
            p = p.map((x)=>(Math.abs(x)));
            p.subtract(this._offset1);
            this._transformation1.apply(p);
            factor *= det;
        }
        return (p.length-1)/factor;
    }

    setTransformation1(rotation1,rotation2,rotation3,scale){
        this._transformation1 = this.genTransformationMatrix(rotation1,rotation2,rotation3,scale);
        this._iterations = Math.min(Math.floor(7/Math.log10(scale)),200);
        this._shaderProgram.use();
        this._shaderProgram.uniforms.fractalTransformation1 = this._transformation1;
        this._shaderProgram.uniforms.iterations = this._iterations;
        this._bundleShader.use();
        this._bundleShader.uniforms.fractalTransformation1 = this._transformation1;
        this._bundleShader.uniforms.iterations = this._iterations;
    }

    setOffset1(x,y,z){
        this._offset1 = new Vector3f(x,y,z);
        this._shaderProgram.use();
        this._shaderProgram.uniforms.fractalOffset1 = this._offset1;
        this._bundleShader.use();
        this._bundleShader.uniforms.fractalOffset1 = this._offset1;
    }

    getTransformation1(){
        return this._transformation1;
    }

    getOffset1(){
        return this._offset1;
    }

    set pixelSize(ps){
        this._pixelSize = ps;
    }

    get pixelSize(){
        return this._pixelSize;
    }

    set smoothingRadius(rad){
        this._smoothingRadius = rad;
    }

    set bundling(b){
        this._bundling = b;
    }

    set bundleSize(bs){
        this._bundleSize = bs;
    }

    set bundlePrecision(p){
        this._bundlePrecision = p;
    }

    genTransformationMatrix(rotation1,rotation2,rotation3,scale){
        let matrix = new Matrix3f();
        matrix.rotate(rotation1,rotation2,rotation3);
        matrix.scale(scale);
        return matrix;
    }

    /**
     * Updates the position and direction vectors with the same transformation that occured to the closest point in the fractal.
     * @param {Vector3f} position
     * @param {Matrix3f} direction
     * @param {Matrix3f} oldTransform
     * @param {Vector3f} oldOffset
     * @param {Matrix3f} newTransform
     * @param {Vector3f} newOffset
     */
    changePointWithFormula(position,direction,oldTransform,oldOffset,newTransform,newOffset){
        var iter = 0;
        var p = position.copy();
        var d = direction.copy();
        var oldTransformNormalized = oldTransform.copy();
        oldTransformNormalized.normalize();
        var signs = [];
        while(p.length<5&&iter<100){
            signs.push(p.map((x)=>(x>0?1:-1)));
            p = p.map((x)=>(Math.abs(x)));
            d.scaleColumns(signs[iter]);
            p.subtract(oldOffset);
            oldTransform.apply(p);
            oldTransformNormalized.apply(d);
            iter++;
        }
        var newTransformInverse = newTransform.getInverse();
        var newTransformInverseNormalized = newTransformInverse.copy();
        newTransformInverseNormalized.normalize();
        while(iter>0){
            iter--;
            newTransformInverseNormalized.apply(d);
            newTransformInverse.apply(p);
            p.add(newOffset);
            d.scaleColumns(signs[iter]);
            p.x = Math.max(p.x,0);
            p.y = Math.max(p.y,0);
            p.z = Math.max(p.z,0);
            p.multiply(signs[iter]);
        }
        position.setTo(p);
        direction.setTo(d);
    }

    get AMBIENT_OCCLUSION(){
        return 1;
    }

    get NORMAL_SHADOWS(){
        return 2;
    }

    set shadowMode(mode){
        this._shaderProgram.use();
        this._shaderProgram.uniforms.shadowMode = mode;
    }

};