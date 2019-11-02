const ProgressPopup = function(){
    var exports = {};

    var popup = new Popup(document.getElementById("popup-overlay"),"Writing Gif...");
    var progressCanvas = document.createElement("canvas");
    popup.addCanvas(progressCanvas);
    var progressText1 = popup.addText("\n");
    var progressText2 = popup.addText("\n");
    popup.addButton("Cancel",cancel);
    var wasCancelled = false;

    var width, height;

    exports.showFrame = function(imgData){
        width = imgData.width;
        height = imgData.height;
        progressCanvas.width = width;
        progressCanvas.height = height;
        progressCanvas.getContext("2d").putImageData(imgData,0,0);
        upscaleImage(progressCanvas,width,height);
    };

    exports.showProgress1 = function(frames){
        progressText1.nodeValue = "Frames generated: "+frames+"\r\n";
    };

    exports.showProgress2 = function(frames){
        progressText2.nodeValue = "Frames encoded: "+frames+"\r\n";
    };

    exports.finish = function(gifURL){
        var image = document.createElement("img");
        image.src = gifURL;
        upscaleImage(image,width,height);
        popup.clear();
        popup.setTitle("Gif finished");
        popup.addImageOrCanvas(image);
        popup.addCloseButton();
    };

    exports.showError = function(error){
        popup.clear();
        popup.setTitle("Gif Creation failed!");
        var errorCodeContainer = Utils.createElement("pre");
        errorCodeContainer.innerText = Utils.errorToString(error);
        popup.addElement(errorCodeContainer);
        console.log({error});
        popup.addCloseButton();
    };

    exports.wasCancelled = function(){
        return wasCancelled;
    };

    function upscaleImage(image,width,height){
        let scale = Math.ceil(360/Math.max(width,height));
        image.style.width = width*scale+"px";
        image.style.height = height*scale+"px";
        image.style.imageRendering = "crisp-edges";
    }
    function cancel(){
        wasCancelled = true;
        popup.close();
    }
    
    return exports;
};