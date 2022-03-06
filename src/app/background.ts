chrome.tabs.onActivated.addListener(tab => {
    chrome.tabs.get(tab.tabId, current_tab_info => {
        if(/^http:\/\/localhost:3000/.test(current_tab_info.url)) {
            chrome.tabs.executeScript(null, { file: "./js/content.js" }, () => { console.log("Script injected!") })
        }
    })
})

const mockAPIEndpoint1 = () => {
    return '{ "userID": "4546sdfdsf58qwfsa", "userName": "John Does" }';
}

const mockAPIEndpoint2 = () => {
    return '{ "appName": "APP789660031", "appName": "My React App" }';
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    let response;
    
    if (request.url == "http://api.webservice.com/getUser") {
        response = mockAPIEndpoint1();
    }

    if (request.url == "http://api.webservice.com/getApp") {
        response = mockAPIEndpoint2();
    }

    sendResponse({ message: response, originalRequestURL: request.url, instanceID: request.instanceID });
});