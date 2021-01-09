const router = require("express").Router(),
      Pool   = require("pg").Pool,
      pool   = new Pool(),
      log    = require("../services/log");

pool.on("error", (error, client) => {
    log.debug("Error with DB pool");
    process.exit(-1);
});


router.post("/", (req, res) => {
    const email = req.body.email;

    pool.connect((error, client, done) => {
        if(error) throw error;

        const query = "INSERT INTO email(email) VALUES($1)";

        client.query(query, [email], (err, res) => {
            done();
            
            if(err) log.debug(err);
            else log.debug(`Entered ${email} into db`); // TODO: Check res.rowCount === 1 from db
        });
    });
    
    res.send("success");
});

module.exports = router;