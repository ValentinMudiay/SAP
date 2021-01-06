require("dotenv").config();

const helmet     = require("helmet"),
      config     = require("./config/app"),
      isLoggedIn = require("./api/authChecker"),
      authApi    = require("./api/spotifyLogin"),
      rootApi    = require("./api/index"),
      searchApi  = require("./api/spotifySearch"),
      express    = require("express"),
      app        = express();

app.use(config.session);
app.use(helmet());
app.use("/", rootApi);
app.use("/login", authApi);
app.use("/search", isLoggedIn.viaSpotify, searchApi);

app.listen(config.port, () => console.log(`Listening on port ${config.port}`));