
// modelOfProduct
const modelOfProduct = require("../Models/Product"); // import model of Products
exports.CreateProduct =(req, res)=>{
    //create new product in dataBase
    
    console.log(req.body);
    console.log(req.UserAutorization._doc._id);
    
    const product = new modelOfProduct({
        title:req.body.title,
        description:req.body.description,
        image:req.body.image,
        idOfUser:req.UserAutorization._doc._id,
        price:req.body.price,
    });
    
    console.log(product)
    
    try{product.save()
    .then(() =>{
            res.status(200).json({msg:"Creation du produit reussit"});
    })
    .catch(error =>{
        console.log(error);
        res.status(500).json({msg:`Echec de la creation du produit ${error}`});
    }) }
          catch(error){
            console.log(error)
            res.status(500).json({msg:`Echec de la creation du produit ${error}`});
        } 
    };
     

exports.getProducts =(req, res)=>{
    console.log(req.UserAutorization._doc._id);

        //search products of user in dataBase
        modelOfProduct.find({idOfUser: req.UserAutorization._doc._id})
        .then(ProductsOfUser =>{
                res.status(200).json({msg:"Your Products", data:ProductsOfUser});
            
        })
        .catch(error =>{
            console.log(error);
            res.status(500).json({error});
        })        
};

exports.getOtherProducts =(req, res)=>{
    console.log(req.UserAutorization._doc._id);

        //search products of user in dataBase
        modelOfProduct.find({idOfUser: {$ne :req.UserAutorization._doc._id}})
        .then(ProductsOfUser =>{
                res.status(200).json({msg:"Products for Others users", data:ProductsOfUser});
            
        })
        .catch(error =>{
            console.log(error);
            res.status(500).json({error});
        })        
};
// controller Check Auth user
exports.deleteProduct =(req, res)=>{
        //dele product in dataBase
        modelOfProduct.deleteOne({_id:req.params.id})
        .then((userFund) =>{
            console.log("product deleted");
            console.log(userFund);
            res.status(200).json("product Deleted");

        })
        .catch(error =>{
            console.log(error);
            res.status(500).json({error});
        })        
};
