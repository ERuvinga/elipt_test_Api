//Logical Methods for Login and registers routers
// Nodemail configuration
const nodemailer = require("nodemailer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs")

//Lib and functions
const otp_generator = require("otp-generator");
require("dotenv").config();
const bcrypt = require("bcrypt"); // salting password Methode
const jwt = require("jsonwebtoken");
const SALTE_PWD = 10;

//Models
const modelOfUsers = require("../../Models/Users"); // import model of Others user
const sendemail = async (name,email, otpCode)=>{
    // option of sending mail
    // create Transport of nodemail
     const transport = nodemailer.createTransport({
             service:'Gmail',
                 auth:{
                     user:process.env.EMAIL_USER,
                     pass:process.env.EMAIL_PASSWORD
                     }
                 });  

    let mailOptions ={
     from:process.env.EMAIL_USER,
     to:email,
     subject:"Success!, new account Created",
     html:`Bonjour! <b style="font-size:1.2em; color:#227ABD;">${name}</b>, voici le code d'activation de votre compte: <p><b style="font-size:1.5em; color:#00cc00">${otpCode} </b></p> <p>ce code doit rester pivate</p>`,
 };

 // Send a email message to user
 return transport.sendMail(mailOptions,(error, infos)=>{
     if(error){
         console.log(`Error : ${error}`)
        return false;
     };
     console.log(`Message sending ${infos}`);
     return true;
 });
}

//Register New User
exports.registerNewUser = (req, res, next) =>{
    const DatasOfForm = req.body;
    console.log(DatasOfForm);

    const newUser = new modelOfUsers(DatasOfForm); // created news user with datas of formulaire
    newUser.save() // saving new objet in data base
    .then((datas)=> {
        console.log(datas);
        next()
    })
    .catch(error =>{
        console.log(error);
        res.status(501);
        res.json({msg: "Echec de la creation du compte, email existant ou requis"});
    });
};

//get otp code
exports.decodeUserOtp =(req, res)=>{
    const idUser = req.body;
    console.log(idUser);
    const userNotFoundMsg = "Utilisateur non trouvé";
    
    modelOfUsers.findOne({email: idUser.email})
    .then(async (userDatas)=>{
        if(userDatas){
            console.log("user Found");
            console.log(userDatas);
            const otp= otp_generator.generate(6, { upperCaseAlphabets: false, specialChars: false });

            modelOfUsers.updateOne({email: userDatas.email},{$set:{
                ActivationToken:otp
            }})
            .catch(()=> {
                res.status(500).json({msg:"Erreur server"}) 
            });  

            //send Email
            await sendemail(`${userDatas.fname} ${userDatas.lname}`,userDatas.email, otp); 
            res.status(201).json({msg:"Success,  New User created and otp code sent"});
        }

        else{
            res.status(404).json({msg:userNotFoundMsg}) 
        }
    })
    .catch(error =>{
         console.log(`Error Database ${error}`) // if Error  Connexion to dataBase
         res.status(500).json({msg:"Erreur server"}) 
      });
}

