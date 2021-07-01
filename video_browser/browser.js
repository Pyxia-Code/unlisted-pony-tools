"user strict";

const ARCHIVE_JSON = "metadata.json";

function escape_HTML(text) {
	var map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};

	return String(text).replace(/[&<>"']/g, function(m) { return map[m]; });
}

function Browser(browser_parent, content){
	var that = this;
	this.browser_parent = browser_parent;
	this.content = content;
	this.content_current;
	this.view_max_page;
	this.view_per_page = 100;
	this.search_phrase = ""; //Search phrase is always lower case to be case insensitive
	this.search_owner_phrase = "";
	this.sort_key = "";

	//Create HTML elements
	//Title search bar
	this.browse_search = document.createElement("input");
	this.browse_search.classList.add("browse_search");
	this.browse_search.type = "text";
	this.browse_search.placeholder = "Title search";
	this.browse_search.onchange = function(obj){
		that.search_phrase = obj.target.value.toLowerCase();
		that.array_reload();
	}
	this.browser_parent.append(this.browse_search);
	//Owner search bar
	this.browse_search = document.createElement("input");
	this.browse_search.classList.add("browse_search");
	this.browse_search.type = "text";
	this.browse_search.placeholder = "Uploader search";
	this.browse_search.onchange = function(obj){
		that.search_owner_phrase = obj.target.value.toLowerCase();
		that.array_reload();
	}
	this.browser_parent.append(this.browse_search);

	//Browse options
	this.option_changed = function(obj){
		if(obj.target.name == "sort"){
			that.sort_key = obj.target.value;
		}
		that.array_reload();
	};

	this.browse_options_div = document.createElement("div");
	this.browse_options_div.classList.add("browse_options");

	this.browse_options_div.innerHTML = "Sort by:";
	this.browse_sort_select = document.createElement("select");
	this.browse_sort_select.name = "sort";
	this.browse_sort_select.onchange = this.option_changed;
	this.opt = document.createElement("option");
	this.opt.value = "";
	this.opt.innerHTML = "---";
	this.browse_sort_select.append(this.opt);
	this.opt = document.createElement("option");
	this.opt.value = "title";
	this.opt.innerHTML = "Name";
	this.browse_sort_select.append(this.opt);
	this.opt = document.createElement("option");
	this.opt.value = "upload_date";
	this.opt.innerHTML = "Date";
	this.browse_sort_select.append(this.opt);
	this.opt = document.createElement("option");
	this.opt.value = "uploader";
	this.opt.innerHTML = "Uploader";
	this.browse_sort_select.append(this.opt);
	this.browse_options_div.append(this.browse_sort_select);
	
	this.browser_parent.append(this.browse_options_div);

	//Browse stats
	this.browse_tab_stats = document.createElement("center");
	this.browse_tab_stats.classList.add("browse_tab_stats");
	this.browser_parent.append(this.browse_tab_stats);

	//Elements
	this.elements_parent = document.createElement("center");
	this.elements_parent.classList.add("videos");
	this.browser_parent.append(this.elements_parent);

	//Controls
	var browse_page_controls = document.createElement("center");
	browse_page_controls.classList.add("browse_page_controls");
	this.browser_parent.append(browse_page_controls);

	this.view_prev_btn = document.createElement("button");
	this.view_prev_btn.onclick = function(){that.view_prev()};
	this.view_prev_btn.innerHTML = "<";
	browse_page_controls.append(this.view_prev_btn);

	this.page_input = document.createElement("input");
	this.page_input.type = "text";
	this.page_input.onchange = function(){that.view_page_input(this)};
	browse_page_controls.append(this.page_input);

	this.view_next_btn = document.createElement("button");
	this.view_next_btn.onclick = function(){that.view_next()};
	this.view_next_btn.innerHTML = ">";
	browse_page_controls.append(this.view_next_btn);

	//Functions
	this.get_key = function(key){
		for(var i in this.content){
			if(this.content[i]["key"] == key){
				return JSON.parse(JSON.stringify(this.content[i])); //Return a copy instead of a reference
			}
		}
	};

	this.array_reload = function(){
		//Reapplies all the filters and sorts the content array
		//Also executes _view_reload for the new array to be shown
		const t0 = performance.now(); //Benchmarking

		//Sort and filter content array
		this.content_current = [];
		for(var i in this.content){
			this.content_current.push(this.content[i]);
		}
		if(this.search_phrase){
			this.content_current = this.content_current.filter(function(a){return a["title"].toLowerCase().includes(that.search_phrase);});
		}
		if(this.search_owner_phrase){
			this.content_current = this.content_current.filter(function(a){return a["uploader"].toLowerCase().includes(that.search_owner_phrase);});
		}
		if(this.sort_key)
			this.content_current.sort(function(a,b){return a[that.sort_key].localeCompare(b[that.sort_key]);});

		if(this == browser_main){
			this.content_current = this.content_current.filter(
				function(current_el){
					return ponyrelated_content.findIndex(function callback(el){
						return el["id"]==current_el["id"]
					}) == -1;
				}
			)
		}

		const t1 = performance.now();
		const td = (t1-t0).toFixed(2);
		console.log(`Query took ${td} ms`);

		//Show stats
		this.browse_tab_stats.innerHTML = this.content_current.length;
		this.browse_tab_stats.innerHTML += "/";
		this.browse_tab_stats.innerHTML += this.content.length;
		this.browse_tab_stats.innerHTML += " in ";
		this.browse_tab_stats.innerHTML += td;
		this.browse_tab_stats.innerHTML += "ms";

		this.view_page = 0;
		this._view_reload();
	};
	this.mark_ponyrelated = function(metadata){
		ponyrelated_index = ponyrelated_content.findIndex(function callback(el){return el["id"]==metadata["id"]});
		if(ponyrelated_index == -1){ //marking
			ponyrelated_content.push(metadata);
		}else{ //unmarking
			ponyrelated_content.splice(ponyrelated_index, 1);
		}

		old_main_page = browser_main.view_page;
		old_ponyrelated_page = browser_ponyrelated.view_page;
		browser_main.array_reload();
		browser_ponyrelated.array_reload();
		browser_main.view_page = old_main_page;
		browser_ponyrelated.view_page = old_ponyrelated_page;
		browser_main._view_reload();
		browser_ponyrelated._view_reload();

		localStorage.setItem("ponyrelated", JSON.stringify(ponyrelated_content));
	}
	this.create_element = function(metadata, url=""){
		//Returns element
		url = "https://youtube.com/watch?v=" + metadata["id"];
		var element = document.createElement("a");
		element.classList.add("element");
		element.title += "Name: " + metadata["title"] + "\n";
		if(metadata["uploader"])
			element.title += "Uploader: " + metadata["uploader"] + "\n";
		if(metadata["upload_date"])
			element.title += "Upload date: " + metadata["upload_date"] + "\n";

		var thumbnail_a = document.createElement("a");
		var thumbnail = document.createElement("img");
		thumbnail.classList.add("element_thumbnail");

		thumbnail.src = metadata["thumbnail"];

		thumbnail_a.append(thumbnail)
		thumbnail_a.onclick = function(){that.mark_ponyrelated(metadata)};
		element.append(thumbnail_a);

		var element_info = document.createElement("div");
		element_info.classList.add("element_info");
		
		var title = document.createElement("a");
		title.classList.add("element_title");
		title.innerHTML = escape_HTML(metadata["title"]);
		title.href = url;
		element_info.append(title);

		var uploader_a = document.createElement("a");
		uploader_a.href = metadata["uploader_url"];
		var uploader = document.createElement("span");
		uploader.classList.add("element_uploader");
		uploader.innerHTML = escape_HTML(metadata["uploader"]);
		uploader_a.append(uploader);
		element_info.append(uploader_a);

		element.append(element_info);

		return element;
	};
	this._view_reload = function(){
		//Reload the element div
		//This is executed when page no. is changed
		//When filters are changed array_reload is executed which also executes _view_reload
		this.view_max_page = Math.floor(this.content_current.length/this.view_per_page);
		//Lock controls so it can't be pressed while a page is loading
		this.view_prev_btn.disabled = 1;
		this.view_next_btn.disabled = 1;
		this.page_input.disabled = 1;
		//Page number
		this.page_input.value = this.view_page;
		//Reload the element view
		this.elements_parent.innerHTML = "";
		for(var i=this.view_page*this.view_per_page; i<Math.min(this.content_current.length, (this.view_page+1)*this.view_per_page); i++){
			var el = this.create_element(this.content_current[i]);
			this.elements_parent.append(el);
		}
		//Unlock controls
		this.page_input.disabled = 0;
		if(this.view_page == 0){
			this.view_prev_btn.disabled = 1;
		}else{
			this.view_prev_btn.disabled = 0;
		}
		if(this.view_page == this.view_max_page){
			this.view_next_btn.disabled = 1;
		}else{
			this.view_next_btn.disabled = 0;
		}
	};
	/* Controls */
	this.view_next = function(){
		this.view_page+=1;
		this._view_reload();
	};
	this.view_prev = function(){
		this.view_page-=1;
		this._view_reload();
	};
	this.view_page_input = function(obj){
		var obj_val = Number(obj.value);
		if(!isNaN(obj_val)){
			if((0 <= obj_val) & (obj_val <= this.view_max_page)){
				this.view_page = obj_val;
			}
			if(obj_val < 0){
				this.view_page = 0;
			}
			if(obj_val > this.view_max_page){
				this.view_page = this.view_max_page;
			}
		}
		this._view_reload();
	};
}

