const express = require("express");
const router = express.Router();
const collections = require('../config/mongoCollections');
const userDataFromDatabase = collections.Users
const userData = require("../data/users");

router.get('/login', async (req, res) => {
    console.log('/login get');
    console.log(process.env.PASS_ONE); 
    return res.render('login');
})

router.get('/admin', async (req, res) => {
    let check = await userData.adminValid(req.session.userId);
    if (req.session.userId && check == true) {
        try {
            const events = await userData.getAllFutureEvents();
            res.status(200).render('adminHome', { title: "Admin", events: events });
        } catch (e) {
            res.status(404).json({ error: e.message });
        }
    } else {
        return res.render('admin', { title: "Admin" });
    }
})

router.get('/signup', async (req, res) => {
    return res.render('signup', { title: "Signup" });
})

router.get('/', async (req, res) => {
    try {

        console.log("/ get")
        res.redirect('home');

    } catch (e) {
        res.status(404).json({ error: e.message });
    }
})




router.post('/login', async (req, res) => {
    try {
        console.log("reached second login");

        let formData = req.body;
        let check = await userData.loggingTheUser(formData.email, formData.password);
        if (check != -1) {
            req.session.userId = formData.email;
            req.session.AuthCookie = req.sessionID;
            return res.status(200).redirect("home");
        } else {
            res.status(401).render('login', { error: "Wrong Username or Password" });
        }
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
})

router.post('/signup', async (req, res) => {
    try {
        console.log("reached second signup");
        let emailCheck = await userData.userExistsCheck(req.body.email);
        if (emailCheck) {
            res.status(401).render('signup', { error: "User already exists!" });
        } else {
            let signupObj = {
                email: req.body.email,
                firstName: req.body.first_name,
                lastName: req.body.last_name,
                password: req.body.password
            }
            console.log(signupObj);
            check = await userData.addUsertoDB(signupObj);
            if (check = true) {
                const userCollection = await userDataFromDatabase();
                const currentUser = await userCollection.findOne({ email: req.session.email });
                res.redirect('login');
            } else {
                res.status(404).json({ error: "Registration Unsuccessful" });
            }
        }
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
})

router.post('/admin', async (req, res) => {
    try {
        let formData = req.body;
        let check = await userData.checkAdminLogin(formData.username, formData.password);
        if (check != -1) {
            req.session.userId = formData.username;
            req.session.AuthCookie = req.sessionID;
            //console.log(req.session.userId);
            const events = await userData.getAllFutureEvents();
            res.status(200).render('adminHome', { title: "Admin Approval", events: events });
        } else {
            res.status(401).render('admin', { error: "Wrong Admin Username or Password" });
        }
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
})


router.get('/logout', async (req, res) => {
    console.log("reached logout");
    req.session.destroy(function () {
        res.clearCookie('AuthCookie');
        return res.redirect("/");
    });
})

router.get('/adminLogout', async (req, res) => {
    req.session.destroy(function () {
        res.clearCookie('AuthCookie');
        return res.redirect("/home");
    });
})

router.get('/home', async (req, res) => {
    //Will replace the private route above
    try {
        console.log("reached home");
        //let session_ID = req.session.userId;
        //const userObj = await userData.getUserByID(session_ID);
        let userNotLogged;
        let userLogged;
        let currentUserFirst = "";
        if (req.session.userId) {
            userNotLogged = false;
            userLogged = true;
            const userCollection = await userDataFromDatabase();
            //  console.log(req.session.userId)
            currentUser = await userCollection.findOne({ email: req.session.userId });
            currentUserFirst = currentUser.firstName
            //   console.log(currentUser.firstName)

        } else {
            userNotLogged = true;
            userLogged = false;
        }
        return res.status(200).render("home", { title: "Playbook", userNotLogged: userNotLogged, userLogged: userLogged, firstName: currentUserFirst });
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
})



router.get('/profile', async (req, res) => {
    //Venu's Part
    try {
        console.log("reached profile");
        let session_ID = req.session.userId;
        const userObj = await userData.getUserByID(session_ID);
        const userCollection = await userDataFromDatabase();
        let userDataPresent = await userCollection.findOne({ email: session_ID });



        return res.status(200).render("profile", { userObj, title: "My Profile" });
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
})

router.post('/profile', async (req, res) => {
    //Venu's Part
    try {
        console.log("reached profile");
        console.log(req.body.gender);
        let dp = req.body.dp;
        let session_ID = req.session.userId;
        const userCollection = await userDataFromDatabase();
        let updatedUserInfo = req.body;
        let userDataPresent = await userCollection.findOne({ email: updatedUserInfo.email });

        if (!updatedUserInfo.phoneNumber && !updatedUserInfo.gender && !updatedUserInfo.sport && !updatedUserInfo.dob) {
            res.redirect('profile');
        }

        if (!updatedUserInfo.gender) {
            updatedUserInfo.gender = userDataPresent.gender;
        }
        if (!updatedUserInfo.sport) {
            updatedUserInfo.sport = userDataPresent.interestedSport;
        }


        const userObj = await userData.updateProfileData(session_ID, updatedUserInfo);
        return res.status(200).render("profile", { userObj, title: "My Profile" });
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
})



module.exports = router;