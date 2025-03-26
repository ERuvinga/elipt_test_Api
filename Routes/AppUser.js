// Routers for Authentification of users
const router = require("express").Router();
const multer = require("../middleware/multer-config");
const CtrlUserAuthentification = require("../Controllers/Authentification");
const CtrlUserAuthorization= require("../Controllers/Authentification/Autorizations");
const CtrlUser = require("../Controllers/users");

//Auth User
router.post("/SignUp",  CtrlUserAuthentification.registerNewUser,CtrlUserAuthentification.decodeUserOtp);
router.post("/SignIn", CtrlUserAuthentification.login);
router.post("/ActiveAccount/verifyCode", CtrlUserAuthentification.ConfirmOptCode);
router.put("/ActiveAccount/ConfigAccount", CtrlUserAuthentification.Activation_account);
router.delete("/Delete/:id", CtrlUserAuthorization.CheckAutorizationUser, CtrlUser.deleteUser);
router.post("/logout", CtrlUserAuthorization.CheckAutorizationUser,CtrlUser.logout);

//image user
router.post("/UploadImage",multer, CtrlUserAuthentification.uploadImage);


module.exports = router;