let sortname = document.getElementById('name');
let sortfrequency = document.getElementById('frequency');
let onoffswitch = document.getElementById('onoff');
let background = chrome.extension.getBackgroundPage();
let search = document.getElementById('searchbutton');

search.onclick = function(element){
	let searchvalue = document.getElementById('searchvalue').value;
	var searched = -1;
	if(searchvalue){
	chrome.tabs.query({currentWindow: true}, function (tabs){
		for (i in tabs){
			if(tabs[i].title.toLowerCase().includes(searchvalue.toLowerCase()) || tabs[i].url.toLowerCase().includes(searchvalue.toLowerCase())){
				chrome.tabs.move(tabs[i].id, {index:-1});
				searched = tabs[i];
			}
		}
		if(searched != -1){
			chrome.tabs.update(searched.id, {active: true});
		}
		
	});
	}
}
if(background.onoff == "On"){
	onoffswitch.checked = true;
}
else{
	onoffswitch.checked = false;
}

onoffswitch.onclick = function(element){
	if (onoffswitch.checked == true){
		chrome.runtime.sendMessage({trigger: "On"});
	}
	else{
		chrome.runtime.sendMessage({trigger: "Off"});
	}
}
sortname.onclick = function(element){
	chrome.tabs.query({currentWindow: true}, function (tabs){
		console.log(tabs);
		var sortarray = [];
		for (var i = 0; i < tabs.length; i++ ){
			sortarray.push([tabs[i].id, tabs[i].url]);
		}
		sortarray.sort(function(a, b){return a[1].localeCompare(b[1])});
		console.log(sortarray);
		for(var i in sortarray){
			chrome.tabs.move(sortarray[i][0], {index:-1});
		}
	});
};
sortfrequency.onclick = function(element){
	let farray = background.ctabs;
	console.log(farray);
	for(var i in farray){
		chrome.tabs.move(farray[i], {index:-1});
	}
};
