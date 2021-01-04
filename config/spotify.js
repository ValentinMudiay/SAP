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

    // Configuration relating specifically to access and refresh tokens
    token: {
        url: 'https://accounts.spotify.com/api/token',
    },

    profile: {
        url: 'https://api.spotify.com/v1/me',
    }
};