// get tracks
// create/publish playlists

const log = require("./log");
const axios = require("axios");

const spotify = require("../config/spotify");

// add tracks
const PlaylistService = {
    createNewPlaylist: function(user, token, details) {

    },

    republishPlaylist: function() {

    },

    getTracks: function(tracksUrl) {
        const url = tracksUrl + "?limit=10";
    },

    createPlaylistFromTracks: function(user, token, details) {
        const {name, description, public, tracks} = details;

        return createEmptyPlaylist(name, description, public, user, token);

        

    },


};

function createEmptyPlaylist(name, description, public, user, token) {

    const data = {
        "name": name,
        "public": public,
        "description": description || spotify.playlist.defaultDescription // Add validation on description - i.e. no " "
    };

    const url = `https://api.spotify.com/v1/users/${user}/playlists`;

    const options = {
        "method": "post",
        "url": url,
        "data": JSON.stringify(data),
        "headers": {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json",
        },
        "json": true
    };

    log.debug("Playlist.createEmptyPlaylist() -> Creating playlist: " + name);
    return sendRequest(options)
    .then(response => {
        log.debug("Playlist.createEmptyPlaylist() -> Successfully created playlist", response);
    })
    .catch(err => console.error(err));
}

function sendRequest(options) {
    return axios(options)
    .then(response => {
        console.log(response.data);
        return(response.data);
    })
    .catch(err => console.error(err));
}

module.exports = PlaylistService;