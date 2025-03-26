// Routers for Create Product
const router = require("express").Router();
const CtrlUserAuthorization= require("../Controllers/Authentification/Autorizations");
const CtrlProduct = require("../Controllers/products");

//Products
router.get("/getProduct", CtrlUserAuthorization.CheckAutorizationUser, CtrlProduct.getProducts);
router.get("/getOtherProduct", CtrlUserAuthorization.CheckAutorizationUser, CtrlProduct.getOtherProducts);
router.post("/Create", CtrlUserAuthorization.CheckAutorizationUser, CtrlProduct.CreateProduct);
router.delete("/delete/:id", CtrlUserAuthorization.CheckAutorizationUser, CtrlProduct.deleteProduct);


module.exports = router;