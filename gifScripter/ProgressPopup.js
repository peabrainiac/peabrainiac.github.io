import Utils from "../js/Utils.js";
import Popup from "../js/Popup.js";

export default class ProgressPopup {
    constructor(){
        this._popup = new Popup(document.getElementById("popup-overlay"),"Writing Gif...");
        this._progressCanvas = document.createElement("canvas");
        this._popup.addCanvas(this._progressCanvas);
        this._progressText1 = this._popup.addText("\n");
        this._progressText2 = this._popup.addText("\n");
        this._wasCancelled = false;
        this._popup.addButton("Cancel",()=>{
            this._wasCancelled = true;
            this._popup.close();
        });
    }

    showFrame(imgData){
        this._width = imgData.width;
        this._height = imgData.height;
        this._progressCanvas.width = this._width;
        this._progressCanvas.height = this._height;
        this._progressCanvas.getContext("2d").putImageData(imgData,0,0);
        this._upscaleImage(this._progressCanvas,this._width,this._height);
    }

    showProgress1(frames){
        this._progressText1.nodeValue = "Frames generated: "+frames+"\r\n";
    }

    showProgress2(frames){
        this._progressText2.nodeValue = "Frames encoded: "+frames+"\r\n";
    }

    finish(url,type="gif"){
        if (url){
            var imageOrVideo;
            if (type=="gif"){
                imageOrVideo = document.createElement("img");
                imageOrVideo.src = url;
            }else if (type=="webm"){
                imageOrVideo = document.createElement("video");
                imageOrVideo.controls = true;
                imageOrVideo.autoplay = true;
                imageOrVideo.loop = true;
                let source = document.createElement("source");
                source.src = url;
                source.type = "video/webm";
                imageOrVideo.appendChild(source);
            }
            this._upscaleImage(imageOrVideo,this._width,this._height);
            this._popup.clear();
            this._popup.setTitle("Gif finished");
            this._popup.addImageOrCanvas(imageOrVideo);
            this._popup.addCloseButton();
        }else{
            this._popup.clear();
            this._popup.addCanvas(progressCanvas);
            this._popup.addCloseButton();
        }
    }

    showError(error){
        this._popup.clear();
        this._popup.setTitle("Gif Creation failed!");
        var errorCodeContainer = Utils.createElement("pre");
        errorCodeContainer.innerText = Utils.errorToString(error);
        this._popup.addElement(errorCodeContainer);
        console.log({error});
        this._popup.addCloseButton();
    }

    get wasCancelled(){
        return this._wasCancelled;
    }

    _upscaleImage(image,width,height){
        let scale = Math.ceil(360/Math.max(width,height));
        image.style.width = width*scale+"px";
        image.style.height = height*scale+"px";
        console.log("Set width to "+width*scale+"px"+" and height to "+height*scale+"px"+"!");
        image.style.imageRendering = "crisp-edges";
        image.style.imageRendering = "pixelated";
    }
}