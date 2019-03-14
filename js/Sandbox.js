const Sandbox = function(){
	var exports = {};
	
	exports.test = function(){
		var code = "{asd:  1, assd: [0.1,2 ],fgf: {a: 12334,b :12.3}}"
		console.log("code: ",code);
		console.log("lexer output: ",lex(code));
	};
	
	exports.parse = function(code){
		
	};
	
	function lex(str){
		var letters_ignore = /\s/;
		var letters_special = /[{}[\]:,.]/;
		var letters_digits_strict = /\d/;
		var letters_digits_all = /[0-9.a-fx]/;
		var letters_identifiers_chars = /\w/;
		var keywords = /^((function)|(var)|(let)|(for)|(while)|(if)|(else))$/;
		var tokensList = [""];
		var i = 0;
		while (i<str.length){
			var char = str.charAt(i);
			if (letters_ignore.test(char)){
				i++;
			}else if (letters_special.test(char)){
				tokensList.push({type:"special",token:char});
				i++;
			}else if (letters_digits_strict.test(char)){
				var number = "";
				while (letters_digits_all.test(char)&&i<str.length){
					number += char;
					i++;
					char = str.charAt(i);
				}
				tokensList.push({type:"number",token:number});
			}else if (letters_identifiers_chars.test(char)){
				var identifier = "";
				while (letters_identifiers_chars.test(char)&&i<str.length){
					identifier += char;
					i++;
					char = str.charAt(i);
				}
				if (keywords.test(identifier)){
					tokensList.push({type:"keyword",token:identifier});
				}else{
					tokensList.push({type:"identifier",token:identifier});
				}
			}else{
				tokensList[0] += char;
				i++;
			}
		}
		return tokensList;
	}
	
	return exports;
};