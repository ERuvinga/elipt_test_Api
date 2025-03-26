//Counter model datas of users

const mongoose = require("mongoose");
const ProductShema = mongoose.Schema({
    Title:{
        type:String,
        required:true,
        unique:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    price:{
        type:String,
        required:true,
    },
    curency:{
        type:String,
        default:"USD"
    },

});

module.exports = mongoose.model("product", ProductShema);
