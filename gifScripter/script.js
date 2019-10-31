Utils.onPageLoad(function(){
    var input = document.getElementById("textarea");
    var button = document.getElementById("run-button");
    Utils.enableSmartTab(input);

    var popup;
    var quantizer;
    var gifEncoder;
    var startTime;

    var sandbox = new GifScripterSandbox();
    sandbox.onAddingFrame(function(imageData){
        console.log("Adding Frame:",imageData);
        if (popup.wasCancelled()){
            throw new Error("Gif creation cancelled!");
        }
        popup.showFrame(imageData);
        gifEncoder.setColorTable(quantizer.quantize(imageData,"octree"));
        gifEncoder.addFrame(imageData);
    });
    sandbox.onFinish(function(){
        console.log("Finished in "+(Date.now()-startTime)+"ms!");
        gifEncoder.finish();
        popup.finish(gifEncoder.toURL());
        console.log("Result: ",gifEncoder.toURL());
    });

    button.addEventListener("click",function(){
        popup = new ProgressPopup();

        startTime = Date.now();

        quantizer = new ColorQuantizer()
        gifEncoder = new GifEncoder();
        gifEncoder.start();

        sandbox.eval(input.value);
    });
});