const http = require("http");
const url = require("url");
const fs = require('fs');

const host = 'localhost';
const port = 8000;
let filesSearched = 0;

const requestListener = function (req, res) {
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);

    getHtmlLayout((layout) => {
        getHtmlTable((table) => {
            search(req, table, (records, date, search) => {
                let html = String(layout).replace("[CONTENT]", records);
                html = html.replace("[DATE]", date);
                html = html.replace("[SEARCH]", (search) ? search : "None");
                res.end(html);
            });
        });
    });
};

const getHtmlLayout = function(callback) {
    fs.readFile('layout.html', (err, data) => {
        callback(data);
    });
}

const getHtmlTable = function(callback) {
    fs.readFile('table.html', (err, data) => {
        callback(data);
    });
}

const search = function(req, table, callback) {
    filesSearched = 0;
    var records = "";
    var qs = url.parse(req.url, true).query;
    if (qs) {
        let date = qs.date;
        const search = qs.search;
        const interval = qs.interval;

        if (!date) {
            const dt = new Date();
            date = dt.toLocaleDateString("en-ZA", { 
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            });
        }

        date = date.replace(/-/g, ".");
        date = date.replace(/\//g, ".");

        //If no environment variable is set then use the local default
        let directory = process.env.VOLSER_LOCATION;
        if (!directory)
            directory = `./reports`;

        const dir = `${directory}/${interval}/${date}`;

        if (fs.existsSync(dir)) {
            fs.readdir(dir, (err, files) => {
                if (err) {
                    throw err
                }
            
                files.forEach(file => {
                    findJob(table, `${dir}/${file}`, search, (data) => {
                        if (data)
                        records += data;
                    });
                });

                //Search the files are async so we need to check if it is done in a timer.
                var timer = setInterval(() => {
                    if (filesSearched == files.length) {
                        clearInterval(timer);
                        if (records)
                            callback(records, date, search);
                        else
                            callback(noRecords(table, date, search), date, search);
                    }
                }, 1000);
            });
        }
        else {
            callback(noRecords(table, date, search), date, search);
        }
    }
}

const noRecords = function(table, date, search) {
    let error = "";
    error = String(table)
        .replace("[FILERECORD]", `<td colspan=8>Search term '${search}' at location ${date} returned no results.</td>`)
        .replace("[RECORDS]", "<tr><td colspan=8>No records found</td></tr>");
    return error;
}

const findJob = function(table, file, search, callback) {
    fs.readFile(file, (err, data) => {
        if (search) {
            if (data.indexOf(search) > -1) {
                let html = createRecord(table, JSON.parse(data));
                callback(html);
            }
            else
                callback(null);
        }
        else {
            try {
                const model = JSON.parse(data);
                let html = createRecord(table, model);
                callback(html);
            }
            catch (err) {
                callback(null);
            }
        }
        filesSearched++;
    });
}

const createRecord = function(table, model) {
    let html = String(table);
    let records = "";
    const adate = new Date(parseInt(model.access_time)).toDateString();
    const mdate = new Date(parseInt(model.modification_time)).toDateString();
    html = html.replace("[FILERECORD]", `<td>${model.volser}</td><td>${model.file_name}</td><td>${model.label_type}</td><td>${model.encryption}</td><td>${model.vol1}</td><td>${model.file_size}</td><td>${adate}</td><td>${mdate}</td>`);
    model.data_sets.forEach(e => {
        records += `<tr><td>${e.dsn}</td><td>${convertJulianDay(e.creation_date)}</td><td>${convertJulianDay(e.expiration_date)}</td><td>${e.recfm}</td><td>${e.block_length}</td><td>${e.lrecl}</td><td>${e.job_name}</td><td>${e.job_step}</td></tr>`;
    });
    return html.replace("[RECORDS]", records);
}

const convertJulianDay = function (jd) {
    const array = jd.split("/");
    if (array.length == 2) {
        const date = new Date(array[0], 0, array[1]);
        return date.toDateString();
    }
    else
        return jd;
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});