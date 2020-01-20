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
            .identifier {
                color: #ffdf80;
            }
            .identifier-const {
                color: #dfdf60;
            }
            .identifier-global {
                color: #ffaf80;
            }
            .number {
                color: #bfff00;
            }
            .string {
                color: #ff9050;
            }
        `);
        console.log("Created JS-CodeEditor!");
    }
    
    extractTokens(code){
        let tokens = [];
        let whiteSpaceRegex = /^\s+/;
        let commentRegex = /^(?:\/\/[^\n]*|\/\*(?:[^\*]*\*[^\/])*[^\*]*(?:\*\/|\*$|$))/;
        let keywordRegex1 = /^(?:const|let|var|function|async)/;
        let keywordRegex2 = /^(?:if|else|for|while|break|continue|return|await)/;
        let identifierRegex = /^[a-zA-Z]\w*/;
        let numberRegex = /^(?:0x[\da-fA-F]+|0b\d+|0o\d+|(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)/;
        let stringRegex = /^(?:\"(?:[^\\\"]*\\.)*[^\\\"]*(?:\"|$))/;
        let tokenPatterns = [whiteSpaceRegex,commentRegex,keywordRegex1,keywordRegex2,identifierRegex,numberRegex,stringRegex,/^./];
        let tokenTypes = ["","comment","keyword-var","keyword-control","identifier","number","string",""];
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
        let constants = [];
        for (let i=0;i<tokens.length;i++){
            if (tokens[i].token=="const"){
                if (i+2<tokens.length&&tokens[i+2].type=="identifier"){
                    constants.push(tokens[i+2].token);
                }
            }else if(tokens[i].type=="identifier"){
                if (constants.includes(tokens[i].token)){
                    tokens[i].type = "identifier-const";
                }else if(this._globalScope&&this._globalScope.hasOwnProperty(tokens[i].token)){
                    tokens[i].type = "identifier-global";
                }
            }
        }
        return tokens;
    }

    set globalScope(globalScope){
        this._globalScope = globalScope;
        this.updateCode();
    }
    get globalScope(){
        return this._globalScope;
    }
}

window.customElements.define("code-editor-js",CodeEditorJS);