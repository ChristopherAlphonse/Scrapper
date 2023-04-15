import cheerio from "cheerio";
import express from "express";
import request from "request";
var app = express();
var port = process.env.PORT || 3000;
app.get("/", function(req, res) {
    var url = req.query.url;
    if (!url) {
        res.send("Please provide a URL");
        return;
    }
    request(url, function(error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            var title = $("title").text();
            var metaDescription = $('meta[name="description"]').attr("content");
            var metaKeywords = $('meta[name="keywords"]').attr("content");
            var canonicalUrl = $('link[rel="canonical"]').attr("href");
            var ogTitle = $('meta[property="og:title"]').attr("content");
            var ogDescription = $('meta[property="og:description"]').attr("content");
            var ogImage = $('meta[property="og:image"]').attr("content");
            var result = {
                title: title,
                metaDescription: metaDescription,
                metaKeywords: metaKeywords,
                canonicalUrl: canonicalUrl,
                ogTitle: ogTitle,
                ogDescription: ogDescription,
                ogImage: ogImage
            };
            res.json(result);
        } else {
            res.send("Error: " + error);
        }
    });
});
app.listen(port, function() {
    console.log("Server running on port ".concat(port));
});
