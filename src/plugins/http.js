const rootUrl = 'http://localhost:2000'

const http = {
    post: (url, data) => {
        const options = {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        };
        return fetch(rootUrl + url, options)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .catch(error => console.error('Fetch Error:', error));
    }, postAuth: (url, data, token) => {
        const options = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                authorization: token
            },
            body: JSON.stringify(data)
        };
        return fetch(rootUrl + url, options)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .catch(error => console.error('Fetch Error:', error));
    },
    get: (url) => {
        return fetch(rootUrl + url)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .catch(error => console.error('Fetch Error:', error));
    }
};
export default http