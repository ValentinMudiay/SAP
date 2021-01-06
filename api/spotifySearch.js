const router             = require("express").Router(),
      spotifyService     = require("../services/spotifySearch"),
      spotifyDao         = require("../dao/spotify"),
      log                = require("../services/log");

/**
 * Route used for searching Spotify via the Spotify search api.
 * We are expecting the search query as a URL query parameter named "q".
 * i.e. /search?q=SomeQuery
 * 
 * For additional information on the Spotify search api, see:
 * 
 * https://developer.spotify.com/documentation/web-api/reference/search/search/
 */
router.get("/", (req, res) => {
    log.debug("GET /search ->", "query = " + req.query.q);
    
    let url = spotifyService.getSearchUrl(req.query.q);
    log.debug("GET /search -> Generated search url = ", url);
    
    token = req.session.access_token;
    const options = spotifyService.getSearchOptions(url, token);

    spotifyDao.search(options)
    .then(response => {
        res.json(response.data); // TODO: update to return appropriate response
    })
    .catch(error => {
        log.debug(error)
        log.debug("Unable to get search.");
    });

});

module.exports = router;