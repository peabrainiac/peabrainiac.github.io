/**
 * Note: While I did write this code completely myself, it's in large part inspired by https://github.com/antimatter15/jsgif.
 * If you are searching for a proper gif creation library, you should probably use that one - I only wrote this one myself as a way to learn about how gif creation works.
 * 
 * Also, is it pronounced gif or Gif?
 */
const GifEncoder = function(){
    var exports = {};

    var file;

    var started = false;
    var firstFrame = true;
    var finished = false;

    var width;
    var height;
    var sizeSet = false;

    var tableSize = 7;
    var colorTable = new Uint8Array(256*3);
    for (let i=0;i<256;i++){
        colorTable[i*3] = i;
        colorTable[i*3+1] = i;
        colorTable[i*3+2] = i;
    }

    var performanceConsole;
    var codeBlockConsole;

    exports.logPerformance = function(consoleObject){
        performanceConsole = consoleObject;
    };

    exports.logCodeBlocks = function(consoleObject){
        codeBlockConsole = consoleObject;
    };

    exports.start = function(){
        file = new BinaryFile();
        writeHeader();
        started = true;
        firstFrame = true;
        finished = false;
    };

    exports.addFrame = function(imgData,delay=5){
        if (!started){
            throw new Error("Invalid state: Encoding hasn't started yet!");
        }else if(!(imgData instanceof ImageData)){
            throw new Error("Invalid argument: \"imgData\" must be an ImageData!");
        }else if(sizeSet&&(width!=imgData.width||height!=imgData.height)){
            throw new Error("Invalid argument: ImageData dimensions differ from specified gif dimensions!");
        }else{
            if (!sizeSet){
                width = imgData.width;
                height = imgData.height;
                sizeSet = true;
            }
            var time = Date.now();
            var rgbArray = toRgbArray(imgData);
            var indexArray = new Uint8Array(rgbArray.length/3);
            for (let l=indexArray.length,i=0;i<l;i++){
                indexArray[i] = getColorIndex(rgbArray[i*3],rgbArray[i*3+1],rgbArray[i*3+2]);
            }
            logPerformance("Created index array: "+(Date.now()-time)+"ms");
            time = Date.now();
            if (firstFrame){
                writeLogicalScreenDescriptor(width,height,true,tableSize);
                writeColorTable(colorTable);
                writeNetscapeExtension();
            }
            writeGraphicsControlExtension(delay);
            if (firstFrame){
                writeImageDescriptor(width,height);
            }else{
                writeImageDescriptor(width,height,tableSize);
                writeColorTable(colorTable);
            }
            logPerformance("Wrote color table: "+(Date.now()-time)+"ms");
            time = Date.now();
            writePixelData(width,height,indexArray,tableSize+1);
            logPerformance("Wrote pixel data: "+(Date.now()-time)+"ms");
            firstFrame = false;
        }
    };

    exports.setColorTable = function(table){
        if (!(table instanceof Uint8Array)){
            throw new Error("Invalid argument: \"table\" must be an Uint8Array!");
        }else if(table.length!=256*3){
            throw new Error("Invalid argument: \"table\" must have a length of 256*3!");
        }else{
            colorTable = table;
        }
    };

    exports.finish = function(){
        if (started){
            writeTrailer();
            started = false;
            finished = true;
        }else{
            throw new Error("Invalid State: Encoding hasn't started yet!");
        }
    };

    exports.download = function(name){
        if (finished){
            file.download(name);
        }else{
            throw new Error("Invalid State: Encoding isn't finished yet!");
        }
    };

    exports.toURL = function(){
        if (finished){
            return file.toURL();
        }else{
            throw new Error("Invalid State: Encoding isn't finished yet!");
        }
    }

    function getColorIndex(r,g,b){
        var index = 0;
        var delta = 256*256*3;
        let dr,dg,db,d;
        for (let l=colorTable.length/3,i=0;i<l;i++){
            dr = colorTable[i*3]-r;
            dg = colorTable[i*3+1]-g;
            db = colorTable[i*3+2]-b;
            d = dr*dr+dg*dg+db*db;
            if (d<delta){
                delta = d;
                index = i;
            }
        }
        return index;
    }

    function toRgbArray(img){
        if (!(img instanceof ImageData)){
            throw new Error("Invalid argument: \"img\" is not an ImageData!");
        }else{
            var result = new Uint8Array(img.data.length*0.75);
            for (let l=img.data.length/4, i=0;i<l;i++){
                result[i*3] = img.data[i*4];
                result[i*3+1] = img.data[i*4+1];
                result[i*3+2] = img.data[i*4+2];
            }
            return result;
        }
    }
    function writeInt(value){
        file.writeByte(value&0xff);
        file.writeByte((value>>8)&0xff)
    }

    function logPerformance(string){
        if (performanceConsole){
            performanceConsole.log(string);
        }
    }

    function logBlock(name){
        if (codeBlockConsole){
            codeBlockConsole.log("%c\t"+name+":%c\n\t\t"+file.lastAddedToHexString(),"background:#e0e0e0","background:#ffdfa0");
        }
    }

    function writeHeader(){
        file.writeChars("GIF89a");
        logBlock("Header");
    }
    function writeLogicalScreenDescriptor(width,height,useGlobalColorTable=true,gctSize=7){
        writeInt(width);
        writeInt(height);
        file.writeByte((0xf0*(useGlobalColorTable&1))|0x70|(gctSize&7));
        file.writeByte(0);
        file.writeByte(0);
        logBlock("Logical Screen Depictor");
    }
    function writeColorTable(table,tableSize=-1){
        file.writeBytes(table);
        if (tableSize!=-1){
            for (let i=3*256-table.length;i>0;i--){
                file.writeByte(0);
            }
        }
        logBlock("Color Table");
    }
    function writeNetscapeExtension(repeats=0){
        file.writeByte(0x21);
        file.writeByte(0xff);
        file.writeByte(11);
        file.writeChars("NETSCAPE2.0");
        file.writeByte(3);
        file.writeByte(1);
        writeInt(repeats);
        file.writeByte(0);
        logBlock("Netscape Extension");
    }
    function writeGraphicsControlExtension(delay){
        file.writeByte(0x21);
        file.writeByte(0xf9);
        file.writeByte(4);
        file.writeByte(8);
        writeInt(delay);
        file.writeByte(0);
        file.writeByte(0);
        logBlock("Graphics Control Extension");
    }
    function writeImageDescriptor(width,height,tableSize=-1){
        file.writeByte(0x2c);
        writeInt(0);
        writeInt(0);
        writeInt(width);
        writeInt(height);
        if (tableSize<0){
            file.writeByte(0);
        }else{
            file.writeByte(0x80|(tableSize&7));
        }
        logBlock("Image Descriptor");
    }
    function writePixelData(width,height,indexArray,minCodeSize){
        const MIN_CODE_SIZE = Math.max(2,Math.min(12,minCodeSize))
        const COLOR_CODES = 1<<MIN_CODE_SIZE;
        const CODE_CLEAR = COLOR_CODES;
        const CODE_EOI = COLOR_CODES+1;

        var codeSize = MIN_CODE_SIZE;
        var codeSizeBuffer = codeSize+1;
        
        // vars for writing codes to file
        file.writeByte(MIN_CODE_SIZE);
        var codesChunk = new Uint8Array(255);
        var nextByte = 0;
        var nextBits = 0;
        var nextBitsCount = 0;
        var code, codeSize;

        var codeTable = {
            table:[],
            add:function(entry){
                this.table.push(entry);
                //console.log("added code entry #"+(this.table.length-1));
                if (this.table.length==1<<codeSize){
                    codeSize++;
                    //console.log("increased codesize to "+codeSize);
                    if (codeSize>12){
                        this.reset();
                    }
                }
            },
            reset:function(){
                codeSize = MIN_CODE_SIZE;
                codeTable.table = [];
                for (let l=COLOR_CODES+2,i=0;i<l;i++){
                    codeTable.add([i]);
                }
                addCode(CODE_CLEAR,codeSize);
                //console.log("size in codestream: "+codeStream.codeSize[codeStream.codeSize.length-1]);
                //console.log("codeSizeBuffer: "+codeSizeBuffer);
                //console.log("codeSize: "+codeSize);
            }
        };
        codeTable.reset();
        var pixelIndex = 0;
        var longestMatch, longestMatchLength, i, l, code, isMatch, i2;
        while (pixelIndex<indexArray.length){
            longestMatch = -1;
            longestMatchLength = 0;
            for (i=0,l=codeTable.table.length;i<l;i++){
                if (codeTable.table[i].length>longestMatchLength&&!(pixelIndex+codeTable.table[i].length>indexArray.length)){
                    code = codeTable.table[i];
                    isMatch = true;
                    for (i2=0;i2<code.length;i2++){
                        if (code[i2]!=indexArray[pixelIndex+i2]){
                            isMatch = false;
                            break;
                        }
                    }
                    if (isMatch){
                        longestMatch = i;
                        longestMatchLength = code.length;
                    }
                }
            }
            addCode(longestMatch,codeSize);
            codeTable.add(indexArray.slice(pixelIndex,pixelIndex+longestMatchLength+1));
            pixelIndex += longestMatchLength;
        }
        addCode(CODE_EOI,codeSize);

        function addCode(code,codeSize){
            nextBits |= (code&((1<<codeSizeBuffer)-1))<<nextBitsCount;
            nextBitsCount += codeSizeBuffer;
            codeSizeBuffer = codeSize;
            while (nextBitsCount>=8){
                codesChunk[nextByte++] = nextBits&0xff;
                nextBits >>= 8;
                nextBitsCount -= 8;
                if (nextByte==codesChunk.length){
                    file.writeByte(nextByte);
                    for (let b=0;b<nextByte;b++){
                        file.writeByte(codesChunk[b]);
                    }
                    nextByte = 0;
                }
            }
        }
        codesChunk[nextByte++] = nextBits&0xff;
        file.writeByte(nextByte);
        for (let b=0;b<nextByte;b++){
            file.writeByte(codesChunk[b]);
        }
        file.writeByte(0);
        logBlock("Image Data");
    }
    function writeTrailer(){
        file.writeByte(0x3b);
        logBlock("Trailer");
    }

    return exports;
};