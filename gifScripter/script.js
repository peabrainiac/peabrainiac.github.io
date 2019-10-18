Utils.onPageLoad(function(){
    var input = document.getElementById("textarea");
    var button = document.getElementById("run-button");
    Utils.enableSmartTab(input);

    var popup;
    var progressCanvas;

    var sandbox = new GifScripterSandbox();
    sandbox.onAddingFrame(function(imageData){
        console.log("Adding Frame:",imageData);
        progressCanvas.width = imageData.width;
        progressCanvas.height = imageData.height;
        progressCanvas.getContext("2d").putImageData(imageData,0,0);
    });
    sandbox.onFinish(function(){
        console.log("Finished!");
        popup.addCloseButton();
    });

    button.addEventListener("click",function(){
        popup = new Popup(document.getElementById("popup-overlay"),"Writing Gif...");
        progressCanvas = document.createElement("canvas");
        popup.addCanvas(progressCanvas);

        sandbox.eval(input.value);
    });
});