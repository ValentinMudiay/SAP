const appConfig     = require("../config/app");
const spotifyConfig = require("../config/spotify");
const spotifyDao    = require("../dao/spotify");

const SpotifyService = {
    getStateKey: () => spotifyConfig.auth.stateKey,

    /**
     * Generates a URL that can be used to obtain an authorization
     * code from Spotify. The authorization code received from Spotitfy
     * can be exchanged for access and refresh tokens.
     * 
     * Spotify documentation: 
     * https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow
     * 
     * @param {String} host The value of the host header receieved from
     *                      the client's http request.
     * @returns {object} the spotify auth URL and a randomly generated
     *                   string to represent the state.
     */
    getAuthUrlWithState: (host) => {
        const state     = SpotifyService._getRandomString(32),
              protocol  = appConfig.protocol,
              path      = spotifyConfig.auth.redirectPath;

        let options = spotifyConfig.auth.options,
            url     = spotifyConfig.auth.base + "?";
            
        options.state = state;
        options.redirect_uri = `${protocol}${host}${path}`;

        url += SpotifyService._jsonToQueryStr(options);

        return { url, state };
    },

    /**
     * Converts a one dimensional Javascript object to query string format.
     * 
     * @param {object} json Object to be converted.
     * @returns {string} a query string that can be appended to a URL.
     */
    _jsonToQueryStr: (json) => {
        let str = "";

        Object.keys(json).forEach((key, i, arr) => {
            str += `${key}=${json[key]}`;
            str += i !== arr.length-1 ? "&" : "";
        });

        return str;
    },

    /**
     * Builds a Javascript object containing the parameters of a POST request
     * used to obtain access and refresh tokens from Spotify. 
     * 
     * For more info on these parameters vist:
     * https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow
     * 
     * @param {string} code Authorizatiton code received from Spotify.
     * @returns {object} containing POST request options.
     */
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

    /**
     * Attempts to retrieve access and refresh tokens from Spotify.
     * 
     * @param {string} code Authorization code received from Spotify.
     * @returns {Promise} to complete an http request in an attempt to
     *                    retrieve access and refresh tokens from Spotify.
     */
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

    /**
     * Generates a string of random alpha-numeric characters.
     * 
     * @param {number} length The number of characters desired in the returned value.
     * @returns {string} of random alpha-numeric characters
     */
    _getRandomString: function(length) {
        var str   = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
        for (let i = 0; i < length; i++) {
            str += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return str;
    },
};

module.exports = SpotifyService;