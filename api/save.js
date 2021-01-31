const router = require("express").Router();
const log = require("../services/log");
const playlist = require("../services/playlist");
const { getFormattedDateStr } = require("../services/utils");

router.post("/", (req, res) => {
    log.debug("POST /save -> Save request received ", req.body);

    const { tracksUrl, name, dateTimeStr } = req.body;

    const today = getFormattedDateStr(dateTimeStr);

    const playlistDetails = {
        name: name + " - Saved on " + today,
        description: "test desc",
        public: false,
        tracks: tracksUrl
    };
    
    playlist.createPlaylistFromTracks(
        req.session.user_id,
        req.session.access_token,
        playlistDetails
    )
    .then(response => {
        // if response.ok 
        res.send("ok");
    })
    .catch(err => log.debug(err));
    
});

module.exports = router;