class Mp4Encoder {

    start(){
        this.canvas = document.createElement("canvas");
        this.canvasContext = this.canvas.getContext("2d");
        this.canvasCaptureStream = this.canvas.captureStream(0);
        this.canvasCaptureStreamRecorder = new MediaRecorder(this.canvasCaptureStream,{mimeType:"video/webm"});
        this.canvasCaptureStreamRecorder.start();
        this.canvasCaptureStreamRecorder.pause();
        this.firstFrame = true;
    }

    addFrame(imageDataOrCanvas,delay=5){
        return new Promise((resolve,reject)=>{
            if (this.firstFrame){
                this.canvas.width = imageDataOrCanvas.width;
                this.canvas.height = imageDataOrCanvas.height;
                this.firstFrame = false;
            }
            if (imageDataOrCanvas instanceof ImageData){
                this.canvasContext.putImageData(imageDataOrCanvas,0,0);
            }else{
                this.canvasContext.drawImage(imageDataOrCanvas,0,0);
            }
            this.canvasCaptureStreamRecorder.resume();
            setTimeout(()=>{
                if (this.canvasCaptureStream.requestFrame){
                    this.canvasCaptureStream.requestFrame();
                }else{
                    this.canvasCaptureStream.getVideoTracks()[0].requestFrame();
                }
                this.canvasCaptureStreamRecorder.pause();
                resolve();
            },delay*10);
        });
    }

    finish(){
        return new Promise((resolve,reject)=>{
            this.canvasCaptureStreamRecorder.ondataavailable = function(e){
                resolve({url:URL.createObjectURL(e.data)});
            };
            this.canvasCaptureStreamRecorder.stop();
        });
    }

}