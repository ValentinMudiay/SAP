require("dotenv").config();

const helmet  = require("helmet"),
      config  = require("./config/app"),
      authApi = require("./api/spotifyLogin"),
      rootApi = require("./api/index"),
      express = require("express"),
      app     = express();

app.use(config.session);
app.use(helmet());
app.use(rootApi);
app.use("/login", authApi);

app.listen(config.port, () => console.log(`Listening on port ${config.port}`));