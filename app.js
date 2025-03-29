
// include connect mongoose to cluster mangodb
require("./Utils/db/mongo_db");

const express = require('express');
const app = express();  // methode express

//Routes 
const testRoute = require('./Routes/test');
const ProductRoute = require("./Routes/Product");
const AppUserRoute = require("./Routes/AppUser")

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUSH, PUT');
    next();
});

app.use('/test', testRoute); // router checking if remote server runing
app.use('/Product', ProductRoute);

// userRoutes
app.use("/AppUsers", AppUserRoute);


module.exports = app;
