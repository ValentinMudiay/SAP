const router     = require("express").Router(),
      spotifyDao = require("../dao/spotify"),
      log        = require("../services/log");

router.get("/", (req, res) => {
    const rawQuery = req.query.q,
          encodedQuery = encodeURIComponent(rawQuery);

    log.debug("GET /search ->", "rawQuery = " + rawQuery);
    log.debug("GET /search ->", "encodedQuery = " + encodedQuery);

    const urlParams = {
        q:      encodedQuery,
        type:   "playlist",
        market: "US",
        limit:  3,
        offset: 0
    };

    /**
     * Converts a one dimensional Javascript object to query string format.
     * 
     * @param {object} json Object to be converted.
     * @returns {string} a query string that can be appended to a URL.
     */
    const _jsonToQueryStr = (json) => {
        let str = "";

        Object.keys(json).forEach((key, i, arr) => {
            str += `${key}=${json[key]}`;
            str += i !== arr.length-1 ? "&" : "";
        });

        return str;
    };

    const url = "https://api.spotify.com/v1/search?" + _jsonToQueryStr(urlParams);
    log.debug("URL FOR SEARCH -> ", url);
    
    token = req.session.access_token;
    const options = {
        "method"  : "get",
        "url"     : url,
        "headers" : { 
            "Authorization": "Bearer " + token,
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        "json"    : true
    };

    
    spotifyDao.search(options)
    .then(response => {
        res.json(response.data);
    })
    .catch(error => {
        log.debug(error)
        log.debug("Unable to get search.");
    });

});

module.exports = router;