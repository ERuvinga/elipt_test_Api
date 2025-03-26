// nodemailer importing
const nodemailer = require("nodemailer");

// modelsusers 
const modelOfUsers = require("../Models/Users"); // import model of Users

// controller Check Auth user
exports.deleteUser =(req, res)=>{
        //search user in dataBase
        console.log(req.params);
        modelOfUsers.findOne({_id:req.params.id})
        .then(userDatas=>{
            if(userDatas){
                console.log(userDatas)
                modelOfUsers.deleteOne({_id:req.params.id}).then(()=>console.log("user deleted"))           
            }
            else{
                res.status(404).json({msg:"utilisateur inconu"});
            }
           
        })
        .catch(error =>{
            console.log(error);
            res.status(500).json({msg:"Erreur lors de la suppression"});
        }) 

};

// controller Check Auth user
exports.logout =(req, res)=>{
    //search user in dataBase
    console.log(req.body);
    modelOfUsers.updateOne({_id:req.body.id},{
        $set:{
            socketID:null
        }
    })
    .then(()=>{
        console.log("user Logout")
        res.status(200).json({msg:"User Logout"});
    })

    .catch((error)=>{
        console.log(error);
        res.status(500).json({msg:"Deconnexion echouée, Error Server"});
    })
};

exports.SignUp = (req, res) =>{
    const DatasOfForm = req.body;
    console.log(DatasOfForm);

    // create Transport of nodemail
    const transport = nodemailer.createTransport({
        service:'Gmail',
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASSWORD
        }
    }) 

    const newUser = new modelOfUsers(DatasOfForm); // created news user with datas of formulaire
    newUser.save() // saving new objet in data base
        .then((Userdatas)=> {
            console.log(Userdatas);
           
            res.json({message: "'success': New User created"});
            // option of sending mail
            let mailOptions ={
                from:process.env.EMAIL_USER,
                to:DatasOfForm.email,
                subject:"Création de compte reussi,",
                text:`Cher(e) ${DatasOfForm.fname} ${DatasOfForm.lname},voici votre Code`,
            };

                // Send a email message to user
            transport.sendMail(mailOptions,(error, infos)=>{
                    if(error){
                    return console.log(`Error : ${error}`);
                    };
            console.log(`Message sending ${infos}`)
        });
    })
    .catch(error =>{
        console.log(error);
        res.status(501);
        res.json({msg: "Echec de la creation: email existant"});
    });
};
