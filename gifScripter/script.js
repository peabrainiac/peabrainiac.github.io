Utils.onPageLoad(function(){
    var input = document.getElementById("textarea");
    var button = document.getElementById("run-button");
    Utils.enableSmartTab(input);

    var popup;
    var frames;
    var encoder = new Encoder();
    var startTime;

    var sandbox = new GifScripterSandbox();
    sandbox.onAddingFrame(function(imageData){
        console.log("Adding Frame:",imageData);
        if (popup.wasCancelled()){
            throw new Error("Gif creation cancelled!");
        }
        popup.showFrame(imageData);
        popup.showProgress1(++frames);
        return encoder.addFrame(imageData);
    });
    sandbox.onFinish(function(){
        encoder.finish().then(function(result){
            console.log("Finished in "+(Date.now()-startTime)+"ms!");
            popup.finish(result.url);
            console.log("Result: ",result.url);
        });
    });

    button.addEventListener("click",function(){
        popup = new ProgressPopup();

        startTime = Date.now();
        frames = 0;

        try {
            encoder.start();
            encoder.onProgress(function(progress){
                popup.showProgress2(progress);
            });
    
            sandbox.eval(input.value);
        }catch(e){
            popup.showError(e);
        }
    });
});