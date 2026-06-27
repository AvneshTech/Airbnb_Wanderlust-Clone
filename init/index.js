if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

let dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/project";

main().then(() => {
    console.log("connect successfully");
    initDB();
}).catch(err => console.log(err));

async function main(){
    await mongoose.connect(dbUrl);
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner : new mongoose.Types.ObjectId("653e5b2c69f458a54fdf0bdf")}));
    await Listing.insertMany(initData.data);
    console.log("data was inserted");
};