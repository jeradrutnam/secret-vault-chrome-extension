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

const isValidResponse = (value) => {
    if (value == typeof(String)) {
        try {
            JSON.parse(value);
        } catch (e) {
            return false;
        }
    }

    return true;
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    fetch(request.url)
        .then(responseStatus)
        .then(json)
        .then((data) => {
            if (isValidResponse(data)) {
                sendResponse({ status: "success", message: data, originalRequestURL: request.url, instanceID: request.instanceID });
            }
            else {
                sendResponse({ status: "failed", message: "Response is not a valid JSON object or string", originalRequestURL: request.url, instanceID: request.instanceID });
            }
        }).catch(() => {
            sendResponse({ status: "failed", message: "Cannot reach the endpoint", originalRequestURL: request.url, instanceID: request.instanceID });
        });

    return true;
});

export {};