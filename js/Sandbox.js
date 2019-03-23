const Sandbox = function(){
	var exports = {};
	
	exports.test = function(){
		var code = " {a:/'/,	b : 3.14-1+3, c:/'/}"
		console.log("code: ",code);
		console.log("lexer output: ",lex_old(code));
		console.log("new lexer output: ",lex(code));
	};
	
	exports.parse = function(code){
		
	};
	
	function lex(str){
		var tokenRegexes = [/^\s+/,/^[{}[\]:,.]/,/^[/]/,/^(?:0x[\da-fA-F]+|0b\d+|0o\d+|\d+(?:\.\d)?)/,/^\w+/,/^(?:"[^\\"]*(?:\\.[^\\"]*)*"|'[^\\']*(?:\\.[^\\']*)*'|`[^\\`]*(?:\\.[^\\`]*)*`)/];
		var tokenTypes = ["empty","special","operator","number","identifier","string"];
		var code = str;
		var tokensList = [];
		var matches;
		var regexId = 0;
		while (code){
			var matches = code.match(tokenRegexes[regexId]);
			if (matches){
				tokensList.push({token:matches[0],type:tokenTypes[regexId]});
				code = code.replace(tokenRegexes[regexId],"");
				regexId = 0;
			}else{
				regexId++;
				if (regexId>=tokenRegexes.length){
					throw new Error("Could not parse token: \""+(code.length<15?code:(code.substring(0,10)+"..."))+"\"");
				}
			}
		}
		return tokensList;
	};
	
	function lex_old(str){
		var letters_ignore = /\s/;
		var letters_special = /[{}[\]:,.]/;
		var letters_digits_strict = /\d/;
		var letters_digits_all = /[0-9.a-fx]/;
		var letters_identifiers_chars = /\w/;
		var keywords = /^((function)|(var)|(let)|(for)|(while)|(if)|(else))$/;
		var tokensList = [];
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
				i++;
			}
		}
		return tokensList;
	}
	
	return exports;
};