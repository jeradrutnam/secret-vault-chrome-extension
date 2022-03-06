window.secureHTTP = (arg) => {
    window.postMessage({ type: "FROM_PAGE", url: arg});
};