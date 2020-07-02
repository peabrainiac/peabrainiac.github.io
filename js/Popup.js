import Utils from "./Utils.js";

export default class Popup {
    constructor(parentElement,titleText,width="auto",height="auto"){
        this._overlay = Utils.addNewElement(parentElement,"div","popup-background-overlay")
        this._box = Utils.addNewElement(this._overlay,"div","transform-centered box","width:"+((width=="auto")?"auto":width+"px")+";height:"+((height=="auto")?"auto":height+"px"));
        this._head = Utils.addNewElement(this._box,"div","box-head");
        this._body = Utils.addNewElement(this._box,"div","box-body");
    
        this._title = document.createTextNode(titleText);
        this._head.appendChild(this._title);
    }
    
    setType(type){
        this._box.classList.add("box-"+type);
    }
    
    close(){
        this._overlay.remove();
    }

    addText(text){
        var textNode = document.createTextNode(text);
        this._body.appendChild(textNode);
        var br = document.createElement("br");
        this._body.appendChild(br);
        return textNode;
    }

    addElement(element){
        this._body.appendChild(element);
    }

    setTitle(text){
        this._title.nodeValue = text;
    }

    addButton(text,callback){
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
        this._body.appendChild(line);
        button.addEventListener("click",callback);
    }

    addCloseButton(){
    	this.addButton("Close",()=>{
            this.close();
        });
    }

    addCanvas(canvas){
    	var container = document.createElement("div");
    	container.style.margin = "20px";
    	container.style.textAlign = "center";
    	canvas.style.boxShadow = "2px 2px 8px #000000";
    	container.appendChild(canvas);
    	this._body.appendChild(container);
    }

    addImageOrCanvas(element){
    	var container = document.createElement("div");
    	container.style.margin = "20px";
    	container.style.textAlign = "center";
    	element.style.boxShadow = "2px 2px 8px #000000";
    	container.appendChild(element);
    	this._body.appendChild(container);
    }

    clear(){
        while(this._body.firstChild){
            this._body.firstChild.remove();
        }
    }

    resize(width=Math.max(this._head.offsetWidth,this._body.offsetWidth),height=this._head.offsetHeight+this._body.offsetHeight){
        this._box.style.width = width+"px";
        this._box.style.height = height+"px";
    }
}