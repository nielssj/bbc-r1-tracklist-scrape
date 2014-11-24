var fs = require("fs");
var childProcess = require("child_process");
var phantomjs = require("phantomjs");
var cheerio = require("cheerio");

// Scrape HTML mark-up for track listing and invoke callback with JSON-array of tracks.
var scrapeList = function(data, callback) {
    // Parse HTML into Cheerio
    var $ = cheerio.load(data);

    // Scrape track information
    var tracks = [];
    var tracksSelect = $(".segment__track");
    tracksSelect.each(function (i, elem) {
        var track = {
            artist: $(this).find("span .artist").html(),
            title: $(this).find("p[property=name]").html(),
            contributors: $(this).find("span[property=contributor] span").html(),
            publisher: $(this).find("abbr[property=publisher] span").html()
        };
        tracks.push(track);
    });

    // Return full track list through callback
    callback(tracks);
};

// Read file content and invoke scrape function using content
exports.scrapeFromFile = function(filename, encoding, callback) {
    fs.readFile(filename, encoding, function (err,data) {
        if(!err) {
            scrapeList(data, callback);
        } else {
            console.log("Failed due to read file, scrape aborted");
            callback(null, err);
        }
    });
};

// Make HTTP request, evaluate page (PhantomJS) and invoke scrape function using html content
exports.scrapeFromUrl = function(url, callback) {
    childProcess.execFile(phantomjs.path, ["pjsscript.js", url], function (err, stdout, stderr) {
        if(!err) {
            scrapeList(stdout, callback);
        } else {
            console.log("Failed to retrieve web page, scrape aborted");
            callback(null, err)
        }
    })
};