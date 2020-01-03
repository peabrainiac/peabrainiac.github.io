const SemiSandbox = (function(){
    var exports = {};

    var envVariables = {};
    var envObjectConstructors = {};

    exports.setVariable = function(name,value){
        envVariables[name] = value;
    };
    exports.setVariableConstructor = function(name,constructor){
        envObjectConstructors[name] = constructor;
    };

    exports.getGlobalScope = function(prototype=Object){
        var object = Object.create(prototype);
        for (name in envVariables){
            object[name] = envVariables[name];
        }
        for (name in envObjectConstructors){
            object[name] = new (envObjectConstructors[name])();
        }
        return object;
    };

    exports.eval = function(code){
        var enviroment = exports.getGlobalScope(null);
        proxy = new Proxy(enviroment,{has:((target,key)=>true)});
        console.log("Sandbox object: ",proxy);
        proxy.code = code;
        proxy.eval = eval;
        with (proxy){
            (function(){
                eval("code = undefined;\neval = undefined;\n"+code);
            })();
        }
    }

    return exports;
});