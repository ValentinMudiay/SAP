const router = require("express").Router(),
      frontendConfig = require("../config/frontend");

router.get("/", (req, res) => {
    res.json(frontendConfig);
});

module.exports = router;