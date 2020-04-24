const collections = require('../config/mongoCollections');
const sportsData = collections.Sports;
var ObjectId = require('mongodb').ObjectId;

module.exports = {
    async getSportById(id) {
        const sportCollection = await sportsData();
        const sportInfo = await sportCollection.findOne({ _id: Object(id) });
        return sportInfo;
    }
}