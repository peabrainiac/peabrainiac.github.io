export default class CodeEditor extends HTMLElement {
    constructor(){
        super();
        console.log("Creating CodeEditor!");
        let shadowRoot = this.attachShadow({mode:"open"});
        shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                #container {
                    position: relative;
                    display: inline-block;
                }
                #code {
                    display: inline-block;
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
                    width: 100%;
                    height: 100%;
                    margin: 0;
                    border: none;
                    padding: 0;
                    position: absolute;
                    left: 0;
                    top: 0;
                    right: 0;
                    bottom: 0;
                }
                #textarea:focus {
                    outline: none;
                }
                #textarea::selection {
                    background-color: #ffaf0040;
                }
                .keyword-var {
                    color: #ffaf00;
                }
                .keyword-control {
                    color: #ff6000;
                }
                .identifier{
                    color: #ffdf80;
                }
                .number {
                    color: #bfff00;
                }
            </style>
            <div id="container">
                <div id="code"></div>
                <textarea id="textarea" spellcheck="false"></textarea>
            </div>
        `;
        var textarea = shadowRoot.getElementById("textarea");

        var onInnerHTMLChange = (()=>{
            let textContent = this.textContent.replace(/\r\n|\n\r|\r/g,"\n");
            console.log("Mutation observed! TextContent:",textContent);
            this.shadowRoot.getElementById("textarea").value = textContent;
            updateCode();
        });
        var updateCode = (()=>{
            let code = this.shadowRoot.getElementById("textarea").value;
            let tokens = extractTokens(code);
            code = processTokens(tokens);
            console.log("Updated code!");
            this.shadowRoot.getElementById("code").innerHTML = code;
        });
        onInnerHTMLChange();
        (new MutationObserver(onInnerHTMLChange)).observe(this,{characterData:true,childList:true,subtree:true});
        textarea.addEventListener("input",updateCode);

		textarea.addEventListener("keydown",function(e){
			if (e.code=="Tab"){
				e.preventDefault();
				var start = textarea.selectionStart;
				var end = textarea.selectionEnd;
				var value = textarea.value;
				var before = value.substring(0,start);
				var selection = value.substring(start,end)
				var after = value.substring(end);
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
                updateCode();
			}
        });

        function extractTokens(code){
            let tokens = [];
            let tokenPatterns = [/^\s+/,/^(?:const|let|var|function)/,/^(?:if|else|for|while|break|continue|return)/,/^[a-zA-Z]\w*/,/^(?:0x[\da-fA-F]+|0b\d+|0o\d+|\d+(?:\.\d*)?|\.\d+)/,/^./];
            let tokenTypes = ["","keyword-var","keyword-control","identifier","number",""];
            while (code.length>0){
                for (let i=0;i<tokenPatterns.length;i++){
                    if (tokenPatterns[i].test(code)){
                        let token = code.match(tokenPatterns[i])[0];
                        tokens.push({token:token,type:tokenTypes[i]});
                        code = code.substring(token.length);
                        break;
                    }
                }
            }
            return tokens;
        }
        function processTokens(tokens){
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
    get value(){
        return this.shadowRoot.getElementById("code").textContent;
    }
}
window.customElements.define("code-editor",CodeEditor);