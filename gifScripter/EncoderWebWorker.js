importScripts("../js/BinaryFile.js");
importScripts("../js/GifEncoder.js");
importScripts("../js/ColorQuantizer.js");

var colorQuantizer;
var gifEncoder;

onmessage = function(e){
    var message = e.data;
    if (message.action=="start"){
        colorQuantizer = new ColorQuantizer();
        gifEncoder = new GifEncoder();
        gifEncoder.start();
    }else if(message.action=="addFrame"){
        let imgData = message.data.imgData;
        gifEncoder.setColorTable(colorQuantizer.quantize(imgData,"octree"));
        gifEncoder.addFrame(imgData);
        postMessage({action:"addedFrame"});
    }else if(message.action=="finish"){
        gifEncoder.finish();
        postMessage({action:"finished",data:{url:gifEncoder.toURL()}});
    }
};