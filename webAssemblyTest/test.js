console.log("Loaded Script!");
WebAssembly.instantiateStreaming(fetch("./test.wasm")).then(function(result){
    console.log("result:",result)
    console.log("3+5: "+result.instance.exports.addTwo(3,5));
});