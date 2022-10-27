const fs = require('fs');
const fm = require('./filemanager');
const jd = require('./juliandate');

exports.createRecord = (table, model) => {
    let html = String(table);
    let records = "";
    const adate = new Date(parseInt(model.access_time)).toDateString();
    const mdate = new Date(parseInt(model.modification_time)).toDateString();
    html = html.replace("[FILERECORD]", `<td>${model.volser}</td><td>${model.file_name}</td><td>${model.label_type}</td><td>${model.encryption}</td><td>${model.vol1}</td><td>${model.file_size}</td><td>${adate}</td><td>${mdate}</td>`);
    model.data_sets.forEach(e => {
        records += `<tr><td>${e.dsn}</td><td>${jd.convertJulianDay(e.creation_date)}</td><td>${jd.convertJulianDay(e.expiration_date)}</td><td>${e.recfm}</td><td>${e.block_length}</td><td>${e.lrecl}</td><td>${e.job_name}</td><td>${e.job_step}</td></tr>`;
    });
    return html.replace("[RECORDS]", records);
}

exports.getHtmlInterval = (html, interval) => {
    let content = "";
    const intervals = ["daily", "weekly", "monthly", "yearly"];
    let selectedIndex = 0;

    //find selected interval
    for (let index = 0; index < intervals.length; index++) {
        const element = intervals[index];
        if (element == interval) {
            selectedIndex = index;
        }
    }

    //build markup with checked selected interval
    for (let index = 0; index < intervals.length; index++) {
        const element = intervals[index];
        let checked = "";
        if (index == selectedIndex)
            checked = "checked";

        content += `<input onclick="onChange()" name="interval" type="radio" value="${element}" ${checked}> <span class=interval>${element}</span>`;
    };

    html = html.replace("[INTERVALS]", content);
    return html;
}

exports.noRecords = (table, date, search) => {
    let error = "";

    if (!search)
        search = "";

    error = String(table)
        .replace("[FILERECORD]", `<td colspan=8>Search term '${search}' at location ${date} returned no results.</td>`)
        .replace("[RECORDS]", "<tr><td colspan=8>No records found</td></tr>");
    return error;
}

exports.getMenu = (html, dir, qsDate) => {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, { withFileTypes: true }, (err, directories) => {
            if (err) {
                reject(err);
            }
            let menumarkup = "";
            let date = qsDate;
            let dirList = directories
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name)
                .sort()
                .reverse();

            //find selected date
            let selectedIndex = 0;
            if (date) {
                for (let index = 0; index < dirList.length; index++) {
                    const directory = dirList[index];
                    if (directory == date) {
                        selectedIndex = index;
                        break;
                    }
                }
            }

            //build markup for menu of dates
            for (let index = 0; index < dirList.length; index++) {
                const directory = dirList[index];
                if (index == selectedIndex) {
                    menumarkup += `<div><input class="date" onclick=onChange() type=radio name=date value=${directory} checked> ${directory} </div>`;
                    date = directory;
                }
                else
                    menumarkup += `<div><input class="date" onclick=onChange() type=radio name=date value=${directory}> ${directory} </div>`;
            };

            html = html.replace("[MENU]", menumarkup);
            resolve({html, date});
        });
    });
}

exports.repFile = async (html, dir, showrep) => {
    const rep = await fm.getRepFiles(dir);
    let repHtml = "";
    let repInputChecked = "";
    if (showrep) {
        repHtml = (rep) ? `<hr><hr><h3>REP FILE CONTENT</h3>${rep}`: "";
        repInputChecked = "checked"
    }
    html = html.replace("[REP]", repHtml);
    html = html.replace("[SHOWREP]", `<input onclick="onChange()" type="checkbox" name="showrep" ${repInputChecked}>`);

    return html;
}

exports.search = (html, params) => {
    html = html.replace("[SEARCH]", `<input name="search" type="text" value="${params.search}" placeholder="search">`);
    return html;
}

