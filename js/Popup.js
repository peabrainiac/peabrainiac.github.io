const Popup = function(parentElement,titleText,width,height){
    var exports = {};
    
    var box = document.createElement("div");
    var head = document.createElement("div");
    var body = document.createElement("div");
    box.className = "centered box";
    box.style.width = width+"px";
    box.style.height = height+"px";
    head.className = "box-head";
    body.className = "box-body";
    box.appendChild(head);
    box.appendChild(body);
    parentElement.appendChild(box);
    
    var title = document.createTextNode(titleText);
    head.appendChild(title);
    
    exports.setType = function(type){
        box.classList.add("box-"+type);
    };
    exports.close = function(){
        box.parentElement.removeChild(box);
    };
    exports.addText = function(text){
        var textNode = document.createTextNode(text);
        body.appendChild(textNode);
    };
    exports.addButton = function(text,callback){
        var line = document.createElement("div");
        line.style.textAlign = "center";
        line.style.margin = "10px";
        var button = document.createElement("div");
        button.className = "button";
        button.style.width = "50%";
        button.style.display = "inline-block";
        var buttonText = document.createTextNode(text);
        button.appendChild(buttonText);
        line.appendChild(button);
        body.appendChild(line);
        button.addEventListener("click",callback);
    };
    exports.resize = function(width=Math.max(head.offsetWidth,body.offsetWidth),height=head.offsetHeight+body.offsetHeight){
        box.style.width = width+"px";
        box.style.height = height+"px";
    };
    
    return exports;
};