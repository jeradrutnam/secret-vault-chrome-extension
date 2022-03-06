let httpCallStack = [];

const resolveHTTPResponse = (resolve, message) => {
    resolve(message);
};

const uniqueIDGen = () => {
    return "UUID" + Math.floor(Math.random() * 100) + Date.now();
}

window.secureHTTP = {
    get: (apiEndpoint) => {
        const instanceID = uniqueIDGen();
        
        return new Promise((resolve, reject) => {
            window.postMessage({ type: "FROM_PAGE", url: apiEndpoint, instanceID: instanceID });

            httpCallStack.push({ 
                ["instanceID"]:instanceID,
                ["resolve"]: resolve,
                ["reject"]: reject
            });
        });
    }
}

window.addEventListener("message", (e) => {
    if (e.data.type && e.data.type == "FROM_SERVER") {

        const httpRequests = httpCallStack.filter(httpRequest => httpRequest.instanceID === e.data.response.instanceID);

        if (httpRequests.length > 0) {
            httpRequests.forEach((httpRequest) => {
                resolveHTTPResponse(httpRequest.resolve, e.data.response.message);
                httpCallStack.splice(httpCallStack.findIndex(({ instanceID }) => instanceID == httpRequest.instanceID), 1);
            });
        }
    }
});
