const router = require("express").Router();
const log = require("../services/log");
const playlist = require("../services/playlist");
const user = require("../services/user");

router.post("/", (req, res) => {
    console.log("Save request received -> ", req.body);
    
    log.debug("Getting Spotify User Id...");

    // Can move this logic into its own middleware and add
    // to the save route

    // By the time we reach this code, user should be authenticated
    // and the user ID should be known
    
    if (req.session.user_id !== undefined && req.session.access_token !== undefined) {
        createPlaylist(req.session.user_id)
        .then(response => {
            // if response.ok 
            res.send("ok");
        })
        .catch(err => log.debug(err));

        
    }

    // After logging in, the session user id will be undefined
    // We will need to ask Spotify for it
    else if(req.session.user_id === undefined && req.session.access_token !== undefined) {
        user.getUserId(req.session.access_token)
        .then(userId => {
            req.session.user_id = userId;
            log.debug("User Id retrieved from Spotify");

            return createPlaylist(req.session.user_id);
        })
        .then(response => {
            // if response.ok 
            res.send("ok");
        })
        .catch(err => {
            log.debug("Could not get user Id...");
            log.debug(err);
            res.send("done");
        });
    }

    // User hasnt connected their Spotify account
    else {
        throw new Error("Spotify User Id is needed to create a playlist, " +
                    "but it could not be retrieved. No Spotify access token.");
    }

    function createPlaylist(userId) {
        const { tracksUrl, totalTracks } = req.body;

        const playlistDetails = {
            name: "SAP TEST",
            description: "test desc",
            public: false,
            tracks: tracksUrl,
            totalTracks: totalTracks,
        
        };
    
        return playlist.createPlaylistFromTracks(
            userId,
            req.session.access_token,
            playlistDetails
        );
    }

    function userIdIsKnown() {
        return req.session.user_id !== undefined;
    }

    function userIsAuthenticated() {
        return req.session.access_token !== undefined;
    }
});

module.exports = router;