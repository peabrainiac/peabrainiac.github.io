const GifScripterSandbox = (function(){
    var exports = {};

    var onAddingFrame;
    var onFinish;

    var delay = 5;

    var sandbox = new SemiSandbox();
    sandbox.setVariableConstructor("console",function(){
        return {log:function(){
            console.log.apply(console,arguments)
        }};
    });
    sandbox.setVariable("Math",Math);
    sandbox.setVariable("ImageData",ImageData);
    sandbox.setVariable("Int8Array",Int8Array);
    sandbox.setVariable("Uint8Array",Uint8Array);
    sandbox.setVariable("Uint8ClampedArray",Uint8ClampedArray);
    sandbox.setVariable("Int16Array",Int16Array);
    sandbox.setVariable("Uint16Array",Uint16Array);
    sandbox.setVariable("Int32Array",Int32Array);
    sandbox.setVariable("Uint32Array",Uint32Array);
    sandbox.setVariable("Float32Array",Float32Array);
    sandbox.setVariable("Float64Array",Float64Array);
    sandbox.setVariableConstructor("Utils",function(){
        return {hslToRgb:function(h,s,l){
            let c = s*(1-Math.abs(2*l-1));
            let h2 = 6*(h%1);
            let m = l-c/2;
            let r = m+c*Math.min(Math.max(Math.abs(h2-3)-1,0),1);
            let g = m+c*Math.min(Math.max(2-Math.abs(h2-2),0),1);
            let b = m+c*Math.min(Math.max(2-Math.abs(h2-4),0),1);
            return [r,g,b];
        }};
    });
    sandbox.setVariableConstructor("GifWriter",function(){
        var exports = {};
        exports.createCanvas = function(width,height){
            var canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            return canvas;
        };
        exports.createImageData = function(width,height){
            var imgData = new ImageData(width,height);
            for (let i=0,l=imgData.data/4;i<l;i++){
                imgData.data[i*4+3] = 255;
            }
            return imgData;
        };
        exports.wait = async function(delay){
            return new Promise(function(resolve,reject){
                setTimeout(resolve,delay);
            });
        };
        exports.addFrame = function(canvasOrImageData){
            return new Promise(function(resolve,reject){
                imageData = (canvasOrImageData instanceof ImageData)?canvasOrImageData:canvasOrImageData.getContext("2d").getImageData(0,0,canvasOrImageData.width,canvasOrImageData.height);
                onAddingFrame(imageData,delay).then(function(){
                    setTimeout(function(){
                        resolve();
                    },30);
                });
            });
        };
        exports.setDelay = function(d){
            delay = d;
        };
        exports.finish = function(){
            onFinish();
        };
        return exports;
    });

    exports.eval = function(code){
        sandbox.eval(code);
    };

    exports.getGlobalScope = function(){
        return sandbox.getGlobalScope();
    };

    exports.onAddingFrame = function(callback){
        onAddingFrame = callback;
    };

    exports.onFinish = function(callback){
        onFinish = callback;
    };

    return exports;
});