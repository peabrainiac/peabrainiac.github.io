import CodeEditor from "/js/customElements/CodeEditor.js";

export default class CodeEditorJS extends CodeEditor {
    constructor(){
        super();
        super.injectCSS(`
            .comment {
                color: #bfaf80;
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
        `);
        console.log("Created JS-CodeEditor!");
    }
    
    extractTokens(code){
        let tokens = [];
        let tokenPatterns = [/^\s+/,/^(?:\/\/[^\n]*|\/\*(?:[^\*]*\*[^\/])*[^\*]*(?:\*\/|\*$|$))/,/^(?:const|let|var|function)/,/^(?:if|else|for|while|break|continue|return)/,/^[a-zA-Z]\w*/,/^(?:0x[\da-fA-F]+|0b\d+|0o\d+|\d+(?:\.\d*)?|\.\d+)/,/^./];
        let tokenTypes = ["","comment","keyword-var","keyword-control","identifier","number",""];
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
}

window.customElements.define("code-editor-js",CodeEditorJS);