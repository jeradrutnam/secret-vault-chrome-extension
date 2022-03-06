chrome.tabs.onActivated.addListener(tab => {
    chrome.tabs.get(tab.tabId, current_tab_info => {
        if(/^http:\/\/localhost:3000/.test(current_tab_info.url)) {
            chrome.tabs.executeScript(null, { file: "./js/content.js" }, () => { console.log("Script injected!") })
        }
    })
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message.url || "NO MESSAGE")
    sendResponse({ message: "API Response!" })
});