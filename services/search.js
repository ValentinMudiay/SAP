const { jsonToQueryStr } = require("./querystring"),
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

    log.debug("SpotifySearch.getSearchResults() -> " +
              "Sending request to Spotify search API");

    return spotifyDao.request(options)
    .then(response => {
        if(response)
            return response.data;
    })
    .catch(error => {
        log.debug("Unable to get search results from Spotify... " +
                    "\nStatus code " + error.status);

        throw(error);
    });
}

module.exports = SpotifySearchService;