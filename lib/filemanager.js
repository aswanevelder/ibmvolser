const fs = require('fs');
const hg = require("./htmlgenerator");
const qs = require('./querystring');

exports.getHtmlLayout = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('./html/layout.html', (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
}

exports.getHtmlTable = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('./html/table.html', (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
}

exports.getRepFiles = (dir) => {
    return new Promise((resolve, reject) => {
        let fileCounter = 0;
        let fileContent = "";

        if (fs.existsSync(dir)) {
            fs.readdir(dir, async (err, files) => {
                if (err) {
                    reject(err);
                }

                files.forEach(file => {
                    if (file.endsWith(".rep")) {
                        fs.readFile(`${dir}/${file}`, (err, data) => {
                            fileCounter++;
                            fileContent += String(data).replace(/\n/g, "<br/>");

                            if (err)
                                reject(err);

                            if (fileCounter == files.length)
                                resolve(fileContent);
                        });
                    } 
                    else {
                        fileCounter++;
                        if (fileCounter == files.length)
                            resolve(fileContent);
                    } 
                });
            });
        };
    });
}

exports.search = (html, req, date) => {
    return new Promise(async (resolve, reject) => {
        const table = await this.getHtmlTable();
        const params = qs.getQueryParameters(req);

        //Get the environment variable for timezone else default to en-ZA
        let timezone = process.env.VOLSER_TIMEZONE;
        if (!timezone)
            timezone = "en-ZA";

        //If no environment variable is set then use the local default
        let directory = process.env.VOLSER_LOCATION;
        if (!directory)
            directory = `./reports`;

        //The folder structure uses "." replace all "-" or "/" with "."
        if (date) {
            date = date.replace(/-/g, ".");
            date = date.replace(/\//g, ".");
        }

        //Interval passed by querystring can be daily, weekly, monthly, yearly
        const dir = `${directory}/${params.interval}/${date}`;
        let records = "";

        if (fs.existsSync(dir)) {
            fs.readdir(dir, async (err, files) => {
                if (err) {
                    reject(err);
                }
            
                records = await searchFiles(dir, table, files, params.search);
                if (records) {
                    html = html.replace("[CONTENT]", records);
                    html = html.replace("[DATE]", date);
                    resolve(html);
                }
                else {
                    const error = hg.noRecords(table, date, params.search);
                    html = html.replace("[CONTENT]", error);
                    html = html.replace("[DATE]", date);
                    resolve(html);
                }
            });
        }
        else {
            const error = hg.noRecords(table, date, params.search);
            html = html.replace("[CONTENT]", error);
            html = html.replace("[DATE]", date);
            resolve(html);
        }
    });
}

const searchFiles = (dir, table, files, search) => {
    return new Promise((resolve, reject) => {
        let records = "";
        let fileCounter = 1;

        files.forEach(async file => {
            if (!file.startsWith("~") && !file.endsWith(".rep")) {
                fs.readFile(`${dir}/${file}`, (err, data) => {
                    if (err)
                        reject(err);
        
                    if (search) {
                        if (String(data).toLowerCase().indexOf(search.toLowerCase()) > -1) 
                            records += hg.createRecord(table, JSON.parse(data));
                    }
                    else {
                        try {
                            const model = JSON.parse(data);
                            records += hg.createRecord(table, model);
                        }
                        catch(err) {
                            records += "";
                        }
                    }
                    
                    if (fileCounter == files.length) {
                        resolve(records);
                    }
                    else
                        fileCounter++;
                });
            }
            else {
                fileCounter++;
                if (fileCounter == files.length) {
                    resolve(records);
                }
            }
        });
    });
}