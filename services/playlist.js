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

        const items = [];

        return createEmptyPlaylist(name, description, public, user, token)
        .then(playlist => {
            // return addItemsToPlaylist(items, playlist.id, token);
            return getItemsFromExistingPlaylist(tracks, true, items, token)
            .then(response => {
                log.debug("Number of track uris retrieved", response.length);
            });
        })
        .catch(err => log.debug(err));

        

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
        log.debug("Playlist.createEmptyPlaylist() -> Successfully created playlist");
        // log.debug("Playlist created response ->", response);
    })
    .catch(err => console.error(err));
}

function addItemsToPlaylist(items, playlist, token) {

    const data = {
        "uris": items
    };

    const url = `https://api.spotify.com/v1/playlists/${playlist}/tracks`;

    const options = {
        "method": "post",
        "url": url,
        "data": JSON.stringify(data),
        "headers": {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
    };

    return sendRequest(options)
    .then(response => {
        log.debug("Playlist.addItemsToPlaylist() -> " + 
                  "Successfully added items to playlist", response);
    })
    .catch(err => console.error(err));
}




// Get track uris and add them to 'items' array
// isFirst flag true will set the url params
// every subsequent call to this method will use the 'next' href in the response
// This method is called recursively until 'next' is null
function getItemsFromExistingPlaylist(url, isFirst, items, token) {
    

    if(isFirst) {
        url = `${url}?fields=next%2Citems(track(uri))&limit=100&offset=0`;
    }

    const options = {
        "method": "get",
        "url": url,
        "headers": {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        "json": true
    };

    log.debug(`Playlist.getItemsFromExistingPlaylist() -> Getting items from playlist ${url}`);
    return sendRequest(options)
    .then(response => {

        response.items.forEach(item => {
            items.push(item.track.uri);
        });

        if(response.next) {
            return getItemsFromExistingPlaylist(response.next, false, items, token)
            .then(response => {
                return items;
            })
            .catch(err => console.error(err));
        }

        log.debug("Playlist.getItemsFromExistingPlaylist() -> " + 
                  "Successfully retrieved all items from track url " + url);
        // log.debug("Retrieved items -> ", response);

        return items;
    })
    .catch(err => console.error(err));
}

function sendRequest(options) {
    return axios(options)
    .then(response => {
        // console.log(response.data);
        return(response.data);
    })
    .catch(err => console.error(err));
}

module.exports = PlaylistService;