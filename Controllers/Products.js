
// modelOfProduct
const modelOfProduct = require("../Models/Product"); // import model of Products

//Lib
require("dotenv").config();

// controller Check Auth user
exports.deleteUser =(req, res)=>{
        //search user in dataBase
        modelOfUsers.deleteOne({_id:req.params.id})
        .then((userFund) =>{
            console.log("user deleted");
            console.log(userFund);
            res.status(200).json("user Deleted");

        })
        .catch(error =>{
            console.log(error);
            res.status(500).json({error});
        })        
};

exports.getAllUsers =(req, res)=>{

        //search AllStudents in dataBase
        modelOfUsers.find({idOfAdmin: req.Autorization.userId})
        .then(userFund =>{
                res.status(200).json({msg:"Tout les utilisateurs du reseau", AllUsers:userFund});
            
        })
        .catch(error =>{
            console.log(error);
            res.status(500).json({error});
        })        
};


exports.NewUser =(req, res)=>{
    modelOfUsers.find({idOfAdmin: req.Autorization.userId})
    .then(userFund =>{
        const formDatas ={
            email:req.body.email,
            tel:req.body.tel,
            name:`${req.body.SecondeName} ${req.body.name}`,
            idOfAdmin:req.Autorization.userId,
            idCompteur:userFund.length+1
        }
        //create new user in dataBase
        const user = new modelOfUsers(formDatas)
        user.save()
        .then(() =>{
                res.status(200).json({msg:"Creation d'utilisateur reussit"});
        })
        .catch(error =>{
            console.log(error);
            res.status(500).json({msg:"cet adresse mail ou cet numero existe deja dans la base de donnee, veuillez rensignez un autre!"});
        }) 
    })
    .catch(error =>{
        console.log(error);
        res.status(500).json({msg: "Error server"});
    });
       
};
