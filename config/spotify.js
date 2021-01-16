const config = require("./app");
module.exports = {
    // Client ID provided by Spotify for this application
    client_id        : process.env.CLIENT_ID,

    // Secret provided by Spotify for this applicatiton
    client_secret    : process.env.CLIENT_SECRET,

    uuidKey          : "sap_uuid",

    // Configuration used during initial Spotify authenticatiton
    auth: { 
        base         :"https://accounts.spotify.com/authorize",
        stateKey     : "auth_state",
        redirectPath : "/login/callback",
        options      :      {
            client_id      : process.env.CLIENT_ID,
            response_type  : "code",
            redirect_uri   : "",
            state          : "",
            scope          : "user-read-email user-read-private",
            show_dialog    : false
        }
    },

    // Configuration relating to using the Spotify search api
    search: {
        base:       "https://api.spotify.com/v1/search",
        params:     {
            q:      "",
            type:   "playlist",
            market: "US",
            limit:  10,
            offset: 0
        },
        options:    {
            "method"  : "get",
            "url"     : "",
            "headers" : { 
                "Authorization": "",
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            "json"    : true
        }
    },

    // Configuration relating specifically to access and refresh tokens
    token: {
        url: 'https://accounts.spotify.com/api/token',
    },

    clientCredentialsToken: "",

    profile: {
        url: 'https://api.spotify.com/v1/me',
    }
};