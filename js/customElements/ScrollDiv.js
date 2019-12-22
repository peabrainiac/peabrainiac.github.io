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
                #scrollbar-h, #scrollbar-v {
                    background: #101010;
                    opacity: 1;
                }
                #scrollbar-h {
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    margin: 0 20px 5px 10px;
                }
                #scrollbar-v {
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    margin: 10px 5px 20px 0;
                }
                #scrollbar-h, #scrollbar-handle-h {
                    height: 5px;
                }
                #scrollbar-v, #scrollbar-handle-v {
                    width: 5px;
                }
                #scrollbar-h, #scrollbar-v, #scrollbar-handle-h, #crollbar-handle-v {
                    border-radius: 3px;
                    transition: all 0.25s ease-out;
                }
                #scrollbar-handle-h, #scrollbar-handle-v {
                    position: absolute;
                    background: #303030;
                }
                #scrollbar-h.hidden, #scrollbar-v.hidden {
                    opacity: 0;
                }
            </style>
            <div id="outer-container">
                <div id="inner-container">
                    <slot></slot>
                </div>
            </div>
            <div id="scrollbar-h" class="hidden">
                <div id="scrollbar-handle-h"></div>
            </div>
            <div id="scrollbar-v" class="hidden">
                <div id="scrollbar-handle-v"></div>
            </div>
        `;
        var container = shadowRoot.getElementById("outer-container");
        var horizontalScrollbar = shadowRoot.getElementById("scrollbar-h");
        var verticalScrollbar = shadowRoot.getElementById("scrollbar-v");
        var horizontalHandle = shadowRoot.getElementById("scrollbar-handle-h");
        var verticalHandle = shadowRoot.getElementById("scrollbar-handle-v");

        function update(){
            var contentWidth = container.scrollWidth;
            var contentHeight = container.scrollHeight;
            var width = container.offsetWidth;
            var height = container.offsetHeight;
            horizontalScrollbar.classList.toggle("hidden",contentWidth<=width+1);
            verticalScrollbar.classList.toggle("hidden",contentHeight<=height+1);
		    horizontalHandle.style.left = container.scrollLeft*horizontalScrollbar.offsetWidth/contentWidth+"px";
		    verticalHandle.style.top = container.scrollTop*verticalScrollbar.offsetHeight/contentHeight+"px";
            horizontalHandle.style.right = (contentWidth-width-container.scrollLeft)*horizontalScrollbar.offsetWidth/contentWidth+"px";
            verticalHandle.style.bottom = (contentHeight-height-container.scrollTop)*verticalScrollbar.offsetHeight/contentHeight+"px";
        }

        container.addEventListener("scroll",update);
        (new ResizeObserver(update)).observe(container);
    }
};
window.customElements.define("scroll-div",ScrollDiv);