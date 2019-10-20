const GifEncoder = function(){
    var exports = {};

    var file;

    exports.start = function(){
        file = new BinaryFile();
        file.writeChars("Started encoding!\n");
    };

    exports.addFrame = function(imgData){
        file.writeChars("Added frame: "+imgData.width+"x"+imgData.height+"\n");
    };

    exports.finish = function(imgData){
        file.writeChars("Finished encoding!");
    };

    exports.download = function(name){
        file.download(name);
    };

    return exports;
};