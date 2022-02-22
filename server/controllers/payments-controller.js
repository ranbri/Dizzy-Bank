const
    router = require('express').Router(),
    paymentsLogic = require('../bll/payments-logic');


    router.post('/add', (req, res, next) => {
        paymentsLogic.addPayment(req.body)
            .then((result)=>{
                if(result){
                    res.sendStatus(200);
                }else{
                    res.sendStatus(500);
                }
            });
    })


    router.get('/:id', (req, res, next) => {
        paymentsLogic.getPaymentsByUserID(req.params.id)
            .then((results)=>{
                if(results.length){
                    res.send(results);
                }else{
                    res.send('No payments found on this account.');
                }
            });
    })

    router.get('/card/:id', (req, res, next) => {
        paymentsLogic.getPaymentsByCardID(req.params.id)
            .then((results)=>{
                if(results.length){
                    res.send(results);
                }else{
                    res.send('No payments found on this card.');
                }
            });
    })



    module.exports = router;