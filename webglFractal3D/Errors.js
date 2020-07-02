import Popup from "../js/Popup.js";

export default class Errors {

    static showError(error){
        var popup = new Popup(document.getElementById("popup-overlay"),"Error",240,120);
        popup.setType("error");
        console.log({error});
        popup.addText(error?error.message:"Unknown error");
        popup.addButton("Close",function(){
            popup.close();
        });
    }
}