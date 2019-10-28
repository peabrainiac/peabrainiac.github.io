const GifScripterSandbox = (function(){
    var exports = {};

    var onAddingFrame;
    var onFinish;

    var sandbox = new SemiSandbox();
    sandbox.setVariableConstructor("console",function(){
        return {log:function(){
            console.log.apply(console,arguments)
        }};
    });
    sandbox.setVariable("Math",Object.freeze(Math));
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
        exports.addFrame = function(canvasOrImageData){
            return new Promise(function(resolve,reject){
                setTimeout(function(){
                    resolve();
                },10);
                imageData = (canvasOrImageData instanceof ImageData)?canvasOrImageData:canvasOrImageData.getContext("2d").getImageData(0,0,canvasOrImageData.width,canvasOrImageData.height);
                onAddingFrame(imageData);
            });
        };
        exports.finish = function(){
            onFinish();
        };
        return exports;
    });

    exports.eval = function(code){
        sandbox.eval(code);
    };

    exports.onAddingFrame = function(callback){
        onAddingFrame = callback;
    };

    exports.onFinish = function(callback){
        onFinish = callback;
    };

    return exports;
});