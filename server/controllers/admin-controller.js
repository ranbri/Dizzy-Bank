const router = require('express').Router();
const adminLogic = require('../bll/admin-logic');
const paymentsLogic = require('../bll/payments-logic');
const userLogic = require('../bll/user-logic');

router.get('/users', async (req, res, next) => {
    await adminLogic.findUsers()
        .then((result) => {
            if (result) {
                res.send(result);
            } else {
                res.send("No Users Found");
            }
        })
});
router.post('/fulfill/loan', async (req, res, next) => {
    console.log(req.body);
    await adminLogic.fulfillLoan(req.body)
        .then(function (result) {
            console.log('result')
            console.log(result)
            if (result) {
                let loan = {
                    userID: req.body.userID,
                    loanID: req.body.loanID,
                    amount: req.body.addedValue,
                    type: 'positive',
                    reason: 'Loan fulfillment',
                    date: new Date(),
                    by: 'Dizzy Banking inc.'

                }
                paymentsLogic.addPayment(loan);

                res.send(result);
            } else {
                res.send("User Not Found");
            }
        })
});
router.post('/deny/loan/:id', async (req, res, next) => {
    await adminLogic.denyLoan(req.params.id)
        .then(function (result) {
            if (result) {

                res.send(result);
            } else {
                res.send("User Not Found");
            }
        })
});

router.post('/fulfill/check', async (req, res, next) => {
    console.log(req.body);
    await adminLogic.fulfillCheck(req.body)
        .then(function (result) {
            console.log(result);
            if (result) {
                let check = {
                    userID: req.body.userID,
                    checkID: req.body.checkID,
                    amount: req.body.addedValue,
                    type: 'positive',
                    reason: 'Check fulfillment',
                    date: new Date(),
                    by: req.body.by
                }
                paymentsLogic.addPayment(check);
                res.send(result);
            } else {
                res.send("User Not Found");
            }
        })
});
router.post('/deny/check/:id', async (req, res, next) => {
    await adminLogic.denyCheck(req.params.id)
        .then(function (result) {
            if (result) {
                res.send(result);
            } else {
                res.send("User Not Found");
            }
        })
});

router.post('/status/card', async (req, res, next) => {
    if (req.body.status === 'cancelled') {
        console.log(req.body.card.usedCredit);
        if (req.body.card.usedCredit !== 0) {
            let cardPayment = {
                userID: req.body.card.userID,
                cardID: req.body.card._id,
                amount: req.body.card.usedCredit,
                type: req.body.card.usedCredit > 0 ? 'Negative' : 'Positive',
                reason: `Cancel Card Credit Fulfillment -- Card Number:${req.body.card.cardNumber}`,
                date: new Date(),
                by: 'Dizzy Banking inc.'
            }
            userLogic.updateBalanceByUserID(req.body.card.userID, -req.body.card.usedCredit)
                .then(result => {
                    if (result) {
                        paymentsLogic.addPayment(cardPayment)
                            .then(result => {
                                console.log(result)
                                if (result) {
                                     adminLogic.changeCardStatus(req.body)
                                        .then(function (result) {
                                            console.log(result)
                                            if (result) {
                                                res.send(result);
                                            } else {
                                                res.send("Status Could Not Be Changed.");
                                            }
                                        })
                                } else {
                                    res.send(false);
                                }
                            })
                    } else {
                        res.send(false);
                    }
                })
        }
    } else {
        await adminLogic.changeCardStatus(req.body)
            .then(function (result) {
                console.log(result)
                if (result) {
                    res.send(result);
                } else {
                    res.send("Status Could Not Be Changed.");
                }
            })
    }

});

router.post('/delete/card/:id', async (req, res, next) => {
    await adminLogic.deleteCard(req.params.id)
        .then(function (result) {
            if (result) {
                res.send(result);
            } else {
                res.send("Status Could Not Be Changed.");
            }
        })
});

router.get('/admins', async (req, res, next) => {
    await adminLogic.findAdmins()
        .then((result) => {
            if (result) {
                res.send(result);
            } else {
                res.send("No Users Found");
            }
        })
});
module.exports = router;
