const { jsonToQueryStr } = require("../services/queryString"),
      config             = require("../config/app"),
      spotify            = require("../config/spotify"),
      spotifyDao         = require("../dao/spotify"),
      log                = require("./log");

const SpotifySearchService = {
    /**
     * Executes the steps required to perform a search using the Spotify search API.
     * 
     * @param {string} query The search query parameter in the request
     * @param {boolean} isTypeahead If true, result may be catered to typeahead
     * @param {string} token Access token used to authenticate the Spotify API
     * 
     * @returns Promise contianing the search results in the response
     */
    search: (query, isTypeahead, token) => {
        log.debug("SpotifySearch.search() -> Preparing search...");
        const url = getSearchUrl(query, isTypeahead);

        log.debug("SpotifySearch.search() -> Generated search url");

        if(!token) { // User isnt authenticated, use client cred token instead
            log.debug("SpotifySearch.search() -> No session token present; " +
                        "using client credentials token instead");

            token = spotify.token.clientCredentialsToken;
        }

        log.debug("SpotifySearch.search() -> Getting search results from Spotify");

        return getSearchResults(url, token)
        .then(results => {
            return results;
        })
        .catch(error => {
            log.debug(error);
        });
    },   
};

/**
 * Generates the http request options for using Spotify's search API.
 * 
 * @param {string} url URI encoded string containing the URL and query 
 *                     parameters.
 * @param {string} token Spotify access token
 * @returns object containing the options required to make a GET request
 *          to Spotify's search api
 */
function getSearchOptions(url, token) {
    return {
        "method"  : "get",
        "url"     : url,
        "headers" : { 
            "Authorization": "Bearer " + token,
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        "json"    : true
    };
}

/**
 * Concatenates the base url and parameters. Spotify requires that the query
 * parameter be URI encoded.
 * 
 * @param {string} query URI encoded query
 * @param {boolean} isTypeahead Set to true to results for typeahead search
 * @returns string url of the Spotify search endpoint with parameters
 */
function getSearchUrl(query, isTypeahead) {
    const encodedQuery = encodeURIComponent(query);

    let urlParams = spotify.search.params;
    urlParams.q = encodedQuery;

    if(isTypeahead) {
        urlParams.limit = config.search.typeAheadReturnCount
    }

    let url = spotify.search.base + "?";
    url += jsonToQueryStr(urlParams);
    return url;
}

/**
 * Gets the options required for an http request to the search API
 * and uses the spotifyDao to send the request.
 * 
 * @param {string} url URL of the Spotify Search API endpoint
 * @param {string} token Access token used to authenticate the Spotify API
 * 
 * @returns Promise containing the search results returned from Spotify
 */
function getSearchResults(url, token) {
    const options = getSearchOptions(url, token); 

    log.debug("SpotifySearch.getSearchResults() -> Options:", options);
    return spotifyDao.search(options)
    .then(response => {
        if(response)
            return response.data;
    })
    .catch(error => {
        log.debug("Unable to get typeahead search... " +
                    "\nStatus code " + error.status);

        throw(error);
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

// set token on server startup
setClientCredentialsToken();

// refresh token at intervals based on config
refreshClientCredentialsTokenAtIntervals(
    spotify.token.clientCredentialsTokenRefreshInterval
);

module.exports = SpotifySearchService;