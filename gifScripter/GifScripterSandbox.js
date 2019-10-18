const GifScripterSandbox = (function(){
    var exports = {};

    var onAddingFrame;
    var onFinish;

    var sandbox = new SemiSandbox();
    sandbox.setVariableConstructor("console",function(){
        return {log:function(){
            console.log.apply(console,arguments)
        }
    }});
    sandbox.setVariable("Math",Object.freeze(Math));
    sandbox.setVariableConstructor("GifWriter",function(){
        var exports = {};
        exports.createCanvas = function(width,height){
            var canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            return canvas;
        };
        exports.addFrame = function(canvasOrImageData){
            return new Promise(function(resolve,reject){
                setTimeout(function(){
                    resolve();
                },100);
                imageData = (canvasOrImageData instanceof ImageData)?canvasOrImageData:canvasOrImageData.getContext("2d").getImageData(0,0,canvasOrImageData.width,canvasOrImageData.height);
                onAddingFrame(imageData);
            });
        };
        exports.finish = function(){
            onFinish();
        }
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