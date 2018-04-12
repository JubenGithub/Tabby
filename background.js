// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
chrome.runtime.onInstalled.addListener(function(){
	let ctabs = [];
	chrome.storage.sync.set({tabs:ctabs});
});
chrome.runtime.onStartup.addListener(function(){
	chrome.tabs.query({currentWindow: true}, function (tabsf){
		var tabs = tabsf;
		chrome.storage.sync.get('tabs', function(data){
			var ctabs = data.tabs;
			for(var i in tabs){
				if (!ctabs.includes(tabs[i].id)){
					ctabs.push(tabs[i].id);
				}
			}
			chrome.storage.sync.set({tabs:ctabs});
		})

	});
    chrome.storage.sync.set({AvoidDupli: 'Off'});
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	chrome.storage.sync.get('AvoidDupli', function(data) {
		if(data.AvoidDupli == "On"){
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
	})
});
chrome.tabs.onCreated.addListener(function(tab){
	chrome.storage.sync.get('tabs', function(data){
		var ctabs = data.tabs;
		ctabs.push(tab.id);
		chrome.storage.sync.set({tabs:ctabs});
	});
});
chrome.tabs.onRemoved.addListener(function (tabId, removeInfo){
	var ctabs = [];
	chrome.storage.sync.get('tabs', function(data){
		ctabs = data.tabs;
		if(ctabs.includes(tabId)){
			ctabs.splice(ctabs.indexOf(tabId), 1);
		}
		chrome.storage.sync.set({tabs:ctabs});
	});
})

chrome.tabs.onActivated.addListener(function(activeInfo){
	var ctabs = [];
	chrome.storage.sync.get('tabs', function(data){
		ctabs = data.tabs;
		if (ctabs.includes(activeInfo.tabId)){
			ctabs.splice(ctabs.indexOf(activeInfo.tabId), 1);
			ctabs.push(activeInfo.tabId);
		}
		else{
			ctabs.push(activeInfo.tabId);
		}
		chrome.storage.sync.set({tabs:ctabs});
	});

})


