const axios = require("axios");
const dbConfig = require("../config/db");
const Pool = require("pg").Pool;
const pool = new Pool(dbConfig);
const log   = require("../services/log");

const SpotifyDao = {
    /**
     * Makes http request based on options provided. The response is expected
     * to contain a data object with access_token and refresh_token properties
     * if the Authorization Code flow was executed. If the Client Credentials
     * flow was executed, refresh_token is undefined.
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
                log.debug(`Error: Status code ${error.response.status}`, 
                                                error.response.statusText);
                throw new Error("Could not get search results from Spotify API.");
            })
    },

    getDbClientCredentialToken: () => {
        log.debug("SpotifyDao.getDbClientCredentialToken() is running");

        const q = "SELECT token FROM client WHERE last_modified = (SELECT MAX(last_modified) FROM client)"
        return query(q).then(response => response.rows[0].token)
        .catch(error => {
            log.debug(error);
        });
    },


    updateDbClientCredentialToken: token => {
        log.debug("SpotifyDao.updateDbClientCredentialToken() is running");

        const q = "UPDATE client SET token = $1 WHERE last_modified = (SELECT MAX(last_modified) FROM client);";
        return query(q, [token]);
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

const query = (query, params) => {
    return new Promise((resolve, reject) => {
        pool.query(query, params, (err, res) => {
            if(err) reject(err);
            else resolve(res);
        });
    });
};

module.exports = SpotifyDao;