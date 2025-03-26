// user models datas 
const mongoose = require("mongoose");
const UsersShema = mongoose.Schema({
    fname :{
        type:String,
        default:"",
        required:true
    },

    lname :{
        type:String,
        default:"",
        required:true
    },
    createAt:{
        type:Number,
        default:Date.now()
    },

    passWord:{
        type:String,
        default:""
    },

    isActive:{
        type:Boolean,
        default: false
    },
    cover:{
        type:String,
        default:null
    },

    //Coordo Datas
    email:{
        type:String,
        unique:true,
        required:true,
    },
    //Token datas
    ActivationToken:{
        type:String,
        default:null
    }
});

module.exports = mongoose.model("user", UsersShema);
