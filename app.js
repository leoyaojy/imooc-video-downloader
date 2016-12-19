var express = require("express");
var path = require("path");
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var app = express();
var route = require("./router/router");
app.set('views', "./views");
app.set("view engine", 'jade');
app.use(favicon(__dirname+'/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));
if (app.get("env") === "development") {
    app.locals.pretty = true;
}
app.get("/", function (req, res) {
    res.render("index",{
        title:"慕课网视频解析下载"
    })
});
app.use("/get",route);
app.listen(port, function () {
    console.log("app start at the port " + port)
});

