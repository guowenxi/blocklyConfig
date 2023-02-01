
function dispatch(config) {
    const { url, method, params } = config;
    let _params = params_rbacToken ? `satoken=${params_rbacToken}` : "";
    if (params) {
        for (var key in params) {
            _params = `${_params}&${key}=${params[key]}`
        }
    }
    const URl = url.indexOf("http") != -1 ? url : `${baseUrl}${url}`;
    return fetch(
        URl
        +
        (method == "POST" ? '' : `${_params ? "?" : ""}${_params}`)
        , {
            method: method || "GET",
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': true,
            },
            body: method == "POST" ? JSON.stringify(params) : null,
        }).then(response => response.json()).catch((error) => {
            console.error('Error:', error);
        })
}