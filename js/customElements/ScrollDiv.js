export default class ScrollDiv extends HTMLElement {
    constructor(){
        super();
        var shadowRoot = this.attachShadow({mode:"open"});
        shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: relative;
                    padding: 0 !important;
                    --padding: 0;
                    --inner-width: auto;
                    --inner-height: auto;
                    overflow: hidden;
                    display: inline-block;
                    width: auto;
                    height: auto;
                }
                #outer-container {
                    overflow: auto;
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                    width: 100%;
                    height: 100%;
                }
                #outer-container::-webkit-scrollbar {
                    display: none;
                }
                #inner-container {
                    box-sizing: border-box;
                    padding: var(--padding);
                    display: inline-block;
                    width: var(--inner-width);
                    height: var(--inner-height);
                    min-width: 100%;
                    min-height: 100%;
                    position: relative;
                }
                #scrollbar {
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    margin: 10px 5px 20px 0;
                    background: #101010;
                    opacity: 1;
                }
                #scrollbar, #scrollbar-handle {
                    width: 5px;
                    border-radius: 3px;
                    transition: all 0.25s ease-out;
                }
                #scrollbar-handle {
                    position: absolute;
                    background: #303030;
                }
                #scrollbar.hidden {
                    opacity: 0;
                }
            </style>
            <div id="outer-container">
                <div id="inner-container">
                    <slot></slot>
                </div>
            </div>
            <div id="scrollbar" class="hidden">
                <div id="scrollbar-handle"></div>
            </div>
        `;
        var container = shadowRoot.getElementById("outer-container");
        var scrollbar = shadowRoot.getElementById("scrollbar");
        var handle = shadowRoot.getElementById("scrollbar-handle");

        function update(){
            var contentHeight = container.scrollHeight;
            var height = container.offsetHeight;
            scrollbar.classList.toggle("hidden",contentHeight<=height+1);
		    handle.style.top = container.scrollTop*scrollbar.offsetHeight/contentHeight+"px";
            handle.style.bottom = (contentHeight-height-container.scrollTop)*scrollbar.offsetHeight/contentHeight+"px";
        }

        container.addEventListener("scroll",update);
        (new ResizeObserver(update)).observe(container);
    }
};
window.customElements.define("scroll-div",ScrollDiv);