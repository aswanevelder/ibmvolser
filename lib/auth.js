const crypto = require('crypto');
const fm = require('./filemanager');
const qs = require("querystring")

exports.generateToken = (usr, pwd) => {
    const login = `usr=${qs.escape(usr)}&pwd=${qs.escape(pwd)}`;
    hash = crypto
        .createHash("sha256")
        .update(`${login}`)
        .digest("hex");
    return hash;
}

exports.authorize = async (req, res) => {
    let login = ''; 
    req.setEncoding('utf8');
    req.on('data',(chunk) => {
        login += chunk;
      });

      req.on('end', async () => {
        if (login) {
            hash = crypto
                .createHash("sha256")
                .update(`${login}`)
                .digest("hex");
            await showLogin(res, hash);
        }
        else {
            if (req.headers?.cookie) {
                const cookies = req.headers.cookie.split(";");
                if (cookies.length > 0) {
                    hash = cookies[0].replace("token=","");
                    await showLogin(res, hash);
                }
            }
            else
                await showLogin(res, );
        }
      });
}

exports.logout = async (req, res) => {
    res.writeHead(301, {
        Location: "/"
      });
      response.end();
}

const showLogin = async (res, hash) => {
    if (hash == process.env.VOLSER_TOKEN) {
        let expire = new Date();

        let expireInMin = process.env.VOLSER_TOKEN_EXPIRE_MIN;
        if (expireInMin)
            expireInMin = Number(expireInMin);
        else
            expireInMin = 10;

        expire.setMinutes(expire.getMinutes() + expireInMin);
        res.writeHead(200, {
            "Set-Cookie": `token=${hash};Expires=${expire.toUTCString()}`,
            'Content-Type': 'text/html'});
    }
    else {
        res.writeHead(200, {
            "Set-Cookie": `token=`,
            "Content-Type": 'text/html',
            "Location": "/"});
        res.end(await fm.getLoginHtml());
    }
}