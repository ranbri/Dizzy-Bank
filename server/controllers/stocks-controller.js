const
    router = require('express').Router(),
    stocksLogic = require('../bll/stocks-logic'),
    paymentsLogic = require('../bll/payments-logic'),
    userLogic = require('../bll/user-logic'),
    cardsLogic = require('../bll/cards-logic'),
    yahooFinance = require('yahoo-finance');


router.post('/add', (req, res) => {
    stocksLogic.addStock(req.body)
        .then((result) => {
            let payment = {
                userID: req.body.userID,
                cardID: req.body.cardID ? req.body.cardID : '',
                amount: -req.body.total,
                type: 'negative',
                reason: `Stock -- Buy: ${req.body.symbol} | Size: x${req.body.size}`,
                date: new Date(),
                by: 'Stock - Exchange',
                payType: req.body.cardID ? 'credit' : 'balance'
            }
            if (result) {
                paymentsLogic.addPayment(payment)
                    .then(result => {
                        if (result) {
                            if (req.body.cardID) {
                                cardsLogic.updateCreditValidator(req.body.cardID, req.body.total)
                                    .then(result => {
                                        console.log(result)
                                        if (result) {
                                            res.send(true);
                                        } else {
                                            res.send(false);
                                        }
                                    })
                            } else {
                                userLogic.updateBalanceByUserID(req.body.userID, -req.body.total)
                                    .then(result => {
                                        if (result) {
                                            res.send(true);
                                        } else {
                                            res.send(false);
                                        }
                                    })
                            }

                        } else {
                            res.sendStatus(500);
                        }
                    })
            } else {
                res.sendStatus(500);
            }

        })
    console.log(req.body);
})
router.post('/sell', (req, res) => {

    console.log(req.body)
    if (req.body.sellSize < req.body.stock.size) {
        let payment = {
            userID: req.body.stock.userID,
            cardID: req.body.stock.cardID ? req.body.stock.cardID : '',
            amount: req.body.sellSize * req.body.sellPrice,
            type: 'positive',
            reason: `Stock -- Sell: ${req.body.stock.symbol} | Quantity: x${req.body.sellSize}`,
            date: new Date(),
            by: 'Stock - Exchange',
            payType: req.body.stock.cardID ? 'credit' : 'balance'
        }
        stocksLogic.sellStock(req.body)
            .then(result => {
                if (result) {
                    paymentsLogic.addPayment(payment)
                        .then(result => {
                            console.log('addPAym results')
                            console.log(result);
                            if (result) {
                                if (payment.cardID) {
                                    cardsLogic.updateCreditValidator(payment.cardID, payment.amount)
                                        .then(result => {
                                            console.log('here')
                                            if (result) {
                                                res.send(true);
                                            } else {
                                                res.send(false);
                                            }
                                        })
                                } else {
                                    userLogic.updateBalanceByUserID(req.body.stock.userID, req.body.sellSize * req.body.sellPrice)
                                        .then(result => {
                                            if (result) {
                                                res.send(true);
                                            } else {
                                                res.send(false);
                                            }
                                        })
                                }


                            } else {
                                res.send(false);
                            }
                        })
                } else {
                    res.send(false);
                }
            })
    }
    if (req.body.sellSize === req.body.stock.size) {
        let payment = {
            userID: req.body.stock.userID,
            cardID: req.body.stock.cardID ? req.body.stock.cardID : '',
            amount: req.body.sellSize * req.body.sellPrice,
            type: 'positive',
            reason: `Stock -- Sell Whole: ${req.body.stock.symbol} | Quantity: x${req.body.sellSize}`,
            date: new Date(),
            by: 'Stock - Exchange',
            payType: req.body.stock.cardID ? 'credit' : 'balance'
        }
        stocksLogic.deleteStock(req.body.stock._id)
            .then(result => {
                if (result) {
                    paymentsLogic.addPayment(payment)
                        .then(result => {
                            console.log('addPAym results')
                            console.log(result);
                            if (result) {
                                if (payment.cardID) {
                                    cardsLogic.updateCreditValidator(payment.cardID, -payment.amount)
                                        .then(result => {
                                            console.log(result);
                                            console.log('Delete Stock - card result ' + result)
                                            if (result) {
                                                res.send(true);
                                            } else {
                                                res.send(false);
                                            }
                                        })
                                } else {
                                    userLogic.updateBalanceByUserID(req.body.stock.userID, req.body.sellSize * req.body.sellPrice)
                                        .then(result => {
                                            console.log('Delete Stock - balance result ' + result)
                                            if (result) {
                                                res.send(true);
                                            } else {
                                                res.send(false);
                                            }
                                        })
                                }
                            } else {
                                res.send(false);
                            }
                        })
                } else {
                    res.sendStatus(500);
                }
            })
    }
})

router.get('/get/:userID', (req, res) => {
    const userID = req.params.userID;
    stocksLogic.getStocksByUserID(userID)
        .then(result => {
            if (result) {
                res.send(result);
            } else {
                res.send(false);
            }
        })
})



router.get('/:symbol', (req, res) => {
    const symbol = req.params.symbol;

    yahooFinance.quote({
        symbol: symbol,
        modules: ['price', 'summaryDetail'] // see the docs for the full list
    }, function (err, quotes) {
        if (err) {
            return res.send('No Stock Found');
        }
        if (quotes) {
            return res.json(quotes);
        }
    });
})


router.get('/:symbol/:year/:month/:endDay', (req, res) => {
    const symbol = req.params.symbol;
    const year = req.params.year;
    const month = req.params.month;
    const endDay = req.params.endDay;
    yahooFinance.historical({
        symbol: symbol,
        from: `${year}-${month}-01`,
        to: `${year}-${month}-${endDay}`,
        period: 'd'

    }, function (err, quotes) {
        if (err) {
            return res.status(500).json("Not Available");
        } return res.json(quotes);

    });
})


module.exports = router;