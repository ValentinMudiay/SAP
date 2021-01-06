const router = require("express").Router();
const config = require("../config/app");
const path   = require("path");

router.get("/", (req, res, next) => {
    if(config.underConstruction) {
        const underConstructionPage = path.join(__dirname, "../public", "under_construction.html");
        res.sendFile(underConstructionPage);
        return;
    }
    
    next();
    return;
});

module.exports = router;