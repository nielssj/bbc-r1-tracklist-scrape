var fs = require("fs");
var childProcess = require("child_process");
var phantomjs = require("phantomjs");
var cheerio = require("cheerio");

var scrapeList = function(data, callback) {
    // Parse HTML into Cheerio
    var $ = cheerio.load(data);

    // Scrape track information
    tracks = [];
    var tracksSelect = $(".segment__track");
    tracksSelect.each(function (i, elem) {
        track = {
            artist: $(this).find("span .artist").html(),
            title: $(this).find("p[property=name]").html(),
            contributors: $(this).find("span[property=contributor] span").html(),
            publisher: $(this).find("abbr[property=publisher] span").html()
        };
        tracks.push(track);
    });

    // Return full track list through callback
    console.log(tracks);
    callback(tracks);
};

// Scrape tracks from a file
exports.scrapeFromFile = function(filename, encoding, callback) {
    fs.readFile(filename, encoding, function (err,data) {
        // Abort in case of IO error
        if (err) {
            console.log(err);
            callback(null, err);
            return;
        }

        scrapeList(data, callback);
    });
};

exports.scrapeFromUrl = function(url, callback) {
    childProcess.execFile(phantomjs.path, ["pjsscript.js"], function (err, stdout, stderr) {
        if(!stderr) {
            scrapeList(stdout, callback);
        } else {
            console.log("Failed to retrieve web page: " + stderr);
            callback(null, stderr)
        }
    })
};