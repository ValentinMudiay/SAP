const router             = require("express").Router(),
      spotifyService     = require("../services/spotifySearch"),
      spotifyDao         = require("../dao/spotify"),
      log                = require("../services/log");

let { clientCredentialsToken } = require("../config/spotify");

/**
 * Route used for searching Spotify via the Spotify search api.
 * We are expecting the following URL query parameters:
 *      q: the search query
 *      typeahead: true if typeahead results are desired
 * 
 * i.e. /search?q=SomeQuery&typeahead=true
 * 
 * For additional information on the Spotify search api, see:
 * 
 * https://developer.spotify.com/documentation/web-api/reference/search/search/
 */
router.get("/", (req, res) => {

    // console.log(req, ">>>>>>>>>>"); // can delete if not needed for debugging
    
    log.debug("GET /search ->", "query = " + req.query.q);
    
    const query = req.query.q,
          isTypeahead = req.query.typeahead === "true",
          url = spotifyService.getSearchUrl(query, isTypeahead);

    log.debug("GET /search -> Generated search url = ", url);
    
    let token = req.session.access_token;

    if(!token && isTypeahead) {
        spotifyDao.getDbClientCredentialToken()
        .then(token => {
            if(token){
                clientCredentialsToken = token;
                log.debug(clientCredentialsToken);
            }
        });
        
        // Check db for client token
        // if token in db, token=dbtoken
        // else get new token using clientId and clientSecret
    }
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