
// connexion node Api to cluster Mongo
require('dotenv').config(); // config and import .env file 
const mongoose = require("mongoose");
const Remote_uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PWD}@elieruvinga.nq5dp.mongodb.net/TestElipt`
const connexion_options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

    mongoose.connect(Remote_uri, connexion_options)
        .then(()=>{
            console.log("Api Connect to Remote DataBase");
        })
        .catch(error => console.log("Error: "+ error));
    