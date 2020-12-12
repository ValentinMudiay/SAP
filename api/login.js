const router         = require("express").Router(),
      spotifyService = require("../services/spotify"),
      log            = require("../services/log"),
      successRoute   = "/success",
      errorRoute     = "/error";

router.get("/", (req, res) => {
    if(req.session.access_token) {
        log.debug(`GET /login -> Existing token found. Redirecting to ${successRoute}`);
        res.redirect(successRoute);
        return;
    }
        
    log.debug("GET /login -> No session token found, going to authenticate via Spotify.");
    const { url, state } = spotifyService.getAuthUrlWithState();

    log.debug("GET /login  ->", `Set session {state: ${state}}`);
    req.session.state = state;

    log.debug("GET /login  ->", `Redirecting to ${url}`);
    res.redirect(url);
});

router.get("/callback", (req, res) => {
    const sessionState      = req.session.state,
          requestState      = req.query.state,
          requestCode       = req.query.code;

    log.debug("GET /callback -> Params recieved from Spotify", {
        "code"           : requestCode,
        "storedState"    : sessionState,
        "recievedState"  : requestState
    });

    if(sessionState !== requestState) {
        log.debug(`GET /callback -> State mismatch: redirecting to ${errorRoute}`);
        delete req.session.state;

        log.debug(`GET /callback -> Refirecting to ${errorRoute}`);
        res.redirect(errorRoute);
        return;
    }

    spotifyService.getTokens(requestCode)
    .then(tokens => {
        log.debug("GET /callback -> Writing tokens to session");
        req.session.access_token    = tokens.access_token;
        req.session.refresh_token   = tokens.refresh_token;

        log.debug(`GET /login -> Redirecting to ${successRoute}`);
        res.redirect(successRoute);
    })
    .catch(error => {
        log.debug("GET /callback -> Error in promise chain getting token from Spotify\n", error);
        log.debug(`GET /callback -> Refirecting to ${errorRoute}`);
        res.redirect(errorRoute);
    });
});

module.exports = router;