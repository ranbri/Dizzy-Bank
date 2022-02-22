function verifyCookie(req, res, next) {
    req.isAuthenticated() ? next() : res.status(401).json({ err: "Unauthorized" });
}
module.exports = { verifyCookie };