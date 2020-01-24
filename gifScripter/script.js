Utils.onPageLoad(function(){
    var editor = document.getElementById("textarea");
    var formatSelect = document.getElementById("output-format-select");
    var runButton = document.getElementById("run-button");
    var loadFileButton = document.getElementById("load-file-button");
    var loadFileInput = document.getElementById("load-file-input");

    loadFileButton.addEventListener("click",function(){
        loadFileInput.click();
    });
    loadFileInput.addEventListener("change",function(){
        let file = loadFileInput.files[0];
        let fileReader = new FileReader();
        fileReader.onload = function(evt){
            editor.value = fileReader.result;
        };
        fileReader.readAsText(file);
    });

    var popup;
    var frames;
    var outputType;
    var videoEncoder = new VideoEncoder();
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
            return videoEncoder.addFrame(imageData,delay);
        }else{
            return Promise.resolve();
        }
    });
    sandbox.onFinish(function(){
        console.log("Finished in "+(Date.now()-startTime)+"ms!");
        if (outputType=="gif"||outputType=="webm"){
            encoder = (outputType=="gif"?gifEncoder:videoEncoder);
            encoder.finish().then(function(result){
                popup.finish(result.url,outputType);
                console.log("Result: ",result.url);
            });
        }else{
            popup.finish();
        }
    });

    runButton.addEventListener("click",function(){
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
                videoEncoder.start();
            }
    
            sandbox.eval(editor.value);
        }catch(e){
            popup.showError(e);
        }
    });
});