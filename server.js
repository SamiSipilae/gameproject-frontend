var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override'),
    hostname = process.env.HOSTNAME || 'localhost',
    port = parseInt(process.env.PORT, 10) || 8080,
    publicDir = process.argv[2] || __dirname ,
    path = require('path');

app.get("/", function (req, res) {
  res.sendFile(path.join(publicDir, "/index.html"));
});

app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(publicDir));
app.use(errorHandler({
  dumpExceptions: true,
  showStack: true
}));

var proxy = require('express-http-proxy');

// New hostname+path as specified by question:
var apiProxy = proxy('localhost:8090/', {
    forwardPath: function (req, res) {
        return require('url').parse(req.baseUrl).path;
    }
});
app.use("/ajax/*", apiProxy);

console.log("Simple static server showing %s listening at http://%s:%s", publicDir, hostname, port);
app.listen(port, hostname);