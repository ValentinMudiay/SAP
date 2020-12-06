const router         = require("express").Router(),
    //   redis          = require("../services/redis"),
      db             = require("../dao/client"),
      spotifyService = require("../services/spotify"),
      log            = require("../services/log");

router.get("/", (req, res) => {
    const uuidKey     = spotifyService.getUuidKey(),
          cookieUuid  = req.cookies ? req.cookies[uuidKey] : ""; // '0bf7c86b-7f1a-4352-8aa8-69e7f30f7176'

    if(cookieUuid) {
        log.debug("GET /login -> Found cookie uuid");

        log.debug("GET /login -> Checking db for uuid");
        db.getToken(cookieUuid)
        .then(result => {
            const data = result.rows[0];
            log.debug(data ? "GET /login -> Found uuid in db" : 
                             `GET /login -> No record in db with uuid = ${cookieUuid}`);

            // If successfully retrieved a token
            // Begin logged in session and redir to next page
            if(data) {
                log.debug("GET /login -> Redirecting to /success");
                res.redirect("/success");
            }
            // else get token from spotify
            else {
                const { url, state } = spotifyService.getAuthUrlWithState();

                log.debug("GET /login  ->", `Set cookie {${spotifyService.getStateKey()}: ${state}}`);
                res.cookie(spotifyService.getStateKey(), state);

                log.debug("GET /login  ->", `Redirecting to ${url}`);
                res.redirect(url);
            }
        })
        .catch(ex => {
            log.debug("GET /login -> Caught error getting token from db", ex);
            log.debug("GET /login -> Redirecting to /error");
            res.redirect("/error");
        });

        return;
    }
    
    log.debug("GET /login -> No uuid cookie found on client, preparing to authenticate via Spotify.");
    const { url, state } = spotifyService.getAuthUrlWithState();

    log.debug("GET /login  ->", `Set cookie {${spotifyService.getStateKey()}: ${state}}`);
    res.cookie(spotifyService.getStateKey(), state);

    log.debug("GET /login  ->", `Redirecting to ${url}`);
    res.redirect(url);
});

router.get("/callback", (req, res) => {
    const stateKey          = spotifyService.getStateKey(),
          cookieState       = req.cookies ? req.cookies[stateKey] : "",
          requestState      = req.query.state,
          requestCode       = req.query.code;

    log.debug("GET /callback -> Params recieved from Spotify", {
        "code"           : requestCode,
        "storedState"    : cookieState,
        "recievedState"  : requestState
    });

    if(cookieState !== requestState) {
        log.debug("GET /callback -> State mismatch: redirecting to /error");
        res.clearCookie(stateKey);

        log.debug("GET /callback -> Refirecting to /error");
        res.redirect("/error");
        return;
    }

    spotifyService.getTokens(requestCode)
    .then(tokens => {
        const id = spotifyService.getUuid();

        log.debug("GET /callback -> Writing tokens to db");
        return db.setTokens(id, tokens.access_token, tokens.refresh_token)
            .then(dbResult => {
                res.cookie(spotifyService.getUuidKey(), id);
                return tokens;
            })
    })
    .then(tokens => spotifyService.getProfile(tokens.access_token))
    .then(profile => {
        res.clearCookie(stateKey);
        res.json(profile);
    })
    .catch(error => {
        log.debug("GET /callback -> Error in promise chain getting token from Spotify\n", error);
        log.debug("GET /callback -> Refirecting to /error");
        res.redirect("/error");
    });
});

module.exports = router;