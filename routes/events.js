const collections = require('../config/mongoCollections');
const express = require("express");
const router = express.Router();
const eventData = require("../data/events");
const userData = require("../data/users");
const venues = require('../data/places');
const data = require('../data');
const eventsData = data.events;
const mapsData = data.maps;
const mapsCollectionData = collections.Maps;
const sportsData = collections.Sports;

let arr = [];



router.get('/join', async (req, res) => {
  //console.log("join called")
  const sports = req.query.sport;
  console.log("query fppp " + sports);

  let x = [];
  if (sports) {
     x = await eventsData.getSportCentricEvent(req.session.userId,sports);
  }
  else {
     x = await eventsData.getAllApprovedEvent(req.session.userId);
  }


  const y = await eventData.getMyEvents(req.session.userId);

  const z = await eventData.getEventsJoined(req.session.userId);

  bool1 = false;
  bool2 = false;
  bool3 = false;


  if (x.length == 0) {
    bool1 = true;
  }
  if (y.length == 0) {
    console.log("enter")
    bool2 = true;
  }

  if (z.length == 0) {
    bool3 = true;
  }
  
  res.render('join', { title: "Join an event", x: x, y: y, z: z, bool1: bool1, bool2: bool2, bool3: bool3 });

})

router.post('/join', async (req, res) => {
  const removedEmail = req.body.submit;
  const events = req.body.eventId;
  const sports = req.body.sports;
  console.log("The sport selected is " + sports + " other values are " + removedEmail + " events " + events)



  if (removedEmail) {
    const eventID = events.toString().split(',')
    const x = await eventsData.removePlayerFromEvent(removedEmail, req.session.userId, eventID[0]);
    res.redirect('join');
  } else {

    res.redirect('/join?sport=' + sports);
  }
})

router.get('/events', async (req, res) => {
  try {
    const userEvents = await userData.getUserEvents(req.session.userId);
    const otherEvents = await userData.getOtherApprovedEvents(req.session.userId);
    res.status(200).render('events', { title: "Events", userEvents: userEvents, otherEvents: otherEvents });
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
})


router.get('/venues', async (req, res) => {

  res.render('bookEvent', { title: "Book an event" });

})

router.post('/maps', async (req, res) => {
  // console.log("get user id");

  // console.log(req.session); 
  creatorEmail = req.session.userId;
  sports = req.body.sports;
  location = req.body.location;
  date = req.body.date;
  noOfPlayers = req.body.noofplayers;
  notes = req.body.description;

  if (sports && location && date && noOfPlayers) {
    //  console.log("entered"); 
    const eventList = await eventsData.createEvents(creatorEmail, sports, location, date, notes, noOfPlayers, status = 'approved', playersList = []);

    //   console.log("event list"); 
    // console.log(eventList.insertedId);  
    eventsId = eventList.insertedId;
  }

  //also get userid to put in database and a status..
  const places = await venues.getPlaygrounds(sports, location, date);

  //read database maps- 


  timeJsonObj = { time: ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00'] };

  for (eachPlace in places) {
    placeInfo = places[eachPlace];

    mapsTime = await mapsData.getMapsByName(placeInfo.name, date);
    //console.log(mapsTime);
    //console.log(timeJsonObj.time);
    abc = timeJsonObj.time;

    newtimeJsonObj = {};
    xyz = [];
    if (mapsTime != null) {
      for (i in abc) {
        if (abc[i] != mapsTime) {
          xyz.push(abc[i]);

        }
      }
      //console.log("xyz");
      //console.log(xyz);  
      newtimeJsonObj.time = xyz;
      // console.log(newtimeJsonObj);   
    }




    // console.log("new time json obj"); 
    // console.log(timeJsonObj); 

    if (newtimeJsonObj.time) {
      //  console.log("new time json exists");
      places[eachPlace].timeJson = newtimeJsonObj;
    }
    else {
      places[eachPlace].timeJson = timeJsonObj;
    }

    //timeJsonObj.time.splice( idx, 0, mapsTime);   
    //console.log(timeJsonObj); 


    abcObj = { name: placeInfo.name, address: placeInfo.formatted_address, rating: placeInfo.rating, eventsId: eventsId, date: date };

    arr[eachPlace] = abcObj;
  }


  abc = await res.render('places', { title: "Sports Connect", places: places });
  //console.log("bye"); 

})

router.post('/myGames', async (req, res) => {
  // console.log(req.body.submit+"PKOJ");


  const x = req.body.submit;
  const SessionId = req.session.userId;
  // console.log("My games")
  const test = eventsData.addPlayersToEvent(x, SessionId);
  // console.log("Player added in DB")
  res.render('myGames', { x: x, test: test });
})

router.post('/bookingInfo', async (req, res) => {
  //    console.log("bi");

  //console.log(arr);  
  index = req.body.submit;
  time = req.body.time;
  name = arr[index].name;
  address = arr[index].address;
  rating = arr[index].rating;
  eventsId = arr[index].eventsId;
  date = arr[index].date;
  //console.log(name, address, rating, time);  

  if (time && name && address && rating) {
    const mapsList = await mapsData.createMaps(eventsId, name, address, rating, date, time);
    //const eventList = await eventsData.createEvents(sports, location, date, time, notes, noOfPlayers);
  }

  out = await res.render('booked', { title: "Event Requested" });
})


router.post('/updateEvent', async (req, res) => {
  //   console.log('update event'); 
  // console.log(req.body);
  await eventData.eventUpdateStatus(req.body.eventId, req.body.status);
  const events = await userData.getAllFutureEvents();
  res.status(200).render('adminHome', { title: "Admin", events: events });
})

router.post('/joinEvent', async (req, res) => {
  await eventData.addPlayersToEvent(req.body.eventId, req.session.userId);
  res.redirect("/events");
})

module.exports = router; 