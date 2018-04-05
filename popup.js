let sortname = document.getElementById('name');
let sortfrequency = document.getElementById('frequency');
sortname.onclick = function(element){
	chrome.tabs.query({currentWindow: true}, function (tabs){
		console.log(tabs);
		var sortarray = [];
		for (var i = 0; i < tabs.length; i++ ){
			sortarray.push([tabs[i].id, tabs[i].title]);
		}
		sortarray.sort(function(a, b){return a[1].localeCompare(b[1])});
		console.log(sortarray);
		for(var i in sortarray){
			chrome.tabs.move(sortarray[i][0], {index:-1});
		}
	});
};
sortfrequency.onclick = function(element){
	let background = chrome.extension.getBackgroundPage();
	let farray = background.ctabs;
	console.log(farray);
	for(var i in farray){
		chrome.tabs.move(farray[i], {index:-1});
	}
};
