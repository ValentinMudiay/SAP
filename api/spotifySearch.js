const router             = require("express").Router(),
      spotifyService     = require("../services/spotifySearch"),
      spotifyDao         = require("../dao/spotify"),
      log                = require("../services/log");

router.get("/", (req, res) => {
    const encodedQuery = encodeURIComponent(req.query.q);
    log.debug("GET /search ->", "encodedQuery = " + encodedQuery);
    
    let url = spotifyService.getSearchUrl(encodedQuery);
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