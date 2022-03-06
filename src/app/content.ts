const injectScript = (file_path, tag) => {
    const node = document.getElementsByTagName(tag)[0];
    const script = document.createElement("script");

    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", file_path);

    node.appendChild(script);
};

injectScript(chrome.extension.getURL("js/inject.js"), "head");

window.addEventListener("message", (e) => {
  if (e.data.type && e.data.type == "FROM_PAGE") {
      chrome.runtime.sendMessage({ url: e.data.url, instanceID: e.data.instanceID }, (response) => {
          window.postMessage({ type: "FROM_SERVER", response })
      });
  }
}, true);