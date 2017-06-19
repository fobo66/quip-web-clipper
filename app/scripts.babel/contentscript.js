chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    // If the received message has the expected format...
    if (msg.text === 'report_back' && msg.url !== 'undefined') {
        // Call the specified callback, passing
        // the web-page's DOM content as argument
        var docClone = document.cloneNode(true);
        var parser = document.createElement('a');
        parser.href = msg.url;
        var uri = {
          spec: msg.url,
          host: parser.host,
          prePath: parser.protocol + '//' + parser.host,
          scheme: parser.protocol.substr(0, parser.protocol.indexOf(':')),
          pathBase: parser.protocol + '//' + parser.host + parser.pathname.substr(0, parser.pathname.lastIndexOf('/') + 1)
        };
        var article = new Readability(uri, docClone).parse();
        chrome.storage.local.set({
          pageContent: article.content,
          pageTitle: article.title
        });
        sendResponse();
    }
});