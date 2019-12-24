export default class CodeEditor extends HTMLElement {
    constructor(){
        super();
        console.log("Creating CodeEditor!");
        let shadowRoot = this.attachShadow({mode:"open"});
        shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    overflow: hidden;
                    padding: 0 !important;
                    --padding: 5px;
                    --scrollbar-width: 5px;
                }
                #scroll-container {
                    --padding: inherit;
                    --scrollbar-width: inherit;
                    vertical-align: top;
                    width: 100%;
                    height: 100%;
                }
                #container {
                    position: relative;
                }
                #container, #code {
                    display: inline-block;
                    width: auto;
                    height: auto;
                    min-width: 100%;
                    min-height: 100%;
                }
                #textarea, #code {
                    font-family: monospace;
                    white-space: pre;
                    font-size: 1em;
                    overflow: visible;
                }
                #textarea {
                    overflow: hidden;
                    color: transparent;
                    caret-color: #dfdfdf;
                    background: transparent;
                    resize: none;
                    box-sizing: border-box;
                    width: 100%;
                    height: 100%;
                    padding: var(--padding);
                    margin: 0;
                    border: none;
                    position: absolute;
                    left: 0;
                    top: 0;
                }
                #textarea:focus {
                    outline: none;
                }
                #textarea::selection {
                    background-color: #ffaf0040;
                }
            </style>
            <scroll-div id="scroll-container">
                <span id="code"></span>
                <textarea id="textarea" spellcheck="false"></textarea>
            </scroll-div>
        `;
        var textarea = shadowRoot.getElementById("textarea");
        
        var onInnerHTMLChange = (()=>{
            let textContent = this.textContent.replace(/\r\n|\n\r|\r/g,"\n");
            this.shadowRoot.getElementById("textarea").value = textContent;
            this.updateCode();
        });
        onInnerHTMLChange();
        (new MutationObserver(onInnerHTMLChange)).observe(this,{characterData:true,childList:true,subtree:true});
        textarea.addEventListener("input",()=>{this.updateCode()});

        textarea.addEventListener("keydown",(e)=>{
            if (e.key=="Tab"||e.key=="Enter"){
                e.preventDefault();
                var start = textarea.selectionStart;
                var end = textarea.selectionEnd;
                var value = textarea.value;
                var before = value.substring(0,start);
                var selection = value.substring(start,end)
                var after = value.substring(end);
                if (e.key=="Tab"){
                    if(selection.indexOf("\n")==-1){
                        textarea.value = before+"\t"+after;
                        textarea.selectionStart = start+1;
                        textarea.selectionEnd = textarea.selectionStart;
                    }else{
                        selection = (e.shiftKey?selection.replace(/\n\t/g,"\n"):selection.replace(/\n/g,"\n\t"))
                        textarea.value = before+selection+after;
                        textarea.selectionStart = start;
                        textarea.selectionEnd = start+selection.length;
                    }
                }else if (e.key=="Enter"){
                    let lineStarts = before.match(/\n\t*/g);
                    let nextLineStart = lineStarts[lineStarts.length-1]+(before.endsWith("{")?"\t":"");
                    textarea.value = before+nextLineStart+after;
                    textarea.selectionStart = before.length+nextLineStart.length;
                    textarea.selectionEnd = textarea.selectionStart;
                }
                this.updateCode();
            }
        });
    }
    get value(){
        return this.shadowRoot.getElementById("textarea").value;
    }
    set value(value){
        this.shadowRoot.getElementById("textarea").value = value;
        this.updateCode();
    }
    
    injectCSS(css){
        let style = document.createElement("style");
        style.innerHTML = css;
        this.shadowRoot.insertBefore(style,this.shadowRoot.getElementById("scroll-container"))
        return style;
    }

    updateCode(){
        let code = this.shadowRoot.getElementById("textarea").value;
        let tokens = this.extractTokens(code);
        code = this.processTokens(tokens);
        this.shadowRoot.getElementById("code").innerHTML = code+`<span style="color:transparent">i</span>`;
    };

    extractTokens(code){
        return [{token:code,type:""}];
    }
    
    processTokens(tokens){
        let code = "";
        for (let i=0;i<tokens.length;i++){
            let token = tokens[i].token;
            token = token.replace(/>/g,"&gt").replace(/</g,"&lt");
            if (tokens[i].type){
                token = `<span class="${tokens[i].type}">${token}</span>`;
            }
            code += token;
        }
        return code;
    }
}
window.customElements.define("code-editor",CodeEditor);