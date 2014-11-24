var system = require('system');
var args = system.args;
var url = args[1];

var page = require('webpage').create();

page.settings.resourceTimeout = 10000;
page.open(url, function(status) {
    if (status !== 'success') {
        console.log('Unable to access network');
    } else {
        var ua = page.evaluate(function() {
            return document.getElementsByClassName("segments-list__items")[0].innerHTML;
        });
        console.log(ua);
    }
    phantom.exit();
});