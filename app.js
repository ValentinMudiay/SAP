require("dotenv").config();

// Internal routes
const rootApi    = require("./api/index"),
      isLoggedIn = require("./api/authChecker"),
      authApi    = require("./api/spotifyLogin"),
      searchApi  = require("./api/spotifySearch"),
      underConstruction = require("./api/underConstruction");

// App Config
const config     = require("./config/app");
      
// NPM Packages
const path       = require("path"),
      helmet     = require("helmet"),
      express    = require("express"),
      app        = express();

app.use(config.session);
app.use(helmet());


app.use("/", underConstruction, rootApi);
app.use("/login", underConstruction, authApi);
app.use("/search", underConstruction, isLoggedIn.viaSpotify, searchApi);

app.use('/static', express.static(path.join(__dirname, 'public')));
app.listen(config.port, () => console.log(`Listening on port ${config.port}`));