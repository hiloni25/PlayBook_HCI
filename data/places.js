const axios = require('axios'); 
//const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=football+playground+in+Hoboken&key=AIzaSyAgCmZMYCBmuNLO_gJOxCWzobV3DLvtevY'
//const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=basketball+court+in+Hoboken&key=AIzaSyAgCmZMYCBmuNLO_gJOxCWzobV3DLvtevY'
//const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=playgrounds+in+Hoboken&key=AIzaSyAgCmZMYCBmuNLO_gJOxCWzobV3DLvtevY';
//const JerseyUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=playgrounds+in+Jersey&key=AIzaSyAgCmZMYCBmuNLO_gJOxCWzobV3DLvtevY'

const getPlaygrounds = async (sports, location, date) => {
    console.log(sports); 
    console.log(location); 
    console.log(date);   
    //const url =  'https://maps.googleapis.com/maps/api/place/textsearch/json?query=Soccer+playground+in+Newyork+City&key=AIzaSyAgCmZMYCBmuNLO_gJOxCWzobV3DLvtevY'    
    //const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=Football+playground+in+Union+City&key=AIzaSyAgCmZMYCBmuNLO_gJOxCWzobV3DLvtevY' 
    //const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=Soccer+playground+in+Union+City&key=AIzaSyAgCmZMYCBmuNLO_gJOxCWzobV3DLvtevY'
    //const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=BasketBall+playground+in+Hoboken&key=AIzaSyAgCmZMYCBmuNLO_gJOxCWzobV3DLvtevY'
    //const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=Baseball+playground+in+Union+City&key=AIzaSyAgCmZMYCBmuNLO_gJOxCWzobV3DLvtevY' 
  
    //const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=playground+in+Hoboken&key=AIzaSyAgCmZMYCBmuNLO_gJOxCWzobV3DLvtevY'
    const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query='+sports+'+playground+in+'+location+'+City&key=AIzaSyAgCmZMYCBmuNLO_gJOxCWzobV3DLvtevY'; 
    console.log(url);  
    const res = await axios.get(url);    
    

    return res.data.results;    
}  


module.exports = {
    getPlaygrounds
};