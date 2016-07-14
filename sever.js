var express = require('express'),
    app = express(),
    request = require('request');

//GoldMinerPulse API urls
var demo_base = "https://www.goldminerpulse.com/_demo789/edp-api-v3a.php?",
    valid_dates = 'https://www.goldminerpulse.com/_demo789/valid-dates-api.php';

//serve client 
app.use(express.static(__dirname + '/public'));

//routes for querys and valid dates 
app.get('/edp-api-v3a.php', function(req, res) {
    var date = req.query.m,
        query = request(demo_base + 'm=' + date);

    query.pipe(res);
    query.on('end', function() {
        res.end();
    });
    app.get('/valid-dates-api.php', function(req, res) {
        var query = request(valid_dates);
        query.pipe(res);
        query.on('end', function(){
            res.end();
        });
    });

});


app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
    console.log("server is listening...");
});
