importScripts("../js/BinaryFile.js");
importScripts("../js/GifEncoder.js");
importScripts("../js/ColorQuantizer.js");

var colorQuantizer;
var gifEncoder;

var performanceConsole = {log:function(){
    postMessage({action:"logPerformance",data:Array.from(arguments)});
}};
var codeBlockConsole = {log:function(){
    postMessage({action:"logCodeBlock",data:Array.from(arguments)});
}};
var quantizerDebugConsole = {log:function(){
    postMessage({action:"logQuantizerDebugData",data:Array.from(arguments)});
}};

onmessage = function(e){
    var message = e.data;
    if (message.action=="start"){
        colorQuantizer = new ColorQuantizer();
        colorQuantizer.logDebugData(quantizerDebugConsole);
        gifEncoder = new GifEncoder();
        gifEncoder.logPerformance(performanceConsole);
        gifEncoder.logCodeBlocks(codeBlockConsole);
        gifEncoder.start();
    }else if(message.action=="addComment"){
        gifEncoder.addComment(message.data.text)
    }else if(message.action=="addFrame"){
        let imgData = message.data.imgData;
        let delay = message.data.delay;
        var startTime = Date.now();
        gifEncoder.setColorTable(colorQuantizer.quantize(imgData,"octree"));
        performanceConsole.log("Built color table: "+(Date.now()-startTime)+"ms");
        gifEncoder.addFrame(imgData,delay);
        postMessage({action:"addedFrame"});
    }else if(message.action=="finish"){
        gifEncoder.finish();
        postMessage({action:"finished",data:{url:gifEncoder.toURL()}});
    }
};