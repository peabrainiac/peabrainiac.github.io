export default class RangeInput extends HTMLElement {
	constructor(){
		super();
		this.attachShadow({mode:"open"});
		this.shadowRoot.innerHTML = `
			<style>
				input {
					vertical-align: middle;
				}
			</style>
			<input type="range" step="any">: <span></span>
		`;
		this._input = this.shadowRoot.querySelector("input");
		this._span = this.shadowRoot.querySelector("span");
		this._input.addEventListener("input",()=>{
			this.updateText();
		});
		this._valueToString = (x)=>(""+x);
	}

	updateText(){
		this._span.innerText = this._valueToString(this._input.value);
	}

	set value(value){
		this._input.value = value;
		this.updateText();
	}

	get value(){
		return this._input.value;
	}

	set valueToString(valueToString){
		this._valueToString = valueToString;
		this.updateText();
	}

	get valueToString(){
		return this._valueToString;
	}
	
	static get observedAttributes(){
		return ["min","max","value","step"];
	}

	attributeChangedCallback(name,oldValue,newValue){
		if (name=="min"||name=="max"||name=="value"||name=="step"){
			this._input.setAttribute(name,newValue);
			this.updateText();
		}
	}
}
customElements.define("range-input",RangeInput);