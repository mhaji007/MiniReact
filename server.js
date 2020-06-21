var express = require('express');
var app = express();

var port = 5000;

app.use(express.static("./"));

// Our first route
app.get('/', function (req, res) {
    res.sendFile('./index.html');
});

// Listen to port 
app.listen(port, function () {
    console.log(`Server listening on port ${port}!`);
});