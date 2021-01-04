const axios = require("axios");
const { response } = require("express");
const log   = require("../services/log");

const SpotifyDao = {
    /**
     * Makes http request based on options provided. The response is expected
     * to contain a data object with access_token and refresh_token properties.
     * 
     * @param {object} options used in the axios http request.
     * @returns {Promise} containing access and refresh tokens in an object.
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

    search: options => {
        log.debug("SpotifyDao.search()", options);

        return axios(options)

            .then(response => {
                log.debug(">>>>>>>>>>>>>>>>>>", response);
                return response;
            })

            .catch(error => {
                log.debug(`Error: Status code ${error.response.status}`, 
                                                error.response.statusText);
                throw new Error("Could not get search results from Spotify API.");
            })
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