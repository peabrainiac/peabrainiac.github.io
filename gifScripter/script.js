Utils.onPageLoad(function(){
    var input = document.getElementById("textarea");
    var button = document.getElementById("run-button");
    Utils.enableSmartTab(input);

    var popup;
    var progressCanvas;
    var quantizer;
    var gifEncoder;
    var startTime;

    var sandbox = new GifScripterSandbox();
    sandbox.onAddingFrame(function(imageData){
        console.log("Adding Frame:",imageData);
        progressCanvas.width = imageData.width;
        progressCanvas.height = imageData.height;
        progressCanvas.getContext("2d").putImageData(imageData,0,0);
        gifEncoder.setColorTable(quantizer.quantize(imageData,"octree"));
        gifEncoder.addFrame(imageData);
    });
    sandbox.onFinish(function(){
        console.log("Finished in "+(Date.now()-startTime)+"ms!"); // originally 25 seconds for me with the default script, now just 15! Still working on it...
        gifEncoder.finish();
        var imageElement = document.createElement("img");
        imageElement.src = gifEncoder.toURL();
        popup.clear();
        popup.addImageOrCanvas(imageElement);
        popup.addCloseButton();
        console.log("Result: ",gifEncoder.toURL());
    });

    button.addEventListener("click",function(){
        popup = new Popup(document.getElementById("popup-overlay"),"Writing Gif...");
        progressCanvas = document.createElement("canvas");
        popup.addCanvas(progressCanvas);

        startTime = Date.now();

        quantizer = new ColorQuantizer()
        gifEncoder = new GifEncoder();
        gifEncoder.start();

        sandbox.eval(input.value);
    });
});