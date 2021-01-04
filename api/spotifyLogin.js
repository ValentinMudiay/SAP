const router              = require("express").Router(),
      spotifyService      = require("../services/spotifyLogin"),
      log                 = require("../services/log"),
      config              = require("../config/app"),
      successRedirectTo   = config.redirect.onLoginSuccess,
      errorRedirectTo     = config.redirect.onError;

router.get("/", (req, res) => {
    if(req.session.access_token) {
        log.debug(`GET /login -> Existing token found. Redirecting to ${successRedirectTo}`);
        res.redirect(successRedirectTo);
        return;
    }
        
    log.debug("GET /login -> No session token found, going to authenticate via Spotify.");
    const { url, state } = spotifyService.getAuthUrlWithState(req.headers.host);

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
        log.debug(`GET /callback -> State mismatch: redirecting to ${errorRedirectTo}`);
        delete req.session.state;

        log.debug(`GET /callback -> Refirecting to ${errorRedirectTo}`);
        res.redirect(errorRedirectTo);
        return;
    }

    spotifyService.getTokens(requestCode)
    .then(tokens => {
        log.debug("GET /callback -> Writing tokens to session");
        req.session.access_token    = tokens.access_token;
        req.session.refresh_token   = tokens.refresh_token;

        log.debug(`GET /login -> Redirecting to ${successRedirectTo}`);
        res.redirect(successRedirectTo);
    })
    .catch(error => {
        log.debug("GET /callback -> Error in promise chain getting token from Spotify\n", error);
        log.debug(`GET /callback -> Refirecting to ${errorRedirectTo}`);
        res.redirect(errorRedirectTo);
    });
});

module.exports = router;