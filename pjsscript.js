var page = require('webpage').create();

page.settings.resourceTimeout = 10000;
page.open('http://www.bbc.co.uk/programmes/b04p24h0', function(status) {
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