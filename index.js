const http = require("http");
const fm = require('./lib/filemanager');
const hg = require('./lib/htmlgenerator');
const qs = require('./lib/querystring');

const host = 'localhost';
const port = 8000;

const requestListener = async (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);

    const params = qs.getQueryParameters(req);

    let directory = process.env.VOLSER_LOCATION;
    if (!directory)
        directory = `./reports`;

    let html = String(await fm.getHtmlLayout());
    html = hg.getHtmlInterval(html, params.interval);
    const menu = await hg.getMenu(html, `${directory}/${params.interval}`, params.date);
    html = menu.html;
    console.log(menu.date);
    html = await fm.search(html, req, menu.date);
    html = await hg.repFile(html, `${directory}/${params.interval}/${menu.date}`, params.showrep);
    html = hg.search(html, params);
    
    res.end(html);
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});