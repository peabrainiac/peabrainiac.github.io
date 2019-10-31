const ProgressPopup = function(){
    var exports = {};

    var popup = new Popup(document.getElementById("popup-overlay"),"Writing Gif...");
    var progressCanvas = document.createElement("canvas");
    popup.addCanvas(progressCanvas);
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

    exports.finish = function(gifURL){
        var image = document.createElement("img");
        image.src = gifURL;
        upscaleImage(image,width,height);
        popup.clear();
        popup.addImageOrCanvas(image);
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