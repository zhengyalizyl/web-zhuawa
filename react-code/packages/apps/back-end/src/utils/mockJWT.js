const crypto = require('crypto');

function sign(payload, salt) {
    let header = { alg: 'HS256', typ: 'JWT' };
    const tokenArr = [];

    tokenArr.push(base64UrlEncode(JSON.stringify(header)));
    tokenArr.push(base64UrlEncode(JSON.stringify(payload)));

    // 加密
    console.log(tokenArr.join('.'))
    const signature = encryption(tokenArr.join('.'), salt);

    return [...tokenArr, signature].join('.')
}

function base64UrlEncode(str){
    return Buffer.from(str).toString('base64');
}

function encryption(value, salt) {
    return crypto
    .createHmac("SHA256", salt)
    .update(value)
    .digest('base64')
}


function verify(token, salt) {
    var [ h, p, s ] = token.split('.');
    const signature = encryption([h, p].join('.'), salt);
    return signature === s;
}
console.log(sign({ username: "luyi" }, "ZHAOWA"));
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imx1eWkifQ==.dKkVsSN72fqFlqn7c9hGYuZ6Lwi7bx9JL0ZHPSst4Ak=
console.log(verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imx1eWkifQ==.dKkVsSN72fqFlqn7c9hGYuZ6Lwi7bx9JLSst4Ak=', "ZHAOWA"))
