const axios = require("axios");
const log   = require("../services/log");

const SpotifyDao = {
    /**
     * Makes http request based on options provided. The response is expected
     * to contain a data object with access_token and refresh_token properties
     * if the Authorization Code flow was executed. If the Client Credentials
     * flow was executed, refresh_token is undefined.
     * 
     * @param {object} options used in the axios http request.
     * @returns Promise containing access and refresh tokens in an object.
     */
    getToken: options => {
        log.debug("SpotifyDao.getToken()", options);

        return axios(options)

            .then(response => {
                log.debug("Token retrieved successfully.");

                return {
                    access_token    : response.data.access_token,
                    refresh_token   : response.data.refresh_token
                };
            })

            .catch(error => {
                throw new Error("Could not get token from Spotify API. " +
                error);
            });
    },

    /**
     * Generates an object to be used in a call to the axios() method.
     * 
     * @param {string} method Http method
     * @param {string} url Endpoint
     * @param {object} data Data to be sent in the request body
     * @param {string} token Bearer access token tied to this request
     */
    getJsonRequestOptions: function(method, url, token, data) {
        const options = {
            "method": method,
            "url": url,
            "headers": {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            "json": true
        };

        if(data) 
            options.data = typeof(data) == "string" ? data : JSON.stringify(data);

        return options;
    },

    /**
     * Makes http request based on options provided. The response is expected
     * to contain a data object
     *
     * For additional information on the Spotify  api, see:
     * https://developer.spotify.com/documentation/web-api/reference/
     * 
     * @param {object} options 
     * @returns Promise containing http response from Spotify
     */
    request: options => {
        log.debug("SpotifyDao.request()", options);

        return axios(options)

            .then(response => {
                return response.data;
            })

            .catch(error => {
                throw new Error("There was an error using the Spotify API. " +
                error);
            });
    },    
};

module.exports = SpotifyDao;