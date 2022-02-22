const
    router = require('express').Router(),
    paymentsLogic = require('../bll/payments-logic'),
    userLogic = require('../bll/user-logic'),
    cardsLogic = require('../bll/cards-logic');


router.post('/bulk', async (req, res, next) => {
    await userLogic.updateBalanceByUserID(req.body.from._id, -req.body.value)
        .then(result => {
            if (result) {
                let fromPayment = {
                    userID: req.body.from._id,
                    amount: -req.body.value,
                    type: 'negative',
                    reason: `Wire money to:${req.body.to.firstName} ${req.body.to.lastName}`,
                    date: new Date(),
                    by: `Dizzy Banking inc.`,
                    payType: `balance`
                }
                paymentsLogic.addPayment(fromPayment)
                    .then(result => {
                        if (result) {
                            userLogic.updateBalanceByUserID(req.body.to._id, req.body.value)
                                .then(result => {
                                    if (result) {
                                        let toPayment = {
                                            userID: req.body.to._id,
                                            amount: req.body.value,
                                            type: 'positive',
                                            reason: `Wire money from:${req.body.from.firstName} ${req.body.from.lastName}`,
                                            date: new Date(),
                                            by: `Dizzy Banking inc.`,
                                            payType: `balance`
                                        }
                                        paymentsLogic.addPayment(toPayment)
                                            .then(result => {
                                                if (result) {
                                                    res.send(true)
                                                } else {
                                                    res.send(false)
                                                }
                                            })
                                    } else {
                                        res.send(false)
                                    }
                                })
                        } else {
                            res.send(false)
                        }
                    })
            } else {
                res.send(false);
            }
        })
});


module.exports = router;