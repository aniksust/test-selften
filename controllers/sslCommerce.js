const SSLCommerz = require('sslcommerz-nodejs');

let settings = {
    isSandboxMode: true, //false if live version
    store_id: process.env.SANDBOX_SSLCOMMERZ_STORE_ID,
    store_passwd: process.env.SANDBOX_SSLCOMMERZ_STORE_PASSWORD,
}

exports.sslcommerz = new SSLCommerz(settings);

