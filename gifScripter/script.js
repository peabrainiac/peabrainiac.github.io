Utils.onPageLoad(function(){
    var input = document.getElementById("textarea");
    var button = document.getElementById("run-button");
    Utils.enableSmartTab(input);

    var sandbox = new SemiSandbox();
    sandbox.setVariableConstructor("console",function(){
        return {log:function(){
            console.log.apply(console,arguments)
        }
    }});
    sandbox.setVariable("Math",Object.freeze(Math));

    button.addEventListener("click",function(){
        sandbox.eval(input.value);
    });
});