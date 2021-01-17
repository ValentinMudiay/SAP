const { jsonToQueryStr } = require("../services/queryString"),
      config             = require("../config/app"),
      spotify            = require("../config/spotify"),
      spotifyDao         = require("../dao/spotify"),
      log                = require("./log");

const SpotifySearchService = {
    /**
     * Concatenates the base url and parameters. Spotify requires that the query
     * parameter be URI encoded.
     * 
     * @param {string} query URI encoded query
     * @param {boolean} isTypeahead Set to true to results for typeahead search
     * @returns string url of the Spotify search endpoint with parameters
     */
    getSearchUrl: (query, isTypeahead) => {
        const encodedQuery = encodeURIComponent(query);

        let urlParams = spotify.search.params;
        urlParams.q = encodedQuery;

        if(isTypeahead) {
            urlParams.limit = config.search.typeAheadReturnCount
        }

        let url = spotify.search.base + "?";
        url += jsonToQueryStr(urlParams);
        return url;
    },

    /**
     * Generates the http request options for using Spotify's search api.
     * 
     * @param {string} url URI encoded string containing the URL and query 
     *                     parameters.
     * @param {string} token Spotify access token
     * @returns object containing the options required to make a GET request
     *          to Spotify's search api
     */
    getSearchOptions: (url, token) => {
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
    },

    search: (query, isTypeahead, token) => {
        const url = SpotifySearchService.getSearchUrl(query, isTypeahead);

        log.debug("SpotifySearch.search() -> Generated search url");

        if(token) { // User is already authenticated via Spotify
            log.debug("SpotifySearch.search() -> Session token is present; using it to search");
            return SpotifySearchService.getSearchResults(url, token)
            .then(results => {
                console.log("RESULTS USER TOKEN", results);
                return results;
            }).catch(error => {
                log.debug(error);
            });
        }
        else { // User isnt authenticated, use client cred token
            log.debug("SpotifySearch.search() -> Session token is not present; using client credential token instead");
            token = spotify.clientCredentialsToken;

            return SpotifySearchService.getSearchResults(url, token)
            .then(results => {
                console.log("RESULTS CLIENT CREDS TOKEN", results);
                return results;
            })
            .catch(error => {
                log.debug("Couldnt get typeahead search using " +
                           "existing client credentials token... "+
                           "\nStatus code " + error.status);
                log.debug(error); // error is something other than unauthorized (400)
                
            });
        }
    },

    getSearchResults: function(url, token) {
        const options = SpotifySearchService.getSearchOptions(url, token); 

        log.debug("getSearchResults() -> Options:", options);
        return spotifyDao.search(options)
        .then(response => {
            if(response)
                return response.data; // TODO: update to return appropriate response
        })
        .catch(error => {
            // log.debug("Unable to get typeahead search using " +
            //            "existing client credentials token... "+
            //            "\nStatus code " + error.status);

            throw(error);
        });
    },   
    
    getNewClientCredentialsToken: () => {
        const options = getClientCredentialsOptions();
        return spotifyDao.getClientCredentialsToken(options);
    },

    setClientCredentialsToken: () => {
        SpotifySearchService.getNewClientCredentialsToken()
        .then(token => {
            spotify.clientCredentialsToken = token;

            // TESTING USTING SET TIMEOUT
            setTimeout(() => {
                console.log("token is ", spotify.clientCredentialsToken);
            }, 500);
        });
    },
};

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

function getNewClientCredentialToken() {
    let timer = setInterval(function() {
        SpotifySearchService.getNewClientCredentialsToken();
        clearInterval(timer);

        getNewClientCredentialToken();
    }, 1000 * 60 * 30);
}

getNewClientCredentialToken();
module.exports = SpotifySearchService;