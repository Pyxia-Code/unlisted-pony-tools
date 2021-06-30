// ==UserScript==
// @name     Pony-Rewatch Highlighter
// @version  1
// @include  https://*.youtube.com/*
// @grant    none
// @run-at   document-start
// ==/UserScript==

function toInject(){
  //Put videos to hide here
  const vids = [];
  
  function remove_vid_el(el){
    var whole_element;
    
    if(el.parentElement.parentElement.parentElement.parentElement.id == "dismissible"){ //Normal
    	whole_element = el.parentElement.parentElement.parentElement.parentElement;
    }else if(el.parentElement.parentElement.parentElement.parentElement.id == "container"){ //Playlist
    	whole_element = el.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
    }else if(el.parentElement.parentElement.parentElement.parentElement.id == "thumbnail-container"){ //Playlist during playback
      whole_element = el.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
    }
    
    if(whole_element){
      whole_element.remove();
    }
  }
  
  function highlight(el, remove_highlight=0){
    var thumbnail_element;
    
    if(el.parentElement.parentElement.parentElement.parentElement.id == "dismissible"){ //Normal
      thumbnail_element = el.parentElement.parentElement;
    }else if(el.parentElement.parentElement.parentElement.parentElement.id == "container"){ //Playlist
      thumbnail_element = el.parentElement.parentElement.parentElement;
    }else if(el.parentElement.parentElement.parentElement.parentElement.id == "thumbnail-container"){ //Playlist during playback
      thumbnail_element = el.parentElement.parentElement.parentElement.parentElement;
    }
    
    if(thumbnail_element){
	    if(remove_highlight){
	      thumbnail_element.style.border = "";
	    }else{
	      thumbnail_element.style.border = "4px solid red";
      }
    }
  }
  function add_btn(el, vid_id, is_in_list){
    /*el.parentElement.parentElement.removeAttribute("href");
    el.parentElement.parentElement.vid_id = vid_id;
    el.parentElement.parentElement.onclick = function(){
      alert("Added " + this.vid_id);
    }*/
    var a = document.createElement("a");
    a.style.background = "white";
    a.style.color = "black";
    a.style.top = "0px";
    a.style.left = "0px";
    a.style.fontSize = "16px";
    a.style.padding = "4px";
    a.vid_id = vid_id;
    a.el = el;
    a.onclickadd = function(){
      var current_list = JSON.parse(localStorage.getItem('ponyrewatchlist'));
      current_list.push(this.vid_id);
      localStorage.setItem('ponyrewatchlist', JSON.stringify(current_list));
      
      highlight(this.el, remove_highlight=0);
      
      this.innerHTML = "Remove";
      this.style.background = "#ff0000";
      this.onclick = this.onclickremove;
    }
    a.onclickremove = function(){
      var current_list = JSON.parse(localStorage.getItem('ponyrewatchlist'));
      current_list.splice(current_list.indexOf(this.vid_id), 1);
      localStorage.setItem('ponyrewatchlist', JSON.stringify(current_list));
      
      highlight(this.el, remove_highlight=1);
      
      this.innerHTML = "Add";
      this.style.background = "#00ff00";
      this.onclick = this.onclickadd;
    }
    if(is_in_list){
      a.innerHTML = "Remove";
      a.style.background = "#ff0000";
	    a.onclick = a.onclickremove;
    }else{
      a.innerHTML = "Add";
      a.style.background = "#00ff00";
	    a.onclick = a.onclickadd;
    }
    if(el.parentElement.parentElement.parentElement.parentElement.id == "thumbnail-container"){ //Playlist during playback
      a.style.display = "flex";
      a.style.alignItems = "center";
      a.style.justifyContent = "center";
      a.style.width = "64px";
    	el.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.appendChild(a);
      //el.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.removeAttribute("href");
      console.log(el.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement);
    }else{
      a.style.position = "absolute";
      a.style.fontSize = "64px";
      a.style.opacity = "0.1";
    	el.parentElement.parentElement.parentElement.appendChild(a);
    }
  }
  function src_setter(val){
    //Set src to the given value
    attribute = document.createAttribute("src");
    attribute.value = val;
    this.setAttributeNode(attribute);
    
    //Get vid_id
    if(this.parentElement){
      if(this.parentElement.parentElement){
    		var href = this.parentElement.parentElement.href;
      }
    }
    if(href){
	    if(href.startsWith("https://www.youtube.com/watch?v=")){
	      var vid_id = href.replace("https://www.youtube.com/watch?v=", "").substr(0,11);
	      //console.log(vid_id);
        var is_in_list = 0;
        var current_list = JSON.parse(localStorage.getItem('ponyrewatchlist'));
        if(vids.indexOf(vid_id) != -1){
          //Video in the main list
	    		remove_vid_el(this);
        }else{
          if(current_list.indexOf(vid_id) != -1){
            //Video in the current list
            is_in_list = 1;
            remove_vid_el(this);
          }
        	add_btn(this, vid_id, is_in_list);
        }
	    }
    }
  }
  
  HTMLImageElement.prototype.__defineSetter__("src", src_setter);
  if(! localStorage.getItem('ponyrewatchlist')){ //If it doesn't exist create it
    localStorage.setItem('ponyrewatchlist', JSON.stringify([]));
  }
}

//Inject
unsafeWindow.eval("(" + toInject.toString() + ")()");
