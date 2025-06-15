const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js")


main().then(() =>{
    console.log("connected to database")
}) .catch((err) => {
    console.log(err)
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner : '684470ff8b79e8403575c868'}))
    await Listing.insertMany(initData.data);
    console.log("data initialized");
}

initDB();