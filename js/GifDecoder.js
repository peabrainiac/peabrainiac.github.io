class GifDecoder {
    constructor(){

    }

    decode(arrayOrArrayBuffer){
        var byteArray;
        if (arrayOrArrayBuffer instanceof ArrayBuffer){
            byteArray = new Uint8Array(arrayOrArrayBuffer);
        }else if(arrayOrArrayBuffer instanceof Uint8Array){
            byteArray = arrayOrArrayBuffer;
        }else{
            throw new Error("Invalid argument: \"data\" must be an ArrayBuffer or Uint8Array!");
        }
        var data = new GifData();
        if (String.fromCharCode(...byteArray.subarray(0,6))!="GIF89a"){
            throw new Error("Error: invalid gif data! Start sequence: "+String.fromCharCode(...byteArray.subarray(0,6))+"...");
        }
        data.addBlock({type:"Header",byteArray:byteArray.slice(0,6)});
        let logicalScreenDescriptor = new LogicalScreenDescriptorBlock(byteArray.slice(6,13));
        data.addBlock(logicalScreenDescriptor);
        var i = 13;
        if (logicalScreenDescriptor.data.globalColorTableFlag){
            let colorTableLength = 3*(2<<logicalScreenDescriptor.data.globalColorTableSize);
            data.addBlock(new ColorTableBlock(byteArray.slice(i,i+colorTableLength)));
            i += colorTableLength;
        }
        while(i<byteArray.length){
            if (byteArray[i]==0x21){
                let length = 2;
                while(byteArray[i+length]!=0){
                    length += byteArray[i+length]+1;
                }
                length += 1;
                let blockByteArray = byteArray.slice(i,i+length);
                if (byteArray[i+1]==0xfe){
                    data.addBlock(new CommentBlock(blockByteArray));
                }else{
                    data.addBlock(new UnknownExtensionBlock(blockByteArray))
                }
                i += length;
            }else if(byteArray[i]==0x2c){
                let imageDescriptor = new ImageDescriptorBlock(byteArray.slice(i,i+10));
                data.addBlock(imageDescriptor);
                i += 10;
                if (imageDescriptor.data.localColorTableFlag){
                    let colorTableLength = 3*(2<<imageDescriptor.data.localColorTableSize);
                    data.addBlock(new ColorTableBlock(byteArray.slice(i,i+colorTableLength)));
                    i += colorTableLength;
                }
                let length = 1;
                while(byteArray[i+length]!=0){
                    length += byteArray[i+length]+1;
                }
                length += 1;
                data.addBlock(new ImageDataBlock(byteArray.slice(i,i+length)));
                i += length;
            }else if(byteArray[i]==0x3b){
                data.addBlock(new GifDataBlock(byteArray.slice(i,i+1),"Trailer"));
                break;
            }else{
                data.addBlock(new GifDataBlock(byteArray.slice(i),"Unknown"));
                console.log("Unknown block! Stopped decoding");
                break;
            }
        }
        return data;
    }
}

class GifData {
    constructor(blocks=[]){
        this._blocks = blocks;
    }

    addBlock(block){
        this._blocks.push(block);
    }

    getComments(){
        let comments = [];
        for (let i=0;i<this._blocks.length;i++){
            if (this._blocks[i].type=="Comment Extension"){
                comments.push(this._blocks[i].data);
            }
        }
        return comments;
    }
}

class GifDataBlock {
    constructor(byteArray,type){
        this.type = type;
        this.byteArray = byteArray;
    }
}

class LogicalScreenDescriptorBlock extends GifDataBlock {
    constructor(byteArray){
        super(byteArray,"Logical Screen Descriptor");
        this.data = {};
        this.data.width = byteArray[0]+256*byteArray[1];
        this.data.height = byteArray[2]+256*byteArray[3];
        this.data.globalColorTableFlag = byteArray[4]>>>7;
        this.data.colorResolution = (byteArray[4]>>>4)&7;
        this.data.sortFlag = (byteArray[4]>>>3)&1;
        this.data.globalColorTableSize = byteArray[4]&7;
        this.data.backgroundColorIndex = byteArray[5];
        this.data.pixelAspectRatio = byteArray[6];
    }
}

class ColorTableBlock extends GifDataBlock {
    constructor(byteArray){
        super(byteArray,"Color Table");
    }
}

class ImageDescriptorBlock extends GifDataBlock {
    constructor(byteArray){
        super(byteArray,"Image Descriptor");
        this.data = {};
        this.data.imageLeftPosition = byteArray[1]+256*byteArray[2];
        this.data.imageTopPosition = byteArray[3]+256*byteArray[4];
        this.data.imageWidth = byteArray[5]+256*byteArray[6];
        this.data.imageHeight = byteArray[7]+256*byteArray[8];
        this.data.localColorTableFlag = byteArray[9]>>7;
        this.data.interlaceFlag = (byteArray[9]>>6)&1;
        this.data.sortedFlag = (byteArray[9]>>5)&1;
        this.data.localColorTableSize = byteArray[9]&7;
    }
}

class ImageDataBlock extends GifDataBlock {
    constructor(byteArray){
        super(byteArray,"Image Data");
        this.data = {lzwMinCodeSize:byteArray[0]};
        let codeStreamLength = 0;
        for (let i=1;byteArray[i]!=0;i+=byteArray[i]+1){
            codeStreamLength += byteArray[i];
        }
        let codeStream = new Uint8Array(codeStreamLength);
        let codeStreamIndex = 0;
        for (let i=1;byteArray[i]!=0;i+=byteArray[i]+1){
            codeStream.set(byteArray.subarray(i+1,i+byteArray[i]+1),codeStreamIndex);
            codeStreamIndex += byteArray[i];
        }
        this.data.codeStream = codeStream;
    }
}

class CommentBlock extends GifDataBlock {
    constructor(byteArray){
        super(byteArray,"Comment Extension");
        this.data = "";
        for (let i=2;i<byteArray.length;i+=byteArray[i]+1){
            if(byteArray[i]==0){
                break;
            }else{
                this.data += String.fromCharCode(...byteArray.subarray(i+1,i+byteArray[i]+1));
            }
        }
    }
}

class UnknownExtensionBlock extends GifDataBlock {
    constructor(byteArray){
        super(byteArray,"Unknown Extension")
    }
}