var Article = require("../models/Article.js");
var cheerio = require("cheerio");
var request = require('request');
module.exports = function (app) {

    //Scrape articles
    app.get("/scrape", function (req, res) {
        request("https://www.nhl.com/info/teams", function (error, response, html) {
            if (!error && response.statusCode == 200) {
                console.log(html);
              }
            var $ = cheerio.load(html);
            $(".card__content").each(function (i, element) {
                var result = {};

                result.title = $(this)
                    .children(".card__details").children(".card__headlines").children(".card__headline").children(".card__link").children(".card__headline__text")
                    .text();

                result.summary = $(this)
                    .children(".card__details").children(".card__headlines").children(".card__description")
                    .text();

                result.image = $(this)
                    .children("a").children(".card__image").children("img")
                    .attr("src")

                result.link = $(this)
                    .children(".card__details").children(".card__headlines").children(".card__description").children("a")
                    .attr("href")

                Article.create(result)
                    .then(function (dbArticle) {
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        return res.json(err);
                    });
            });
            res.send("Scrape Complete");
        });
    });
}