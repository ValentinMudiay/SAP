module.exports = {
    viaSpotify: (req, res, next) => {
        return req.session.access_token ? next() : res.redirect("/");
    },
};