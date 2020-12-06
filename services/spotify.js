const spotifyConfig = require("../config/spotify");
const spotifyDao    = require("../dao/spotify");
const { v4: uuid } = require("uuid");

const SpotifyService = {
    getStateKey: () => spotifyConfig.auth.stateKey,

    getUuidKey: () => spotifyConfig.uuidKey,

    getAuthUrlWithState: () => {
        const state = SpotifyService._getRandomString(32);
        let options = spotifyConfig.auth.options,
            url     = spotifyConfig.auth.base + "?";
            
        options.state = state;

        url += SpotifyService._jsonToQueryStr(options);

        return { url, state };
    },

    _jsonToQueryStr: (json) => {
        let str = "";

        Object.keys(json).forEach((key, i, arr) => {
            str += `${key}=${json[key]}`;
            str += i !== arr.length-1 ? "&" : "";
        });

        return str;
    },

    _getTokenOptions: code => {
        const authStr        = spotifyConfig.client_id + ":" + spotifyConfig.client_secret,
              buffer         = new Buffer.from(authStr),
              encodedAuthStr = buffer.toString("base64"),
              data           = {
                    "code"          : code,
                    "redirect_uri"  : spotifyConfig.auth.options.redirect_uri,
                    "grant_type"    : "authorization_code"
                },
              dataStr        = SpotifyService._jsonToQueryStr(data);

        return {
            "method": "post",
            "url"   : spotifyConfig.token.url,
            "data"  : dataStr,
            "headers": {
                "Authorization" : "Basic " + encodedAuthStr,
                "Content-Type"  : "application/x-www-form-urlencoded"
            },
            "json": true
        };
    },

    getTokens: code => {
        const options = SpotifyService._getTokenOptions(code);
        
        return spotifyDao.getToken(options)
            .then((token) => {
                return token;
            })
            .catch(ex => console.error(ex));
        
    },

    _getProfileOptions: (token) => {
        const url = spotifyConfig.profile.url;

        return {
            "method"  : "get",
            "url"     : url,
            "headers" : { "Authorization": "Bearer " + token },
            "json"    : true
        };
    },

    getProfile: token => {
        const options = SpotifyService._getProfileOptions(token);

        return spotifyDao.getProfile(options)
            .then(profile => profile)
            .catch(error => console.log(error));
    },

    _getRandomString: function(length) {
        var str   = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
        for (let i = 0; i < length; i++) {
            str += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return str;
    },

    getUuid: () => {
        return uuid();
    },
};

module.exports = SpotifyService;