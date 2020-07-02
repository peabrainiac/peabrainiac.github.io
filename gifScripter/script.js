import Utils from "../js/Utils.js";

import ProgressPopup from "./ProgressPopup.js";

Utils.onPageLoad(function(){
    var editor = document.getElementById("textarea");
    var formatSelect = document.getElementById("output-format-select");
    var runButton = document.getElementById("run-button");
    var saveFileButton = document.getElementById("save-file-button");
    var loadFileButton = document.getElementById("load-file-button");
    var loadFileInput = document.getElementById("load-file-input");

    editor.onsave = function(e){
        e.preventDefault();
        saveFileButton.click();
    };
    saveFileButton.addEventListener("click",function(){
        let url = URL.createObjectURL(new Blob([editor.value],{type:"application/octet-stream"}));
        let a = document.createElement("a");
        a.href = url;
        a.download = "script.js";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    loadFileButton.addEventListener("click",function(){
        loadFileInput.click();
    });
    loadFileInput.addEventListener("change",function(){
        let file = loadFileInput.files[0];
        let fileReader = new FileReader();
        console.log("Loading file...");
        console.log("MIME type:",file.type);
        if (file.type=="image/gif"){
            fileReader.onload = function(evt){
                let decoder = new GifDecoder();
                let data = decoder.decode(fileReader.result);
                console.log("gif data:",data);
                let comments = data.getComments();
                console.log("comments:",comments);
                try {
                    editor.value = JSON.parse(comments[1]).src;
                }catch (e){
                    console.log(e);
                    let popup = new Popup(document.getElementById("popup-overlay"),"Couldn't load script!");
                    popup.addText("The uploaded gif file doesn't seem to contain any script information. Note that only scripts generated using this editor can be used to load the corresponding script again.");
                    popup.addCloseButton();
                }
            };
            fileReader.readAsArrayBuffer(file);
        }else{
            fileReader.onload = function(evt){
                editor.value = fileReader.result;
            };
            fileReader.readAsText(file);
        }
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
        if (popup.wasCancelled){
            throw new Error("Gif creation cancelled!");
        }
        if (frames==0){
            console.log("Starting gif encoding!");
            gifEncoder.start();
            gifEncoder.addComment("Made using peabrainiac.github.com/GifScripter. See the next comment for more specific information about the used script");
            gifEncoder.addComment(JSON.stringify({src:editor.value}));
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
            let encoder = (outputType=="gif"?gifEncoder:videoEncoder);
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
                console.log("Preparing gif encoding... encoding will start once the first frame is added!");
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