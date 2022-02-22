const router = require('express').Router();
const checksLogic = require('../bll/checks-logic');





// Registering
router.post('/add', (req, res, next) => {
    checksLogic.addCheck(req.body)
        .then(() => {
            res.send(req.body)
        })
});

router.get('/checks/:id', async (req, res, next) => {
    await checksLogic.findPaychecks(req.params.id)
        .then(function (result) {
            if (result) {
                res.send(result);
            } else {
                res.send("User Not Found");
            }
        })
});
router.get('/checks/pending/:id', async (req, res, next) => {
    await checksLogic.findPendingPaychecks(req.params.id)
        .then(function (result) {
            if (result) {
                res.send(result);
            } else {
                res.send("User Not Found");
            }
        })
});
module.exports = router;