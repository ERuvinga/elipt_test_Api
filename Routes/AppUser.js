// Routers for Authentification of users
const router = require("express").Router();
const multer = require("../middleware/multer-config");
const CtrlUserAuthentification = require("../Controllers/Authentification");
const CtrlUser = require("../Controllers/users");

//Auth User
router.post("/SignUp",  CtrlUserAuthentification.registerNewUser,CtrlUserAuthentification.decodeUserOtp);
router.post("/SignIn", CtrlUserAuthentification.login);
router.post("/ActiveAccount/verifyCode", CtrlUserAuthentification.ConfirmOptCode);
router.put("/ActiveAccount/ConfigAccount", CtrlUserAuthentification.Activation_account);
router.delete("/Delete/:id", CtrlUser.deleteUser);
router.post("/logout", CtrlUser.logout);

//image user
router.post("/UploadImage",multer, CtrlUserAuthentification.uploadImage);


module.exports = router;