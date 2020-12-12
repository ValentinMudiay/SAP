const { Pool }  = require("pg"),
      dbConfig  = require("../config/db"),
      pool      = new Pool(dbConfig),
      session   = require("express-session"),
      pgSession = require("connect-pg-simple")(session);


module.exports = ({
    debug:          process.env.DEBUG,
    port:           process.env.PORT || 3000,
    origin:         "http://localhost:3001",
    
    init: function() {
        const sessionConfig = {
            store:             new pgSession({pool}),
            secret:            process.env.COOKIE_SECRET,
            resave:            false,
            saveUninitialized: false,
            cookie: {
                secure:        false,
                httpOnly:      true,
                maxAge:        1000 * 3600
            }
        };

        this.session = session(sessionConfig);
        return this;
    },
}).init();