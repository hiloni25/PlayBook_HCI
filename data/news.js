const axios = require('axios');
const collections = require('../config/mongoCollections');
const userDataFromDatabase = collections.Users;

//returns news articles based on the sport chosen by the user
const getAllData = async (sportsKey) => {
    //const userCollection = await userDataFromDatabase();
    console.log(sportsKey + "The sport");
    let url;
    if(!sportsKey) {
         url = 'https://newsapi.org/v2/top-headlines?country=us&category=sports&sortBy=relevancy&apiKey=df3e49ce0dbe4aa1ac58cf1f606f85f4';
    } else {
         url = 'https://newsapi.org/v2/everything?q=' + sportsKey + '&apiKey=df3e49ce0dbe4aa1ac58cf1f606f85f4';
    }

    const allArticles = [];
    const res = await axios.get(url);

    for(let i=1;i<res.data.articles.length;i++) {
        allArticles.push(res.data.articles[i]);
    }
    return allArticles;
}

//returns generalized sports news articles when the user is not logged in
const getGeneralSportsNews = async () => {
    //const userCollection = await userDataFromDatabase();
    //console.log(sportsKey + "The sport");
    const url = 'https://newsapi.org/v2/top-headlines?country=us&category=sports&sortBy=relevancy&apiKey=df3e49ce0dbe4aa1ac58cf1f606f85f4';
    const allArticles = [];
    const res = await axios.get(url);

    for(let i=1;i<res.data.articles.length;i++) {
        allArticles.push(res.data.articles[i]);
    }
    return allArticles;
}


const  getFirstSportNews = async (sportsKey) => {

    let url;
    if(!sportsKey) {
         url = 'https://newsapi.org/v2/top-headlines?country=us&category=sports&sortBy=relevancy&apiKey=df3e49ce0dbe4aa1ac58cf1f606f85f4';
    } else {
         url = 'https://newsapi.org/v2/everything?q=' + sportsKey + '&apiKey=df3e49ce0dbe4aa1ac58cf1f606f85f4';
    }

    const res = await axios.get(url);
    return res.data.articles[0];
}

const  getFirstGeneralSportNews = async () => {

    const url = 'https://newsapi.org/v2/top-headlines?country=us&category=sports&sortBy=relevancy&apiKey=df3e49ce0dbe4aa1ac58cf1f606f85f4';
    const res = await axios.get(url);
    return res.data.articles[0];
}


module.exports = {
    getAllData,
    getGeneralSportsNews,
    getFirstSportNews,
    getFirstGeneralSportNews
};