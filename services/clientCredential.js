const spotify            = require("../config/spotify"),
      spotifyDao         = require("../dao/spotify"),
      { jsonToQueryStr } = require("../services/queryString");

// set token on server startup
setClientCredentialsToken();

// refresh token at intervals based on config
refreshClientCredentialsTokenAtIntervals(
    spotify.token.clientCredentialsTokenRefreshInterval
);

/**
 * Gets a new Spotify token every 'delay' milliseconds, and sets the Client
 * Credentials token in the Spotify config.
 * 
 * @param {number} delay The amount of time before a new token is requested
 *                       using the Client Credentials flow. 
 * @returns undefined
 */
function refreshClientCredentialsTokenAtIntervals(delay) {
    let timer = setInterval(function() {
        setClientCredentialsToken();
        clearInterval(timer);

        refreshClientCredentialsTokenAtIntervals(delay);
    }, delay);
}

/**
 * Sets the config to the token received via the Client Credentials flow.
 * 
 * @returns undefined
 */
function setClientCredentialsToken() {
    getNewClientCredentialsToken()
    .then(token => {
        spotify.token.clientCredentialsToken = token;
    })
    .catch(error => {
        log.debug(error);
    });
}

/**
 * Gets the axios http request options for the Client Credentials api request.
 * 
 * @returns Promise containing the retrieved token in the response
 */
function getNewClientCredentialsToken() {
    const options = getClientCredentialsOptions();
    return spotifyDao.getClientCredentialsToken(options);
}

/**
 * Assembles the options object used in the axios http request.
 * 
 * @returns Object containing the properties and values necessary to retrieve
 *          a token using the Client Credentials Flow.
 */
function getClientCredentialsOptions() {
    const data = {
        grant_type: "client_credentials"
    };

    const authStr        = spotify.client_id + ":" + spotify.client_secret,
          buffer         = new Buffer.from(authStr),
          encodedAuthStr = buffer.toString("base64"),
          dataStr        = jsonToQueryStr(data);

    return {
        "method": "post",
        "url"   : spotify.token.url,
        "data"  : dataStr,
        "headers": {
            "Authorization" : "Basic " + encodedAuthStr,
            "Content-Type"  : "application/x-www-form-urlencoded"
        },
        "json": true
    };
}