exports.login = (req, res) => {
    const InAuthorizationMsg = "email ou mot de pass d'utilisateur Incorrect";
    const messageInactifAccount = "Ce Compte n'est pas encore Activé";

    // cheking type of Account
    modelOfUsers.findOne({email:req.body.email})
            .then(userFound =>{
                console.log(userFound);
                if(userFound === null){
                    res.status(401).json({msg:InAuthorizationMsg}) 
                }

                else{
                    if(userFound.isActive){
                        bcrypt.compare(req.body.password, userFound.passWord)
                        .then(valid =>{
                            if(!valid){
                                res.status(401).json({msg:InAuthorizationMsg})  
                            }

                            else{
                                // Create Token
                            const Token = jwt.sign({
                                    idUser:userFound._id,
                                    mail:userFound.email,
                                },process.env.TOKEN_SIGN);
                                res.status(200).json({msg:"Utilisateur trouvé", Token, DataUser:userFound});
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            res.status(500).json({msg:"Error Server Token"})
                        }
                            )
                    }

                    else{
                        res.status(401).json({msg:messageInactifAccount})
                    }  
                }
            })
            .catch(error =>{
                 console.log(`Error Database ${error}`) // if Error  Connexion to dataBase
                 res.status(500).json({msg:"Erreur server"}) 
              });
};



//Confirm Otp code
exports.ConfirmOptCode =(req, res)=>{
    const idUser = req.body;
    console.log(idUser);
    // get User datas
    modelOfUsers.findOne({$and:[{email: idUser.email}, {ActivationToken:idUser.token}]})
    .then(userDatas=>{
        if(userDatas){
            res.status(200).json({msg:"Valid Code of user"});
        }
        else{
           res.status(401).json({msg:"user not Found / otpCode Invalid"}); 
        }
    })
    .catch(error =>{
         console.log(`Error Database ${error}`) // if Error  Connexion to dataBase
         res.status(500).json({msg:"Erreur server"}) 
      });
}

//Updating password and image Profile
exports.Activation_account = (req, res) => {
    const idUser = req.body //get datas user
    console.log(idUser);

    // SEARCHING USER IN DATABASE
        try{
             // hashing PassWord
            
            modelOfUsers.findOne({$and:[{email: idUser.email}, {ActivationToken:idUser.token}]})
            .then(userFund =>{
                if(userFund){
                    if(userFund.isActive){
                        res.status(403).json({msg:"Compte actif, Connectez-vous!"});
                    }
                    else{
                        if(!req.body.password){ // if password is not found
                            throw "password is Required"
                        }
                        
                        if(!idUser.avatar){ // if avatar is not found
                            throw "profile avatar is Required"
                        }
            
                        bcrypt.hash(req.body.password, SALTE_PWD)
                        .then(passwordHash =>{
                            console.log(passwordHash)
                            modelOfUsers.updateOne({$and:[{email: idUser.email}, {ActivationToken:idUser.token}]},{
                                $set:{
                                    passWord:passwordHash,
                                    isActive: true,
                                    cover:idUser.avatar,
                                    ActivationToken:null
                                }
                            })
                            .then(()=>{
                                res.status(200).json({msg:"Activation du compte Reussi", Updating:true, actif:true});
                            })
        
                            .catch((error)=>{
                                console.log(error);
                                res.status(500).json({msg:"Activation echouée, Error Server"});
                            })  
                        })
                        .catch(error => {
                            console.log(`Erreur lors du hashing du password \n ${error}`)
                            res.status(500).json({msg:"Impossible d'activer le compte"});
                        });
                   }
                }
                else{
                        console.log("Aucun Compte Correspondant");
                        res.status(404).json({msg:"Echec d'activation, identifiants non trouvés"});                        
                }
            })
            .catch(error =>{
                console.log(error)
                res.status(400).json({msg:`Error: ${error}`});
            })
        }
        catch{(error)=>{
            console.log(error);
            res.status(403).json({msg:`Error: ${error}`});
        }}
    }

    exports.HashingPassWord = (req, res) => {
       // hashing PassWord
       bcrypt.hash("Eliasone02@", SALTE_PWD)
       .then(passwordHash =>{
        console.log(passwordHash);
        res.status(200).json({passwordHash});
           })
           
       .catch(error => {
           console.log(`Erreur lors du hashing du password \n ${error}`)
           res.status(500).json({msg:"Impossible d'activer le compte -> Error Server lors du hashing du password"});
       });
}  


exports.uploadImage =(req, res)=>{

    // cloudinary configuration
    cloudinary.config({
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_API_SECRET,
    });
    try{

        cloudinary.uploader.upload(req.file.path,{
            folder:"elipt_images_test",
            transformation:{width:300, height:300, crop:'limit'}
        }).then((datas)=>{

            // delete local image
            fs.unlinkSync(req.file.path);

            // send Response to client
            res.status(201);
            res.json({Url: datas.url,secureUrl: datas.secure_url}); 
        }).catch(error=>{
            console.log(error);
                // respond
            res.status(501);
            res.json({msg: "Deployement image Error Server"}); 
        })

    }
    catch(error){
    // respond
    res.status(501);
    res.json({msg: "Deployement image Error Server"}); 
    }

}