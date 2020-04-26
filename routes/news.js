const express = require("express");
const router = express.Router();
const collections = require('../config/mongoCollections');
const userDataFromDatabase = collections.Users
const userData = require("../data/users");
const newsData = require("../data/news");

router.get('/news', async (req, res) => {

    try {

        let session_ID = req.session.userId;
        let articles = {};
        let firstNews = [];
        let userNotLogged;
        let userLogged;
        const userCollection = await userDataFromDatabase();
        let userDataPresent = await userCollection.findOne({ email: session_ID });

        if (!session_ID) {
            userNotLogged = true;
            userLogged = false;
            firstNews = await newsData.getFirstGeneralSportNews();
            articles = await newsData.getGeneralSportsNews();
        } else {
            userNotLogged = false;
            userLogged = true;
            firstNews = await newsData.getFirstSportNews(userDataPresent.interestedSport);
            articles = await newsData.getAllData(userDataPresent.interestedSport);
        }

        return res.status(200).render("news", { title: "Sports News", articles: articles, firstNews: firstNews, userNotLogged: userNotLogged, userLogged: userLogged });
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
})

router.post('/news', async (req, res) => {

    let session_ID = req.session.userId;
    let articles = {};
    let firstNews = [];
    let userNotLogged;
    let userLogged;
    console.log("Inside post news")
    sport = req.body.sports;
    console.log("Sport selected " + sport);

    try {

        if (!session_ID) {
            userNotLogged = true;
            userLogged = false;
        } else {
            userNotLogged = false;
            userLogged = true;
        }

        firstNews = await newsData.getFirstSportNews(sport);
        articles = await newsData.getAllData(sport);

        return res.status(200).render("news", { title: "Sports News", articles: articles, firstNews: firstNews, userNotLogged: userNotLogged, userLogged: userLogged, sport: sport });
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
})

module.exports = router; 