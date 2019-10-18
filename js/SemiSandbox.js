const SemiSandbox = (function(){
    var exports = {};

    var envVariables = {};
    var envObjectConstructors = {};

    exports.setVariable = function(name,value){
        envVariables[name] = value;
    }
    exports.setVariableConstructor = function(name,constructor){
        envObjectConstructors[name] = constructor;
    }


    exports.eval = function(code){
        var enviroment = Object.create(null);
        for (name in envVariables){
            enviroment[name] = envVariables[name];
        }
        for (name in envObjectConstructors){
            enviroment[name] = new (envObjectConstructors[name])();
        }
        obj = new Proxy(enviroment,{has:((target,key)=>true)});
        console.log("Sandbox object: ",obj);
        eval("with(obj){"+code+"}");
    }

    return exports;
});