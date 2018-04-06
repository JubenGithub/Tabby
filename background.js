// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var ctabs = [];
var onoff = "Off";
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.trigger == "On")
     	onoff = "On";
	if (request.trigger == "Off")
		onoff = "Off";
  });

chrome.runtime.onInstalled.addListener(function(e){
	chrome.tabs.query({currentWindow: true}, function (tabs){
		for(var i in tabs){
			if (!ctabs.includes(tabs[i].id)){
				ctabs.push(tabs[i].id);
			}
		}
	});
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	if(onoff == "On"){
		var url = changeInfo.url;
		var activeId = tabId;
		if (url){
			chrome.tabs.query({currentWindow: true, active:false}, function (tabs){
				for (var i = 0; i < tabs.length; i++){
					if (tabs[i].url == url && tabs[i].id != activeId){
						console.log(tabs[i].id);
						chrome.tabs.move(activeId, {index:i+1});
						chrome.tabs.remove(tabs[i].id);
					} 
			}
			});
		}
	}
});
chrome.tabs.onCreated.addListener(function(tab){
	ctabs.push(tab.id);
});
chrome.tabs.onRemoved.addListener(function (tabId, removeInfo){
	if(ctabs.includes(tabId)){
		ctabs.splice(ctabs.indexOf(tabId), 1);
	}
})

chrome.tabs.onActivated.addListener(function(activeInfo){
	if (ctabs.includes(activeInfo.tabId)){
		ctabs.splice(ctabs.indexOf(activeInfo.tabId), 1);
		ctabs.push(activeInfo.tabId);
	}
	else{
		ctabs.push(activeInfo.tabId);
	}
})


