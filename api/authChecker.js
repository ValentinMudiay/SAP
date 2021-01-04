module.exports = {
    viaSpotify: (req, res, next) => {
        console.log("Checking auth");
        return req.session.access_token ? next() : res.redirect("/");
    },
};