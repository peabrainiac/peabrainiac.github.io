export default class ScrollDiv extends HTMLDivElement {
    constructor(){
        super();
        var shadowRoot = this.attachShadow({mode:"open"});
        shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    overflow: auto;
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                :host(::-webkit-scrollbar) {
                    display: none;
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
            <slot></slot>
            <div id="scrollbar" class="hidden">
                <div id="scrollbar-handle"></div>
            </div>
        `;
        var container = this;
        var scrollbar = shadowRoot.getElementById("scrollbar");
        var handle = shadowRoot.getElementById("scrollbar-handle");

        function update(){
            var contentHeight = container.scrollHeight;
            var height = container.offsetHeight;
            scrollbar.classList.toggle("hidden",contentHeight<=height+1);
		    handle.style.top = container.scrollTop*scrollbar.offsetHeight/contentHeight+"px";
            handle.style.bottom = (contentHeight-height-container.scrollTop)*scrollbar.offsetHeight/contentHeight+"px";
            console.log("Updated!");
        }

        this.addEventListener("scroll",update);
        (new ResizeObserver(update)).observe(this); 
    }
};

window.customElements.define("scroll-div",ScrollDiv,{extends:"div"});