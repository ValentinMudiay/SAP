const axios = require("axios");
const log   = require("../services/log");

const SpotifyDao = {
    getToken: options => {
        log.debug("SpotifyDao.getToken()", options);

        return axios(options)

            .then((response) => {
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