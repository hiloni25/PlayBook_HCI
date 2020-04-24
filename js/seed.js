const dbConnection = require('../config/mongoConnection');
const collections = require('../config/mongoCollections');
const userData = collections.Users;
const events = collections.events;
const maps = collections.maps; 

const main = async() => {
    const db = await dbConnection(); 
    await db.dropDatabase();
    // ADD ADMIN
    const userCollection = await userData();

    const admin = {
        firstName: "admin",
        lastName: "admin", 
        email: "admin@playbook.edu", 
        password: "$2a$16$m5aGsAddgak/Z4tDgDa1FuaEs.RufKVq8G7hkq2/ovyt/Lp5tBVdG",
        phone: null,
        dob: null, 
        gender: null,
        interestedSport:null,  
        profilePicture: null,
        regDate: "01/15/2018", 
        isAdmin: true
    }
    await userCollection.insertOne(admin);

    const user1={
        firstName:"Hiloni",
        lastName:"Mehta",
        email:"hiloni@stevens.edu",
        password:"$2a$16$UKYBV.VFVqIbh44l/gdAS.PMdKz.bHMV9DUQQEjkRRrob/FHJmFsC",
        phone:"5512609988",
        dob:"Sep 19, 2018",
        gender:"Female",
        interestedSport:"football",
        profilePicture:null,
        regDate:"12/15/2019",
        isAdmin:false}
    
    await userCollection.insertOne(user1); 

    const user2 = {firstName:"Venu",
                    lastName:"Gopal",
                    email:"venu@stevens.edu",
                    password:"$2a$16$OY3KkNDfyjGA1ruGw3qO8.fya.4l8vnbZHmH2VHl1VsyVJ08Wt8eq",
                    phone:"5512609988",
                    dob:null,
                    gender:"Male",
                    interestedSport:null,
                    profilePicture:null,
                    regDate:"12/15/2019",
                    isAdmin:false 
        
    }
    await userCollection.insertOne(user2);

    const user3={
        firstName:"Ved",
        lastName:"Jadhav",
        email:"ved@stevens.edu",
        password:"$2a$16$2dKIc.h1YnNcybCw7AyUh.J1l9ViHvBkRnB2WjjXnMb02tQvCfPVi",
        phone:"45278292",
        dob:"Aug 15, 2018",
        gender:"Male",
        interestedSport:"soccer",
        profilePicture:null,
        regDate:"12/15/2019",
        isAdmin:false} 

    await userCollection.insertOne(user3);

    
    // const insertInfo2 = await userCollection.insertOne(user2);
    // if (insertInfo2.insertedCount > 0)
    //     userId2 = insertInfo2.insertedId;


    // CREATE SPORTS
    // const sport1 = {
    //     name: "Football"
    // };
    // const sport2 = {
    //     name: "American Football"
    // };
    // const sport3 = {
    //     name: "Basketball"
    // };
    // const sport4 = {
    //     name: "Baseball"
    // };
    // let sportId1, sportId2, sportId3, sportId4;
    // const sportCollection = await sports();
    // const sportInfo1 = await sportCollection.insertOne(sport1);
    // if (sportInfo1.insertedCount > 0)
    //     sportId1 = sportInfo1.insertedId;

    // const sportInfo2 = await sportCollection.insertOne(sport2);
    // if (sportInfo2.insertedCount > 0)
    //     sportId2 = sportInfo2.insertedId;

    // const sportInfo3 = await sportCollection.insertOne(sport3);
    // if (sportInfo3.insertedCount > 0)
    //     sportId3 = sportInfo3.insertedId;

    // const sportInfo4 = await sportCollection.insertOne(sport4);
    // if (sportInfo4.insertedCount > 0)
    //     sportId4 = sportInfo4.insertedId;




    // CREATE EVENTS
    /*const eventCollection = await events();
    let date1 = new Date();
    date1.setDate(date1.getDate() + 4);
    const event1 = {
        createdBy: userId1,
        sport: sportId1,
        dateTime: date1,
        ground: "Hoboken-GroundA",
        notes: "Personal notes 1",
        duration: "2 hrs",
        players: "12",
        status: "approved"
    }
    let date2 = new Date();
    date2.setDate(date2.getDate() + 9);
    const event2 = {
        createdBy: userId1,
        sport: sportId1,
        dateTime: date2,
        ground: "Jersey-GroundC",
        notes: "Personal notes 2",
        duration: "4 hrs",
        players: "8",
        status: "pending"
    }
    let date3 = new Date();
    date3.setDate(date3.getDate() + 6);
    const event3 = {
        createdBy: userId2,
        sport: sportId2,
        dateTime: date3,
        ground: "Hoboken-GroundB",
        notes: "Personal notes 3",
        duration: "3 hrs",
        players: "11",
        status: "rejected"
    }
    let date4 = new Date();
    date4.setDate(date4.getDate() + 13);
    const event4 = {
        createdBy: userId2,
        sport: sportId3,
        dateTime: date4,
        ground: "JerseyHeights-GroundE",
        notes: "Personal notes 4",
        duration: "4 hrs",
        players: "5",
        status: "pending"
    }
    let date5 = new Date();
    date5.setDate(date5.getDate() + 20);
    const event5 = {
        createdBy: userId3,
        sport: sportId4,
        dateTime: date5,
        ground: "hoboken-GroundF",
        notes: "",
        duration: "2 hrs",
        players: "5",
        status: "pending"
    }
    await eventCollection.insertOne(event1);
    await eventCollection.insertOne(event2);
    await eventCollection.insertOne(event3);
    await eventCollection.insertOne(event4);
    await eventCollection.insertOne(event5);*/

    //events-
    const eventsCollection = await events();
    event1 = {
        creatorEmail:"ved@stevens.edu",
        sports:"BasketBall",
        location:"Jersey",
        date:"Dec 17, 2019",
        notes:"Basketball game in jersey",
        noOfPlayers:"6",
        status:"pending",
        playersList:[]}

    let mapsId1; 
    let eventsInfo1 = await eventsCollection.insertOne(event1);
    if (eventsInfo1.insertedCount > 0){
        mapsId1 = eventsInfo1.insertedId;}

    event2 = {creatorEmail:"ved@stevens.edu",
        sports:"Soccer",
        location:"Newyork",
        date:"Dec 18, 2019",
        notes: "deee",
        noOfPlayers:"4",
        status:"approved",
        playersList:[{email:"hiloni@stevens.edu", 
                      cid:"5df5a84e593e2d3ca49386c6", 
                      status:"Request sent"}]}

    let mapsId2;
    let eventsInfo2 = await eventsCollection.insertOne(event2);
    if (eventsInfo2.insertedCount > 0){
        mapsId2 = eventsInfo2.insertedId;}


    event3 = {creatorEmail:"ved@stevens.edu", 
               sports:"Baseball",
               location:"Newyork",
               date:"Dec 19, 2019",
                notes:"xnlw",
                noOfPlayers:"6",
                status:"pending",
                playersList:[]
        }

    let mapsId3; 
    let eventsInfo3 = await eventsCollection.insertOne(event3);
    if (eventsInfo3.insertedCount > 0){
        mapsId3 = eventsInfo3.insertedId;} 

    event4 = {creatorEmail:"hiloni@stevens.edu", 
               sports:"BasketBall",
              location:"Newyork",
              date:"Dec 23, 2019",
              notes:"dce",
              noOfPlayers:"4",
              status:"pending",
              playersList:[]
        }

        let mapsId4;
        let eventsInfo4 = await eventsCollection.insertOne(event4);
        if (eventsInfo4.insertedCount > 0){
            mapsId4 = eventsInfo4.insertedId;} 



    //MAPS-
    const mapsCollection = await maps();
    maps1 = {    
        eventsId:mapsId1, //objectId??
        name:"Children Park And Basketball Court",
        address:"125 Corbin Ave, Jersey City, NJ 07306, United States",
        rating:4.2,
        date:"Dec 17, 2019",
        time:"10:00",
        dateTime:"2019-12-17T00:00:00.000+00:00" }

    await mapsCollection.insertOne(maps1); 

    maps2 = {
    eventsId:mapsId2,
    name:"Soccer Field",
    address:"New York, NY 10014, United States",
    rating:5,
    date:"Dec 18, 2019",
    time:"12:00",
    dateTime:"2019-12-18T00:00:00.000+00:00"
    } 
    await mapsCollection.insertOne(maps2); 


    maps3 = {eventsId:mapsId3,
           name:"Chelsea Park",
            address:"West 27th Street &, 9th Ave, New York, NY 10001, United States",
            rating:4.4,
            date:"Dec 19, 2019",
            time:"10:00",
            dateTime:"2019-12-19T00:00:00.000+00:00"}

    await mapsCollection.insertOne(maps3);  

    maps4 = {eventsId:mapsId4,
        name:"West 4th Street Courts",
        address:"272 6th Ave, New York, NY 10012, United States",
        rating:4.5,
        date:"Dec 23, 2019",
        time:"10:00", 
        dateTime:"2019-12-23T00:00:00.000+00:00"}

    await mapsCollection.insertOne(maps4); 


    

    console.log('Done seeding database');
    await db.serverConfig.close();
};

main().catch(console.log);