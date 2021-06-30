"user strict";

var browser_main;
var browser_ponyrelated;
var main_content;
var ponyrelated_content;

async function load_content(){
	//Load
	var rq = await fetch(ARCHIVE_JSON);
	if(rq.ok == false){
		throw "Couldn't fetch " + ARCHIVE_JSON + "<br>" + "HTTP Status: " + String(rq.status);
	}
	return (await rq.json());
}

function change_tab(obj, tab){
	//Activate button
	var top_buttons = obj.parentElement.children;
	for(var i=0; i<top_buttons.length; i++){
		top_buttons[i].classList = "top_button";
	}
	obj.classList = "top_button top_button_active";

	//Activate tab
	var tabs = document.getElementById("tabs").children;
	for(var i=0; i<tabs.length; i++){
		tabs[i].style.display = "none";
	}
	document.getElementById(tab).style.display = "block";
}

async function browser_load(){
	//Switch to the 1st tab
	document.getElementById("top_tabs").children[0].classList = "top_button top_button_active";
	document.getElementById("tabs").children[0].style.display = "block";

	//DB
	main_content = (await load_content());
	if(localStorage.getItem("ponyrelated") == null){
		localStorage.setItem("ponyrelated", "[]");
	}
	ponyrelated_content = JSON.parse(localStorage.getItem("ponyrelated"))

	browser_main = new Browser(document.getElementById("browse_tab"), main_content);
	browser_main.array_reload();

	browser_ponyrelated = new Browser(document.getElementById("ponyrelated_tab"), ponyrelated_content);
	browser_ponyrelated.array_reload();
}

function copy_ponyrelated(){
	to_copy = "";
	for(i=0; i<ponyrelated_content.length; i++){
		to_copy += ponyrelated_content[i]["id"];
		to_copy += "\n";
	}
	navigator.clipboard.writeText(to_copy)
}
