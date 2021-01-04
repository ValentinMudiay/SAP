module.exports = {
    client_id        : process.env.CLIENT_ID,

    client_secret    : process.env.CLIENT_SECRET,

    uuidKey          : "sap_uuid",

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

    token: {
        url: 'https://accounts.spotify.com/api/token',
    },

    profile: {
        url: 'https://api.spotify.com/v1/me',
    }
};