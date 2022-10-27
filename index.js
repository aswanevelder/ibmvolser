const http = require("http");
const fm = require('./lib/filemanager');
const hg = require('./lib/htmlgenerator');
const auth = require(`./lib/auth`);

const host = 'localhost';
const port = 8000;

const requestListener = async (req, res) => {
    await auth.authorize(req, res);

    let html = String(await fm.getHtmlLayout());
    html = hg.getHtmlInterval(html, req);
    const menu = await hg.getMenu(html, req);
    html = menu.html;
    html = await fm.search(html, req, menu.date);
    html = await hg.repFile(html, req, menu.date);
    html = hg.search(html, req);
    res.end(html);
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});