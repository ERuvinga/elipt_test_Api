// nodemailer importing
const nodemailer = require("nodemailer");

// modelsusers 
const modelOfUsers = require("../Models/Users"); // import model of Users

// controller Check Auth user
exports.deleteUser =(req, res)=>{
        //search user in dataBase
        console.log(req.params);
        console.log(req.UserAutorization._doc._id);
        modelOfUsers.findOne({_id:req.params.id})
        .then(userDatas=>{
            if(userDatas){
                console.log(userDatas)
                modelOfUsers.deleteOne({_id:req.params.id}).then(()=>{
                    console.log("user deleted")
                    res.status(201).json({msg:"utilisateur efface"});
                })           
            }
            else{
                res.status(404).json({msg:"utilisateur inconu"});
            }
           
        })
        .catch(error =>{
            console.log(error);
            res.status(500).json({msg:"Erreur lors de la suppression: id Incorect"});
        }) 

};

// controller Check Auth user
exports.logout =(req, res)=>{
    //search user in dataBase
    console.log(req.body);

   try {
    if(!req?.body?.id){
        res.status(500).json({msg:"Deconnexion echouée id: is required"});
    }
    modelOfUsers.findOne({_id:req.UserAutorization._doc._id})
    .then((userFound)=>{
        console.log(userFound);
        console.log("user Logout")
        res.status(200).json({msg:"Sucess: User Logout"});
    })

    .catch((error)=>{
        console.log(error);
        res.status(500).json({msg:"Deconnexion echouée",error:error});
    })}
    catch{(error)=>{
        res.status(500).json({msg:"Deconnexion echouée", error:error});
    }}
};
