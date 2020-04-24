const session = require('express-session');
const express = require('express');
const app = express();
const path = require('path')
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const cookieParser = require("cookie-parser");
const news= require('./data/news');
app.use(cookieParser());
app.use('/public', static);
app.use('/js', express.static(__dirname + '/js'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname + '/views'));


app.use(session({ secret: "auth user", resave: false, saveUninitialized: true, AuthCookie: {} }))
app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

// app.get("/", function(req, res, next) {
//     const session = req.session;
//     // check if user is authenticated, redirect to /private
//     if (session.AuthCookie && session.userId == "admin") {
//         res.redirect("/admin");
//     } else if (session.AuthCookie) {
//         res.redirect("/private");
//     } else {
//         //redirect to login page
//         res.render('login', { title: "Login" });
//     }
// });


app.use('/private', function(req, res, next) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    if (req.session.userId) {
        return next();
    } else {
        res.status(403).redirect('error');
    }
});

// app.use('/news', async(req, res) => {
    
//     try {
//         console.log("reached news");
//         const articles = await news.getAllData();
//         console.log("articles");
//         return res.status(200).render("news", { title: "Sports News" , articles:articles});
//     } catch (e) {
//         res.status(404).json({ error: e.message });
//     }
// })

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(process.env.PORT||3000, () => { 
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000"); 
});