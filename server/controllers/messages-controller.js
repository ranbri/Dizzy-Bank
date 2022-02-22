const
    router = require('express').Router(),
    messagesLogic = require('../bll/messages-logic');

router.get('/users/:id', async (req, res, next) => {
    await messagesLogic.getMessagesByUserID(req.params.id)
        .then((result) => {
            if (result) {
                res.send(result);
            } else {
                res.send("No Users Found");
            }
        })
});
router.get('/admins/:id', async (req, res, next) => {
    await messagesLogic.getMessagesByAdminID(req.params.id)
        .then((result) => {
            if (result) {
                res.send(result);
            } else {
                res.send("No Admins Found");
            }
        })
});
router.post('/send', async (req, res, next) => {
    await messagesLogic.sendMessage(req.body)
        .then(function (result) {
            if (result) {
                res.send(result);
            } else {
                res.send("Messages could not be sent");
            }
        })
});
router.post('/read/:id', async (req, res, next) => {
    let id = req.params.id;
    await messagesLogic.sendRead(id)
        .then(function (result) {
            if (result) {
                res.send(result);
            } else {
                res.send("Messages could not be Read");
            }
        })
});
module.exports = router;
