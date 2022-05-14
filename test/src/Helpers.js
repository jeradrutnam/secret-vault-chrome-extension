export const until = async (condFunc) => {
    return new Promise((resolve) => {
        if (condFunc()) {
            resolve(null);
        }
        else {
            setTimeout(async () => {
                await until(condFunc);
                resolve(null);
            }, 100);
        }
    });
};
