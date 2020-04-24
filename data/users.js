const collections = require('../config/mongoCollections');
const userData = collections.Users;
const eventsData = collections.events; 
const mapsData = collections.maps; 
const sportsData = collections.Sports;
const mongodb = require("mongodb");
const bcrypt = require('bcryptjs');
var ObjectId = require('mongodb').ObjectId;
const sportFunctions = require("./sports");

// const saltRounds = 16;
module.exports = {

    async addUsertoDB(signupObj) {
        const hashPassword = await bcrypt.hash(signupObj.password.toString(), 16);
        const hashStore = hashPassword.toString();
        const email = signupObj.email;
        const lowerEmail = email.toString().toLowerCase();
        const date = new Date();
        const month = date.getMonth() + 1;
        const registeredDate = month + "/" + date.getDate() + "/" + date.getFullYear();
        const userCollection = await userData();
        const newUser = {
            firstName: signupObj.firstName,
            lastName: signupObj.lastName,
            email: lowerEmail,
            password: hashStore,
            phone: null,
            dob: null,
            gender: null,
            interestedSport:null,
            //profilePicture: null,
            regDate: registeredDate,
            isAdmin: false
        }
        const newUserAdded = await userCollection.insertOne(newUser);
        if (newUserAdded.insertedCount === 0)
            return false;
        return true;
    },


    async adminValid(username)
    {
        const userCollection = await userData();
        const userDataPresent = await userCollection.findOne({ email: username });
        let check = false;
        if(userDataPresent.isAdmin==true)
            check = true;
        return check;    
    },

    async userExistsCheck(email) {
        const userCollection = await userData();
        //const lowerEmail = email.toString().toLowerCase();
        const userPresentInfo = await userCollection.findOne({ email: email });

        if (!userPresentInfo) {
            return false; 
        } else {
            return true;
        }
    },

    async getUserByID(email) {
        const userCollection = await userData();
        const userPresentInfo = await userCollection.findOne({ email: email });
        return userPresentInfo;
    },

    async getUserById(id) {
        const userCollection = await userData();
        const userInfo = await userCollection.findOne({ _id: Object(id) });
        return userInfo;
    },

    /*async getAllFutureEvents() {
        const eventCollection = await eventsData();
        const mapsCollection = await mapsData();
        const dateTime = new Date();
        dateTime.setDate(dateTime.getDate() + 1);
        const futureEvents = await eventCollection.find({
            'dateTime': { $gt: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate() + 1) }
        }).toArray();

        //changing datetime format, fetching user and sport records by id
        await futureEvents.forEach(async event => {
            const dateTime = event.dateTime;
            event.dateTime = dateTime.getMonth() + 1 + "/" + dateTime.getDate() + "/" + dateTime.getFullYear() + " " + dateTime.getHours() + ":" + dateTime.getMinutes();
            const userInfo = await this.getUserById(event.createdBy);
            event.createdBy = userInfo.firstName + " " + userInfo.lastName;
            const sportInfo = await sportFunctions.getSportById(event.sport);
            event.sport = sportInfo.name;
        });
        return futureEvents;
    },*/ 
    async getAllFutureEvents() {
        const eventCollection = await eventsData();
        const mapsCollection = await mapsData();
        const dateTime = new Date();
        dateTime.setDate(dateTime.getDate() + 1);
        const futureEvents = await mapsCollection.find({
            'dateTime': { $gt: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate() + 1) }
        }).toArray();

        //changing datetime format, fetching user and sport records by id
        const allEvents = [];
        for (let i = 0; i < futureEvents.length; i++) {
            const event = futureEvents[i];
            console.log("event");
            console.log(event);
            const dateTime = event.dateTime;
            event.dateTime = dateTime.getMonth() + 1 + "/" + dateTime.getDate() + "/" + dateTime.getFullYear() + " " + dateTime.getHours() + ":" + dateTime.getMinutes();
            eventsId = event.eventsId;
            let eventInfo;
            if (eventsId) {
                eventInfo = await eventCollection.findOne({ _id: eventsId });
            } else {
                console.log("No event id");
                console.log(event);
            }
            event.sport = eventInfo.sports;
            event.createdBy = eventInfo.creatorEmail;
            event.notes = eventInfo.notes;
            event.players = eventInfo.noOfPlayers;
            event.status = eventInfo.status;
            allEvents.push(event);
        }
        return allEvents;
    },
    //kannu functions


    async getUserEvents(userEmail) {
        const userEvents = await events.getEventsByUserEmail(userEmail);
        let allEvents = [];
        for (let i = 0; i < userEvents.length; i++) {
            const event = userEvents[i];
            const dateTime = event.dateTime;
            event.dateTime = dateTime.getMonth() + 1 + "/" + dateTime.getDate() + "/" + dateTime.getFullYear() + " " + dateTime.getHours() + ":" + dateTime.getMinutes();
            const sportInfo = await sports.getSportById(event.sport);
            event.sport = sportInfo.name;
            allEvents.push(event);
        }
        return allEvents;
    },

    async getOtherApprovedEvents(userEmail) {
        const user = await this.getUserByEmailId(userEmail);

        const eventCollection = await eventsData();
        const dateTime = new Date();
        dateTime.setDate(dateTime.getDate() + 1);
        const futureEvents = await eventCollection.find({
            'dateTime': { $gt: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate()) },
            'status': 'approved',
            'createdBy': { $ne: user._id }
        }).toArray();

        //changing datetime format, fetching user and sport records by id
        const filteredEvents = await this.checkConditionsForEvents(futureEvents, userEmail);
        return filteredEvents;
    },

    async checkConditionsForEvents(events, userEmail) {
        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            const dateTime = event.dateTime;
            event.dateTime = dateTime.getMonth() + 1 + "/" + dateTime.getDate() + "/" + dateTime.getFullYear() + " " + dateTime.getHours() + ":" + dateTime.getMinutes();
            const userInfo = await this.getUserById(event.createdBy);
            event.createdBy = userInfo.firstName + " " + userInfo.lastName;
            const sportInfo = await sports.getSportById(event.sport);
            event.sport = sportInfo.name;
            // check if user has sent join request already or no players exists for that event
            if (event.players.length == 0)
                event.reqStatus = "none";
            else {
                for (let j = 0; j < event.players.length; j++) {
                    const player = event.players[j];
                    if (player.email == userEmail) {
                        event.reqStatus = player.status;
                    } else {
                        event.reqStatus = "none";
                    }
                }
            }
        }
        return events;
    },
    
    async checkAdminLogin(username, password) {
        const userCollection = await userData();
        const userDataPresent = await userCollection.findOne({ email: username });
        if (userDataPresent != null && userDataPresent.email === username && userDataPresent.isAdmin) {
            let passCheck = await bcrypt.compare(password, userDataPresent.password);
            if (passCheck) {
                return userDataPresent._id;
            } else {
                return -1;
            }
        } else {
            return -1;
        }
    },

    async loggingTheUser(email, password) {
        const userCollection = await userData();
        const userDataPresent = await userCollection.findOne({ email: email });
        if (userDataPresent != null && userDataPresent.email === email) {
            let passCheck = await bcrypt.compare(password, userDataPresent.password);
            if (passCheck) {
                return userDataPresent._id;
            } else {
                return -1;
            }
        } else {
            return -1;
        }
    },


    async updateProfileData (email, userUpdateInfo) {
        const user = await this.getUserByID(email);
        console.log(user);
        console.log(userUpdateInfo);
        const userCollection = await userData();
        userDataPresent = await userCollection.findOne({email:email});
        console.log(userDataPresent);
        // let userUpdateObj = {
        //     phone: userDataPresent.phone,
        //     DOB: userDataPresent.dob,
        //     gender: userDataPresent.gender,
        //     interestedSport: userDataPresent.interestedSport
        // }
        // if(userUpdateInfo.phoneNumber!=null) {
        //     userUpdateObj = {
        //             $set: {
        //                 phone:userUpdateInfo.phoneNumber,
        //                 DOB: userDataPresent.dob,
        //                 gender: userDataPresent.gender,
        //                 interestedSport: userDataPresent.interestedSport
        //             }
        //     }
        // }
        
        // if(userUpdateInfo.dob!=null) {
        //     userUpdateObj = {
        //         $set: {
        //             phone: userDataPresent.phone,
        //             DOB: userUpdateInfo.dob,
        //             gender: userDataPresent.gender,
        //             interestedSport: userDataPresent.interestedSport
        //         }
        //     }
        // }
        // if(userUpdateInfo.gender!=null) {
        //     userUpdateObj = {
        //         $set: {
        //             phone: userDataPresent.phone,
        //             DOB: userUpdateInfo.dob,
        //             gender: userUpdateInfo.gender,
        //             interestedSport: userDataPresent.interestedSport
        //         }
        //     }
        // }

        // if(userUpdateInfo.sport!=null) {
        //     userUpdateObj = {
        //         $set: {
        //             phone: userDataPresent.phone,
        //             DOB: userUpdateInfo.dob,
        //             gender: userUpdateInfo.gender,\
        //             interestedSport: userUpdateInfo.sport
        //         }
        //     }
        // }
        let userUpdateObj = {  
          phone: userUpdateInfo.phoneNumber,
          dob:userUpdateInfo.dob,
          gender:userUpdateInfo.gender,
          interestedSport: userUpdateInfo.sport
        };
        // let userUpdateObj = {};
        // if(userUpdateInfo.email) {
        //     userUpdateObj = {email: userUpdateInfo.email,};
        // }
        // if(userUpdateInfo.phoneNumber){
        //     userUpdateObj = {phone: userUpdateInfo.phoneNumber,};
        // }
        // if(userUpdateInfo.dob) {
        //     userUpdateObj = {DOB: userUpdateInfo.dob,};
        // }
        // if(userUpdateInfo.gender) {
        //     userUpdateObj = {gender: userUpdateInfo.gender,};
        // }
        // if(userUpdateInfo.sport) {
        //     userUpdateObj = {interestedSport: userUpdateInfo.sport,};
        // }
        console.log(userUpdateObj);
        const updateInfo = await userCollection.updateOne({email: email}, {$set: userUpdateObj});
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
    
        return await this.getUserByID(email);
    }


}