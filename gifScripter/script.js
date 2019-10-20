Utils.onPageLoad(function(){
    var input = document.getElementById("textarea");
    var button = document.getElementById("run-button");
    Utils.enableSmartTab(input);

    var popup;
    var progressCanvas;
    var gifEncoder;

    var sandbox = new GifScripterSandbox();
    sandbox.onAddingFrame(function(imageData){
        console.log("Adding Frame:",imageData);
        progressCanvas.width = imageData.width;
        progressCanvas.height = imageData.height;
        progressCanvas.getContext("2d").putImageData(imageData,0,0);
        gifEncoder.addFrame(imageData);
    });
    sandbox.onFinish(function(){
        console.log("Finished!");
        popup.addCloseButton();
        gifEncoder.finish();
        gifEncoder.download("Test.txt");
    });

    button.addEventListener("click",function(){
        popup = new Popup(document.getElementById("popup-overlay"),"Writing Gif...");
        progressCanvas = document.createElement("canvas");
        popup.addCanvas(progressCanvas);

        gifEncoder = new GifEncoder();
        gifEncoder.start();

        sandbox.eval(input.value);
    });
});