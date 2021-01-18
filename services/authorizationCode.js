const appConfig     = require("../config/app"),
      spotifyConfig = require("../config/spotify"),
      tokenService  = require("./token"),
      { jsonToQueryStr, getRandomString } = require("./querystring");

const SpotifyLoginService = {
    /**
     * Generates a URL that can be used to obtain an authorization
     * code from Spotify. The authorization code received from Spotitfy
     * can be exchanged for access and refresh tokens.
     * 
     * Spotify documentation: 
     * https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow
     * 
     * @param {String} host The value of the host header receieved from the
     *                      client's http request.
     * @returns object containing the spotify auth URL and a randomly generated
     *          string to represent the state.
     */
    getAuthUrlWithState: (host) => {
        const state     = getRandomString(32),
              protocol  = appConfig.protocol,
              path      = spotifyConfig.auth.redirectPath;

        let options = spotifyConfig.auth.options,
            url     = spotifyConfig.auth.base + "?";
            
        options.state = state;
        options.redirect_uri = `${protocol}${host}${path}`;

        url += jsonToQueryStr(options);

        return { url, state };
    },

    /**
     * Attempts to retrieve access and refresh tokens from Spotify
     * using the Authorization Code flow.
     * 
     * @param {string} code Authorization code received from Spotify.
     *                      If undefined or falsey, Client Credentials
     *                      flow is executed.
     * @returns Promise to complete an http request in an attempt to
     *          retrieve access and refresh tokens from Spotify.
     */
    getAuthorizationCodeTokens: code => {
        const options = tokenService.getTokenOptions(code);
        
        return tokenService.getToken(options)
        .then((token) => {
            return token;
        })
        .catch(ex => console.error(ex));
    },
};

module.exports = SpotifyLoginService;