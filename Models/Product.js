//Counter model datas of users

const mongoose = require("mongoose");
const ProductShema = mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    idOfUser:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    curency:{
        type:String,
        default:"USD"
    },

});

module.exports = mongoose.model("product", ProductShema);
