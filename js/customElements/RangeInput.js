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
			this.update();
		});
		this._valueToString = (x)=>(""+x);
		this._innerToOuterValue = (x)=>(x);
		this._changeCallbacks = [];
	}

	onChange(callback){
		this._changeCallbacks.push(callback);
		callback(this.value);
	}

	updateText(value=this.value){
		this._span.innerText = this._valueToString(value);
	}

	update(){
		let value = this.value;
		this.updateText(value);
		for (let i=0;i<this._changeCallbacks.length;i++){
			this._changeCallbacks[0](value);
		}
	}

	set value(value){
		this._input.value = value;
		this.update();
	}

	get value(){
		return this._innerToOuterValue(this._input.value*1);
	}

	set valueToString(valueToString){
		this._valueToString = valueToString;
		this.updateText();
	}

	get valueToString(){
		return this._valueToString;
	}

	set innerToOuterValue(innerToOuterValue){
		this._innerToOuterValue = innerToOuterValue;
		this.update();
	}

	get innerToOuterValue(){
		return this._innerToOuterValue;
	}
	
	static get observedAttributes(){
		return ["min","max","value","step"];
	}

	attributeChangedCallback(name,oldValue,newValue){
		if (name=="min"||name=="max"||name=="value"||name=="step"){
			this._input.setAttribute(name,newValue);
			this.update();
		}
	}
}
customElements.define("range-input",RangeInput);