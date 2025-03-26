const router = require("express").Router();

router.get("/", (req, res)=>{
    res.status(200).json({datas:{msg: "Operationnal Api", dev: "Elie Ruvinga"}});
})


module.exports = router;