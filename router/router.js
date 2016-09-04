var express = require("express");
var request = require('request');
var cheerio = require("cheerio");
var router = express.Router();
router.all("/course", function (req, res) {
    var courseNum = req.query.courseNum || req.body.courseNum;
    if (!courseNum) {
        return;
    }
    request("http://www.imooc.com/learn/" + courseNum, function (err, response, body) {
        if (!err && response.statusCode == 200) {
            var $ = cheerio.load(body);
            var title = $("h2").text();
            var chapter = $(".mod-chapters").find("a");
            var link = [];
            for (var i = 0; i < chapter.length; i++) {
                var text = $(chapter[i]).text().replace(/(^\s*)|(\s*$)/g, "").split("\r\n")[0];
                var href = $(chapter[i]).attr("href").split("/");
                var type = href[1];
                var video = href[2];
                link.push({
                    name: text,
                    type: type,
                    videoId: video
                })
            }
            var data = {
                title: title,
                list: link
            };
            res.json(data);
        }
    })
});
router.all("/video", function (req, res) {
    var videoId = req.query.videoId || req.body.videoId;
    var videoDef = req.query.videoDef || req.body.videoDef;
    if (!videoId) return;
    request("http://www.imooc.com/course/ajaxmediainfo/?mid=" + videoId, function (err, response, body) {
        if (!err && response.statusCode == 200) {
            var data = JSON.parse(body);
            res.json(data.data.result.mpath[videoDef]);
        }
    });
});
module.exports = router;