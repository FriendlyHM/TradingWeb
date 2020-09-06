const mongoose = require("mongoose");

const listing = new mongoose.Schema({
    username: String,
    subject: String,
    description: String,
    imageURL: String,
    created: String
});

listings = mongoose.model("Listings", listing);


module.exports = listings;
