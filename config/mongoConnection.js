const MongoClient = require("mongodb").MongoClient;
const dotenv = require('dotenv');
dotenv.config();
const mongoConfig = {
    /*serverUrl: "mongodb://localhost:27017/",*/
   // serverUrl: "mongodb+srv://venu:gunners1234@cluster0-v0zjz.mongodb.net/test",
   //serverUrl: "mongodb+srv://"+ process.env.USER_NAME +":" + process.env.PASS_ONE + "@cluster0-v0zjz.mongodb.net/test",
    serverUrl:""+process.env.DATABASE_URL, 
    database: "PlayBook_Hills",

};

console.log(mongoConfig)

let _connection = undefined;
let _db = undefined;

module.exports = async () => {
    if (!_connection) {
        _connection = await MongoClient.connect(mongoConfig.serverUrl, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        _db = await _connection.db(mongoConfig.database);
    }

    return _db;
}; 