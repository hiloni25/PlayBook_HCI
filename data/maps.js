const mongoCollections = require("../config/mongoCollections");  
const maps = mongoCollections.maps; 
const ObjectId = require("mongodb").ObjectID;  

module.exports = {
    async createMaps(eventsId, name , address , rating , date, time){
        console.log("entered create maps"); 
        try{

        const mapsCollection = await maps(); 
        console.log("hi"); 
        var d = new Date(date);
        console.log("d");
        console.log(d);
        /*var parts = d.split(" ");
        console.log(parts);
        var months = {Jan: "01",Feb: "02",Mar: "03",Apr: "04",May: "05",Jun: "06",Jul: "07",Aug: "08",Sep: "09",Oct: "10",Nov: "11",Dec: "12"};
        var abc = parts[3]+"-"+months[parts[1]]+"-"+parts[2];*/
       
        //var str = $.datepicker.formatDate('yy-mm-dd',d);
        console.log("Date in other format"); 
        console.log(d);   

        let new_maps =    
        {
           eventsId: eventsId, 
           name: name,
           address: address,
           rating: rating,
           date: date,
           time: time,
           dateTime: d 
            //_id: id, //how to get id? 
        };   

        const insertmapsInfo = await mapsCollection.insertOne(new_maps);
        if (insertmapsInfo.insertedCount === 0) throw "Could not add maps";  

        console.log("Succesfully added given maps to mongodb database"); 
        return insertmapsInfo;    
    }
    catch(e){
        console.log(e);
    }
    },

    async getMapsByName(name,date){ 
        try{
        console.log("entered get maps by name");
        console.log(name);
        console.log(date); 
        
        if(!name){
            throw 'Error-Input name is not given'  
        }

        if(!date){
            throw 'Error-Input date is not given'
        }
        const mapsCollection = await maps(); 

        console.log("finding");  
        const mapsByName = await mapsCollection.findOne({ name: name, date: date });   
        console.log("maps by name")    
        console.log(mapsByName);    

        if (mapsByName === null)  
        {
            throw "Error-No maps with that id";     
        }
         
        return mapsByName.time;     

    }
    catch(e){
        console.log(e); 
    }
}} 
