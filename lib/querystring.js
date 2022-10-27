const url = require("url");

exports.getQueryParameters = (req) => {
    let interval = "daily";
    let date = "";
    let search = "";
    let showrep = false;

    var qs = url.parse(req.url, true).query;
    if (qs.interval) {
        interval = qs.interval;
    }
    if (qs.date) {
        date = qs.date;
    }
    if (qs.search) {
        search = qs.search;
    }
    if (qs.showrep) {
        showrep = (qs.showrep == "on") ? true : false;
    }

    return {
        interval,
        date,
        search,
        showrep
    };
}