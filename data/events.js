const collections = require('../config/mongoCollections');
const eventsData = collections.events;
const mapsData = collections.maps;
var ObjectId = require('mongodb').ObjectId;

module.exports = { 
    async eventUpdateStatus(eventId, status) {  
        
        const updatedEvent = {
            status: status
        }
        const eventCollection = await eventsData();
        //const mapsCollection = await mapsData(); 
        const res = await eventCollection.updateOne({ _id: ObjectId(eventId) }, { $set: updatedEvent });
       
    },

    async createEvents(creatorEmail, sports, location, date, notes, noOfPlayers, status, playersList) {
        
        try {
            const eventsCollection = await eventsData();

            let new_events =
            {
                creatorEmail: creatorEmail,
                sports: sports,
                location: location,
                date: date,
                notes: notes,
                noOfPlayers: noOfPlayers,
                status: status,
                playersList: playersList
                //_id: id, //how to get id? 
            };

            const inserteventsInfo = await eventsCollection.insertOne(new_events);
            if (inserteventsInfo.insertedCount === 0) throw "Could not add likes";

            return inserteventsInfo;
        }
        catch (e) {
            console.log(e);
        }
    },

    async removePlayerFromEvent(userEmail, sessionID, eventID) {

        const eventCollection = await eventsData();
        const userEvent = await eventCollection.find({ _id: ObjectId(eventID) });

        if (userEvent) {
            await eventCollection.updateOne({ _id: ObjectId(eventID) }, { $pull: { "playersList": { email: userEmail } } });
            return true;
        }

        return false;
    },

    // async removePlayerFromEvent(userEmail, sessionID, eventID) {
    //     // const eventCollection = await eventsData();
    //     // console.log("REMOVE FUN")
    //     //const userEvent = await eventCollection.find({creatorEmail:userEmail}).toArray();
    //     //  console.log(userEmail);
    //     console.log(eventID+"event ID idar aagaya hai");
    //     const eventCollection = await eventsData();
    //     const userEvent = await eventCollection.find({ creatorEmail: sessionID }).toArray();

    //     console.log("jkl" + userEvent.length)

    //     for (let i = 0; i < userEvent.length; i++) {
    //         let players = [];
    //         players = userEvent[i].playersList;
    //         let Found = false;
    //         console.log(players.length);
    //         players.forEach(element => {
    //             console.log("in")
    //             if (element.email === userEmail) {
    //                 Found = true;
    //             }

    //         });

    //         if (Found === true) {
    //             console.log("remove true" + userEvent[i]._id)
    //             await eventCollection.updateOne({ _id: ObjectId(userEvent[i]._id) }, { $pull: { "playersList": { email: userEmail } } });
    //             console.log("remoc")
    //         }
    //     }


    // },

    async getMyEvents(userEmail) {
        const eventCollection = await eventsData();
        const userEvent = await eventCollection.find({ creatorEmail: userEmail }).toArray();

        let result = []
        for (let i = 0; i < userEvent.length; i++) {
            let userInfo = {
                "_id": "",
                "creatorEmail":"",
                "sport": "",
                "date": "",
                "time": "",
                "location": "",
                "groundName": "",
                "address": "",
                "playersList": ""
            }

            let data = userEvent[i];

            if (data.status === "approved") {
                userInfo._id = data._id;
                userInfo.creatorEmail = data.creatorEmail;
                userInfo.sport = data.sports;
                userInfo.date = data.date;
                userInfo.location = data.location;
                userInfo.playersList = data.playersList;

                let mapsCollection = await mapsData()
            //    console.log(mapsCollection) 
                let mapInfo = await mapsCollection.findOne({ eventsId: event._id });
            //    console.log("Hey")
            //    console.log(mapInfo)

                if(mapInfo != null){
                userInfo.time = mapInfo.time;
                userInfo.location = event.location;
                userInfo.groundName = mapInfo.name;
                userInfo.address = mapInfo.address; 
                }  

                
                result.push(userInfo);
            }

        }

        return result;

    },

    async getEventsJoined(userEmail) {
        const eventCollection = await eventsData();
        const userEvent = await eventCollection.find({ "playersList.email": userEmail }).toArray();
        let result = []
        for (let i = 0; i < userEvent.length; i++) {
            let userInfo = {
                "_id": "",
                "creatorEmail":"",
                "sport": "",
                "date": "",
                "time": "",
                "location": "",
                "groundName": "",
                "address": "",
                "playersList": ""
            }

            let data = userEvent[i];

            if (data.status === "approved") {
                userInfo._id = data._id;
                userInfo.creatorEmail = data.creatorEmail;
                userInfo.sport = data.sports;
                userInfo.date = data.date;

                let mapsCollection = await mapsData()
            //    console.log(mapsCollection) 
                let mapInfo = await mapsCollection.findOne({ eventsId: event._id });
            //    console.log("Hey")
            //    console.log(mapInfo)

                if(mapInfo != null){
                userInfo.time = mapInfo.time;
                userInfo.location = event.location;
                userInfo.groundName = mapInfo.name;
                userInfo.address = mapInfo.address; 
                } 

                //userInfo.location = data.location;
                //userInfo.playersList = data.playersList;
                result.push(userInfo);
            }

        }

        return result;
    },

    async getAllApprovedEvent(emailId) {


        let eventCollection = await eventsData();
        let res = await eventCollection.find({}).toArray();
        let result = [];
        
        let j = 0;
        for (let i = 0; i < res.length; i++) {
            event = res[i];
            let playerName = event.playersList;
            var Found = false;
            if (playerName !== undefined) {
                playerName.forEach(element => {
                    if (element.email === emailId) {
                        Found = true;
                    }

                });
            }
           
            if (event.status == "approved" && event.noOfPlayers > 0 && Found == false && event.creatorEmail !== emailId) {
                let eventInfo = {
                    "_id": "",
                    "sport": "",
                    "creator": "",
                    "date": "",
                    "time": "",
                    "location": "",
                    "groundName": "",
                    "address": ""
                }
                eventInfo._id = event._id;
                eventInfo.sport = event.sports;
                eventInfo.creator = event.creatorEmail;
                eventInfo.date = event.date;
                //console.log("event")
                //console.log(event) 
                let mapsCollection = await mapsData()
            //    console.log(mapsCollection) 
                let mapInfo = await mapsCollection.findOne({ eventsId: event._id });
            //    console.log("Hey")
            //    console.log(mapInfo)

                if(mapInfo != null){
                eventInfo.time = mapInfo.time;
                eventInfo.location = event.location;
                eventInfo.groundName = mapInfo.name;
                eventInfo.address = mapInfo.address;
                } 
                result.push(eventInfo); 
            }
        }
        

        return result;
    },

    async addPlayersToEvent(eventId, userEmail) {
        const newPlayer = {
            email: userEmail,
            cid: eventId,
            status: 'Request sent'
        }

        const arr = [];

        const eventCollection = await eventsData();

        await eventCollection.updateOne({ _id: ObjectId(eventId) }, { $addToSet: { playersList: newPlayer } });

        return true;
    },

    async getEventsByUserEmail(email) {
        var user = require('../data/users');
        const userInfo = await user.getUserByEmailId(email);
        const eventCollection = await eventsData();
        const userEvents = await eventCollection.find({ createdBy: userInfo._id }).toArray();
        return await userEvents;
    },

    async getSportCentricEvent(emailId, sportFilter) {


        let eventCollection = await eventsData();
        let res = await eventCollection.find({}).toArray();
        let result = [];
        
        let j = 0;
        for (let i = 0; i < res.length; i++) {
            event = res[i];
            let playerName = event.playersList;
            var Found = false;
            if (playerName !== undefined) {
                playerName.forEach(element => {
                    if (element.email === emailId) {
                        Found = true;
                    }

                });
            }
           
            if (event.status == "approved" && event.noOfPlayers > 0 && Found == false && event.creatorEmail !== emailId && event.sports === sportFilter) {
                let eventInfo = {
                    "_id": "",
                    "sport": "",
                    "creator": "",
                    "date": "",
                    "time": "",
                    "location": "",
                    "groundName": "",
                    "address": ""
                }
                eventInfo._id = event._id;
                eventInfo.sport = event.sports;
                eventInfo.creator = event.creatorEmail;
                eventInfo.date = event.date;
                let mapsCollection = await mapsData()
                let mapInfo = await mapsCollection.findOne({ eventsId: event._id });
               
                if(mapInfo != null){
                eventInfo.time = mapInfo.time;
                eventInfo.location = event.location;
                eventInfo.groundName = mapInfo.name;
                eventInfo.address = mapInfo.address;
                } 
                result.push(eventInfo); 
            }
        }
        

        return result;
    },

}