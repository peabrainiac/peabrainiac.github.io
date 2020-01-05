Utils.onPageLoad(function(){
    var editor = document.getElementById("textarea");
    var formatSelect = document.getElementById("output-format-select");
    var button = document.getElementById("run-button");

    var popup;
    var frames;
    var outputType;
    var mp4Encoder = new Mp4Encoder();
    var gifEncoder = new Encoder();
    var startTime;

    var sandbox = new GifScripterSandbox();
    editor.globalScope = sandbox.getGlobalScope();
    sandbox.onAddingFrame(async function(imageData,delay){
        console.log("Adding Frame:",imageData);
        if (popup.wasCancelled()){
            throw new Error("Gif creation cancelled!");
        }
        popup.showFrame(imageData);
        popup.showProgress1(++frames);
        if (outputType=="gif"){
            return gifEncoder.addFrame(imageData,delay);
        }else if (outputType=="webm"){
            return mp4Encoder.addFrame(imageData,delay);
        }else{
            return Promise.resolve();
        }
    });
    sandbox.onFinish(function(){
        if (outputType=="gif"){
            gifEncoder.finish().then(function(result){
                console.log("Finished in "+(Date.now()-startTime)+"ms!");
                popup.finish(result.url);
                console.log("Result: ",result.url);
            });
        }else if(outputType=="webm"){
            mp4Encoder.finish().then(function(result){
                console.log("Finished in "+(Date.now()-startTime)+"ms!");
                popup.finish(result.url,"webm");
                console.log("Result: ",result.url);
            });
        }else{
            console.log("Finished in "+(Date.now()-startTime)+"ms!");
            popup.finish();
        }
    });

    button.addEventListener("click",function(){
        popup = new ProgressPopup();

        startTime = Date.now();
        frames = 0;
        outputType = formatSelect.value;

        console.log("output type:",outputType);
        try {
            if (outputType=="gif"){
                console.log("Starting gif encoding!");
                gifEncoder.start();
                gifEncoder.onProgress(function(progress){
                    popup.showProgress2(progress);
                });
            }else if(outputType=="webm"){
                console.log("Starting webm encoding!");
                mp4Encoder.start();
            }
    
            sandbox.eval(editor.value);
        }catch(e){
            popup.showError(e);
        }
    });
});