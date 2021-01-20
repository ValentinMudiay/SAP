const router = require("express").Router();

const axios = require("axios");
const spotify = require("../config/spotify");

router.post("/", (req, res) => {
    console.log("save request received -> ", req.body);

    const {playlistId, tracksUrl, totalTracks} = req.body;

    // const url = req.body.playlist_id + "?limit=10";

    // const options = {
    //     url: url,
    //     method: "GET",
    //     headers: {
    //         Authorization: "Bearer " + spotify.token.clientCredentialsToken,
    //         "Content-Type"  : "application/x-www-form-urlencoded"
    //     },
    //     json: true
    // };

    // axios(options)
    // .then(response => {
    //     console.log(response.data);
    //     res.send(response.data);
    // })
    // .catch(err => console.error(err));

    res.status(200).send("done");
});

module.exports = router;