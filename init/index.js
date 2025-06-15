require('dotenv').config({ path: '../.env' });

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js")
const dbUrl = process.env.ATLASDB_URL

main().then(() =>{
    console.log("connected to database")
}) .catch((err) => {
    console.log(err)
})

async function main() {
    await mongoose.connect(process.env.ATLASDB_URL)
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner : '684ee5c2bd45b729d2c8bf9c'}))
    await Listing.insertMany(initData.data);
    console.log("data initialized");
}

initDB();