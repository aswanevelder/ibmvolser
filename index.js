const http = require("http");
const fm = require('./lib/filemanager');
const hg = require('./lib/htmlgenerator');
const qs = require('./lib/querystring');

const host = 'localhost';
const port = 8000;

const requestListener = async (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);

    let directory = process.env.VOLSER_LOCATION;
    if (!directory)
        directory = `./reports`;

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