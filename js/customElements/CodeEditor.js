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
                #code {
                    font-family: monospace;
                    white-space: pre-wrap;
                }
            </style>
            <div id="code" contenteditable="true">
            </div>
        `;
        var onInnerHTMLChange = (()=>{
            let textContent = this.textContent.replace(/\r\n|\n\r|\r/g,"\n");
            console.log("Mutation observed! TextContent:",textContent);
            this.shadowRoot.getElementById("code").textContent = textContent;
        });
        onInnerHTMLChange();
        (new MutationObserver(onInnerHTMLChange)).observe(this,{characterData:true,childList:true,subtree:true});
    }
}
window.customElements.define("code-editor",CodeEditor);