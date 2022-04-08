const getCurrentTab = async () => {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);

    return tab;
};

let tab = await getCurrentTab();

chrome.tabs.onActivated.addListener(() => {
    if (/^http:\/\/localhost:3000/.test(tab.url)) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: [ "./js/content.js" ]
        });
    }
});


const mockAPIEndpoint1 = () => {
    return '{ "userID": "UUID3345526888", "userName": "John Does" }';
}

const mockAPIEndpoint2 = () => {
    return '{ "appName": "APP789660031", "appName": "My React App" }';
}

const responseStatus = (response) => {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}

const json = (response) => {
    return response.json()
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.url == "http://api.webservice.com/getUser") {
        sendResponse({ message: mockAPIEndpoint1(), originalRequestURL: request.url, instanceID: request.instanceID });
    }

    if (request.url == "http://api.webservice.com/getApp") {
        setTimeout(() => {
            sendResponse({ message: mockAPIEndpoint2(), originalRequestURL: request.url, instanceID: request.instanceID });
        }, 500);
    }

    if (request.url == "https://api.publicapis.org/entries") {
        fetch("https://api.publicapis.org/entries")
            .then(responseStatus)
            .then(json)
            .then((data) => {
                sendResponse({ status: "success", message: data, originalRequestURL: request.url, instanceID: request.instanceID });
            }).catch((error) => {
                sendResponse({ status: "failed", message: error, originalRequestURL: request.url, instanceID: request.instanceID });
            });
    }

    return true;
});

export {};