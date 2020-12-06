require("dotenv").config();

const cParser = require("cookie-parser");
const config  = require("./config/app");

const authApi = require("./api/login");
const rootApi = require("./api/index");

const express = require("express");
const app     = express();

app.use(cParser());
app.use(rootApi);
app.use("/login", authApi);

app.listen(config.port, () => console.log(`Listening on port ${config.port}`));