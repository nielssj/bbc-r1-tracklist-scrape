var fs = require("fs");
var cheerio = require("cheerio");

// Scrape tracks from a file
exports.scrapeFromFile = function(filename, encoding, callback) {
    fs.readFile(filename, encoding, function (err,data) {
        // Abort in case of IO error
        if (err) {
            console.log(err);
            callback(null, err);
            return;
        }

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
    });
};