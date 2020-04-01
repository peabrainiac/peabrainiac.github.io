export default class TextInput extends HTMLElement {
	constructor(){
		super();
		this.attachShadow({mode:"open"});
		this.shadowRoot.innerHTML = `
			<style>
				:host {
					display: inline-block;
					position: relative;
					min-width: 185px;
					padding: 1px 3px;
					border: 1px solid transparent;
					transition: border-bottom-color 0.25s ease;
					font-family: "MS Shell Dlg 2", sans-serif; 
				}
				input {
					color: inherit;
					background: transparent;
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
				}
				span {
					visibility: hidden;
				}
				input, span {
					padding: 0;
					border: none;
					font: inherit;
					text-align: inherit;
					white-space: pre;
				}
			</style>
			<span> </span>
			<input type="text" class="inner-input">
		`;
		this._input = this.shadowRoot.querySelector("input");
		this._text = this.shadowRoot.querySelector("span");
		this._validator = ()=>(true);
		this._input.addEventListener("input",()=>{
			this._text.innerText = this._input.value||" ";
			this.validate();
		});
	}

	focus(){
		this._input.focus();
	}

	get value(){
		return this._input.value;
	}

	set value(value){
		this._input.value = value;
		this._text.innerText = value||" ";
		this.validate();
	}

	validate(){
		if (this.validator(this._input.value)){
			this.classList.remove("invalid");
			this.dispatchEvent(new Event("validinput"))
		}else{
			this.classList.add("invalid");
		}
	}

	get validator(){
		return this._validator;
	}

	set validator(validator){
		this._validator = validator;
		this.validate();
	}

	static get observedAttributes(){
		return ["placeholder"];
	}

	attributeChangedCallback(name,oldValue,newValue){
		if (name=="placeholder"){
			this._input.setAttribute(name,newValue);
		}
	}

	get placeholder(){
		return this.getAttribute("placeholder");
	}

	set placeholder(value){
		this.setAttribute("placeholder",value);
	}
}
customElements.define("text-input",TextInput);