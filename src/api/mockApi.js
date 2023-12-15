export default {
    sendData(payload) {
        return new Promise((resolve, reject) => {
            const isRequestSuccess = !(payload.amount % 2)
            const response = {
                success: isRequestSuccess,
                data: isRequestSuccess ? payload : null
            };
            setTimeout(() => {
                if (isRequestSuccess) {
                    resolve(response)
                    return;
                }
                reject(response)
            }, 1000);
        })

    }
}
