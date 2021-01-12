const { jsonToQueryStr } = require("../services/queryString"),
      config             = require("../config/app"),
      spotify            = require("../config/spotify");

module.exports = {
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
    }
};