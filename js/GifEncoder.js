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
    for (let i=0;i<255;i++){
        colorTable[i*3] = i;
        colorTable[i*3+1] = i;
        colorTable[i*3+2] = i;
    }

    exports.start = function(){
        file = new BinaryFile();
        writeHeader();
        started = true;
        firstFrame = true;
        finished = false;
    };

    exports.addFrame = function(imgData,delay=50){
        if (!started){
            throw new Error("Invalid state: Encoding hasn't started yet!");
        }else if(!(imgData instanceof ImageData)){
            throw new Error("Invalid argument: \"imgData\" is not an ImageData!");
        }else if(sizeSet&&(width!=imgData.width||height!=imgData.height)){
            throw new Error("Invalid argument: ImageData dimensions differ from specified gif dimensions!");
        }else{
            if (!sizeSet){
                width = imgData.width;
                height = imgData.height;
                sizeSet = true;
            }
            var rgbArray = toRgbArray(imgData);
            var indexArray = new Uint8Array(rgbArray.length/3);
            for (let l=indexArray.length,i=0;i<l;i++){
                indexArray[i] = getColorIndex(rgbArray[i*3],rgbArray[i*3+1],rgbArray[i*3+2]);
            }
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
            writePixelData(width,height,indexArray,tableSize+1);
            firstFrame = false;
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

    function logBlock(name){
        console.log("%c\t"+name+":%c\n\t\t"+file.lastAddedToHexString(),"background:#e0e0e0","background:#ffdfa0")
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
        var codeSize = Math.max(2,Math.min(12,minCodeSize));
        var codeSizeBuffer = codeSize+1;
        var colorTableSize = 1<<codeSize;
        var CODE_CLEAR = colorTableSize;
        var CODE_EOI = colorTableSize+1;
        file.writeByte(codeSize);
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
            codeOf:function(indexBuffer){
                var j,c;
                for (let l=this.table.length,i=0;i<l;i++){
                    if (this.table[i].length==indexBuffer.length){
                        c = this.table[i];
                        j = 0;
                        while(c[j]==indexBuffer[j]){
                            if (++j==indexBuffer.length){
                                return i;
                            }
                        }
                    }
                }
                return -1;
            },
            reset:function(){
                codeSize = Math.max(2,Math.min(12,minCodeSize));
                codeTable.table = [];
                for (let l=colorTableSize+2,i=0;i<l;i++){
                    codeTable.add([i]);
                }
                codeStream.add(CODE_CLEAR);
                //console.log("size in codestream: "+codeStream.codeSize[codeStream.codeSize.length-1]);
                //console.log("codeSizeBuffer: "+codeSizeBuffer);
                //console.log("codeSize: "+codeSize);
            }
        };
        var codeStream = {codes:[],codeSize:[],length:0,add:function(code){
            //console.log("wrote code #"+code+" with size "+codeSizeBuffer);
            this.codes.push(code);
            this.codeSize.push(codeSizeBuffer);
            codeSizeBuffer = codeSize;
            this.length++;
        }};
        codeTable.reset();
        var indexBuffer = [indexArray[0]];
        var pixelIndex = 1;
        var k,indexBufferWithoutK;
        while(pixelIndex<indexArray.length){
            k = indexArray[pixelIndex++];
            indexBuffer.push(k);
            var c = codeTable.codeOf(indexBuffer);
            if (c==-1){
                indexBufferWithoutK = indexBuffer.slice(0,indexBuffer.length-1);
                codeStream.add(codeTable.codeOf(indexBufferWithoutK));
                codeTable.add(indexBuffer);
                indexBuffer = [k];
            }
        }
        codeStream.add(codeTable.codeOf(indexBuffer));
        codeStream.add(CODE_EOI);
        var byteStream = [];
        var nextBytes = 0;
        var bitsUsed = 0;
        var code, size;
        for (let l=codeStream.length,i=0;i<l;i++){
            code = codeStream.codes[i];
            size = codeStream.codeSize[i];
            nextBytes |= (code&((1<<size)-1))<<bitsUsed;
            bitsUsed += size;
            while (bitsUsed>=8){
                byteStream.push(nextBytes&0xff);
                nextBytes >>= 8;
                bitsUsed -= 8;
            }
        }
        byteStream.push(nextBytes&0xff);
        for (let l=byteStream.length,i=0;i<l;i++){
            if (i%255==0){
                file.writeByte(Math.min(l-i,255));
            }
            file.writeByte(byteStream[i]);
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