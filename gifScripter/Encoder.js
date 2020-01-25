const Encoder = function(){
    var exports = {};

    var onFinish;
    var onProgress;

    var framesRequested;
    var framesEncoded;
    var framePromiseResolvers = [];

    var webWorker = new Worker("./EncoderWebWorker.js");
    webWorker.onmessage = function(e){
        var message = e.data;
        if (message.action=="finished"){
            if (onFinish){
                onFinish(message.data);
            }
        }else if(message.action=="addedFrame"){
            framesEncoded++;
            if (onProgress){
                onProgress(framesEncoded);
            }
            var promiseResolver = framePromiseResolvers.shift();
            if (promiseResolver){
                promiseResolver();
            }
        }else if(message.action=="logPerformance"){
            console.log(...message.data);
        }else if (message.action=="logCodeBlock"){
            console.log(...message.data);
        }else if (message.action=="logQuantizerDebugData"){
            //console.log(...message.data);
        }else{
            console.log("Message from web worker: ",message);
        }
    };

    exports.start = function(){
        framesRequested = 0;
        framesEncoded = 0;
        webWorker.postMessage({action:"start"});
    };

    exports.addComment = function(text){
        webWorker.postMessage({action:"addComment",data:{text:text}});
    };

    exports.addFrame = function(imgData,delay){
        webWorker.postMessage({action:"addFrame",data:{imgData:imgData,delay:delay}});
        framesRequested++;
        if (framesRequested-framesEncoded>2){
            return new Promise(function(resolve,reject){
                framePromiseResolvers.push(resolve);
            })
        }else{
            return Promise.resolve();
        }
    };

    exports.finish = function(){
        webWorker.postMessage({action:"finish"});
        return new Promise(function(resolve,reject){
            onFinish = resolve;
        });
    };

    exports.onProgress = function(callback){
        onProgress = callback;
    };

    return exports;
};