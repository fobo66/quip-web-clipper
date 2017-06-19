'use strict';

chrome.runtime.onInstalled.addListener( (details) => {
  if(details.reason === 'install') {
    chrome.tabs.create( {
      url: 'https://quip.com/api/personal-token'
    });
     chrome.runtime.openOptionsPage();
  }
});

chrome.tabs.onActivated.addListener( (details) => {
  chrome.browserAction.setIcon({path: 'images/icon-48.png'});
});

function sendToQuip() {
   chrome.storage.sync.get('accessToken', (items) => {
     if (items.accessToken === 'notset' || typeof(items.accessToken) === 'undefined') {
        chrome.runtime.openOptionsPage();
     } else {
       chrome.storage.local.get(['pageTitle', 'pageContent'], (itemss) => {
         var Quip = new XMLHttpRequest();
         Quip.open('POST',  'https://platform.quip.com/1/threads/new-document', true);
         Quip.setRequestHeader('Authorization', 'Bearer ' + items.accessToken);

         Quip.onreadystatechange = () => {
             if (Quip.readyState === 4 && Quip.status === 200) {
              chrome.browserAction.setIcon({path: 'images/success.png'});
            } else {
              chrome.browserAction.setIcon({path: 'images/error.png'});
            }
         }

         var data = new FormData();
         if (typeof(itemss.pageContent) !== 'undefined' && typeof(itemss.pageTitle) !== 'undefined') {
          data.append('title', itemss.pageTitle);
          data.append('content', itemss.pageContent);
         }

         Quip.send(data);
       });
     }
  });
}


chrome.browserAction.onClicked.addListener(tab => {
  chrome.tabs.sendMessage(tab.id, {text: 'report_back', url: tab.url}, sendToQuip);
});