const BinaryFile = function(chunkSize){
    var exports = {};

    const BYTES_PER_CHUNK = chunkSize>0?chunkSize:1024;
    var filledChunks = [];
    var currentChunk = new Uint8Array(BYTES_PER_CHUNK);
    var nextByte = 0;
    var lastReadChanges = 0;

    exports.writeByte = function(byte){
        if (nextByte>=currentChunk.length){
            filledChunks.push(currentChunk);
            currentChunk = new Uint8Array(BYTES_PER_CHUNK);
            nextByte = 0;
        }
        currentChunk[nextByte++] = byte;
    };
    exports.writeBytes = function(bytes){
        if (nextByte+bytes.length>currentChunk.length){
            currentChunk.set(bytes.subarray(0,currentChunk.length-nextByte),nextByte);
            filledChunks.push(currentChunk);
            filledChunks.push(bytes.slice(currentChunk.length-nextByte));
            currentChunk = new Uint8Array(BYTES_PER_CHUNK);
            nextByte = 0;
        }else{
            currentChunk.set(bytes,nextByte);
            nextByte += bytes.length;
        }
    };
    exports.writeChars = function(string){
        for (let l=string.length,i=0;i<l;i++){
            exports.writeByte(string.charCodeAt(i))
        }
    };
    exports.getSize = function(){
        var length = nextByte;
        for (let l=filledChunks.length,i=0;i<l;i++){
            length += filledChunks[i].length;
        }
        return length;
    };
    exports.compactify = function(){
        if (filledChunks.length>0||nextByte<currentChunk.length){
            filledChunks.push(currentChunk.slice(0,nextByte));
            nextByte = 0;
            currentChunk = new Uint8Array(exports.getSize());
            for (let l=filledChunks.length,i=0;i<l;i++){
                currentChunk.set(filledChunks[i],nextByte);
                nextByte += filledChunks[i].length;
            }
            filledChunks = [];
        }
    };
    exports.getByteArray = function(){
        exports.compactify();
        return currentChunk;
    };
    exports.toURL = function(){
        return URL.createObjectURL(new Blob([exports.getByteArray()]))
    };
    exports.download = function(name=""){
        var temp = document.createElement("a");
        temp.href = exports.toURL();
        temp.download = name;
        temp.style.display = "none";
        document.body.appendChild(temp);
        temp.click();
        document.body.removeChild(temp);
    };
    exports.toHexString = function(start=0){
        var byteArray = exports.getByteArray();
        var charCodes = new Uint8Array(2*(byteArray.length-start));
        var numberOffset = "0".charCodeAt(0);
        var letterOffset = "a".charCodeAt(0)-10;
        var c = 0;
        var n;
        for (let l=byteArray.length,i=start;i<l;i++){
            n = byteArray[i]>>>4;
            charCodes[c++] = n+(n<10?numberOffset:letterOffset);
            n = byteArray[i]&0xF;
            charCodes[c++] = n+(n<10?numberOffset:letterOffset);
        }
        return String.fromCharCode.apply(String,charCodes);
    };
    exports.lastAddedToHexString = function(){
        var string = exports.toHexString(lastReadChanges);
        lastReadChanges = nextByte;
        return string;
    };

    return exports;
};