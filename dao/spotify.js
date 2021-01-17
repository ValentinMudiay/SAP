const axios = require("axios");
const { response } = require("express");
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
                log.debug(`Error: Status code ${error.response.status}`, 
                                                error.response.statusText);
                throw new Error("Could not get token from Spotify API.");
            });
    },

    /**
     * Makes an http request based on the options provided.
     * 
     * @param {object} options used in axios http request.
     * @returns Promise containing {token: 'sometokenfromspotify'}
     */
    getClientCredentialsToken: options => {
        log.debug("SpotifyDao.getClientCredentialsToken()", options);

        return axios(options)

        .then(response => {
            log.debug("Client Credentials token retrieved successfully.");

            return response.data.access_token;
        })

        .catch(error => {
            log.debug(`Error: Status code ${error.response.status}`, 
                                            error.response.statusText);
            throw new Error("Could not retrieve new client credential token.");
        });
    },

    /**
     * Makes http request based on options provided. The response is expected
     * to contain a data object with search results
     *
     * For additional information on the Spotify search api, see:
     * https://developer.spotify.com/documentation/web-api/reference/search/search/
     *  
     * @param {object} options 
     * @returns Promise containing search results in the response
     */
    search: options => {
        log.debug("SpotifyDao.search()", options);

        return axios(options)

            .then(response => {
                // TODO: Destructure and return the response data
                return response;
            })

            .catch(error => {
                // log.debug(`Error: Status code ${error.response.status}`, 
                //                                 error.response.statusText);
                throw {
                    error: error,
                    message: `Could not get search results from Spotify API. ${error.response.statusText}`,
                    status: error.response.status
                };
            });
    },

    getProfile: options => {
        log.debug("SpotifyDao.getProfile()", options);

        return axios(options)

            .then(response => {
                return response.data;
            })

            .catch((error) => {
                log.debug(`Error: Status code ${error.response.status}`, 
                                                error.response.statusText);
                throw new Error("Could not get profile information.");
            });
    },

    
};

module.exports = SpotifyDao;