const
    router = require('express').Router(),
    cardsLogic = require('../bll/cards-logic');




// Registering
router.post('/add', (req, res, next) => {
    cardsLogic.addCard(req.body)
        .then(() => {
            res.send(req.body)
        })
});

router.get('/cards/:id', async (req, res, next) => {
    console.log(req.params.id)
    await cardsLogic.findCards(req.params.id)
        .then((result) => {
            if (result) {
                res.send(result);
            } else {
                res.send("No Cards Found");
            }
        })
});

router.get('/number/:number', async (req, res, next) => {
    await cardsLogic.validateCardNumber(req.params.number)
        .then((result) => {
            res.send(result);
        })
});

router.post('/cancel', (req, res, next) => {
    cardsLogic.CancelCardById(req.body._id , req.body.status)
        .then(() => {
            res.send(req.body)
        })
});



module.exports = router;