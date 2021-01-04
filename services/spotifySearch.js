const { jsonToQueryStr } = require("../services/queryString"),
      spotify            = require("../config/spotify");

module.exports = {
    /**
     * Concatenates the url and parameters found in the Spotify search config
     * 
     * @param {string} query URI encoded query
     * @returns string url of the Spotify search endpoint with parameters
     */
    getSearchUrl: query => {
        let urlParams = spotify.search.params;
        urlParams.q = query;

        let url = spotify.search.base + "?";
        url += jsonToQueryStr(urlParams);
        return url;
    },

    /**
     * Generates the http request options for using Spotify's search api.
     * 
     * @param {string} url URI encoded string containing the URL and query 
     *                     parameters.
     * @param {*} token Spotify access token
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