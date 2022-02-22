const
    router = require('express').Router(),
    loansLogic = require('../bll/loans-logic'),
    paymentsLogic = require('../bll/payments-logic');




// Registering
router.post('/add', (req, res, next) => {
    loansLogic.addLoan(req.body)
        .then(() => {
            res.send(req.body)
        })
});
router.get('/find/:id', async (req, res, next) => {
    await loansLogic.findLoans(req.params.id)
        .then(function (result) {
            if (result) {
                res.send(result);
            } else {
                res.send("User Not Found");
            }
        })
});
router.get('/find/pending/:id', async (req, res, next) => {
    await loansLogic.findPendingLoans(req.params.id)
        .then(function (result) {
            console.log(result);
            if (result) {
                res.send(result);
            } else {
                res.send("User Not Found");
            }
        })
});

router.post('/pay', (req, res, next) => {
    console.log('pay loan body');
    console.log(req.body);
    loansLogic.payLoanByID(req.body.deduction, req.body.loan)
        .then((result) => {
            if(result){
            let loan = {
                userID: req.body.loan.userID,
                loanID: req.body.loan._id,
                amount: req.body.deduction,
                type: 'negative',
                reason:'Loan manual pay',
                date: new Date(),
                by: 'Dizzy Banking inc.'

            }
            paymentsLogic.addPayment(loan);
            res.send(req.body)
        }else{
            res.sendStatus(500);
        }
        })
});

router.post('/delete', (req, res, next) => {
    console.log("DELETED");
    loansLogic.deleteLoanByID(req.body)
        .then(() => {
            res.send(req.body)
        })
});

module.exports = router;