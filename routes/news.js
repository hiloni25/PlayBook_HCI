const express = require("express");
const router = express.Router();
const collections = require('../config/mongoCollections');
const userDataFromDatabase = collections.Users
const userData = require("../data/users");
const newsData = require("../data/news");

router.get('/news', async(req, res) => {
    
    try {
        console.log("reached news");
        let session_ID = req.session.userId;
        console.log(session_ID);
        let articles = {};
        let firstNews = [];
        let userNotLogged;
        let userLogged;
        const userCollection = await userDataFromDatabase();
        let userDataPresent = await userCollection.findOne({email:session_ID});
        console.log(session_ID);
        if(!session_ID) {
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
        console.log("articles"+articles);
        return res.status(200).render("news", { title: "Sports News" , articles:articles, firstNews: firstNews,userNotLogged:userNotLogged, userLogged: userLogged});
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
})

module.exports = router;