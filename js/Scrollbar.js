const Scrollbar = function(parent){
	parent.classList.add("scroll");
	var scrollbar = document.createElement("div");
	scrollbar.className = "scrollbar";
	parent.appendChild(scrollbar);
	var handle = document.createElement("div");
	handle.className = "scrollbar-handle";
	scrollbar.appendChild(handle);
	
	function update() {
		var contentHeight = parent.scrollHeight;
		var height = parent.offsetHeight;
		if (contentHeight>height){
			scrollbar.classList.remove("scrollbar-hidden");
		}else{
			scrollbar.classList.add("scrollbar-hidden");
		}
		handle.style.top = parent.scrollTop*scrollbar.offsetHeight/contentHeight+"px";
		handle.style.bottom = (contentHeight-height-parent.scrollTop)*scrollbar.offsetHeight/contentHeight+"px";
	}
	
	update();
	parent.addEventListener("scroll",update);
	window.addEventListener("resize",update);
	
	setInterval(update,10000);
};