const
    router = require('express').Router(),
    userLogic = require('../bll/user-logic');

// Registering
router.post('/register', (req, res, next) => {
    userLogic.findUserByEmail(req.body.email)
        .then(
            function (result) {
                if (result) {
                    res.send('Email already exists.');
                    return;

                } else {
                    let random1 = Math.floor(Math.random() * 10).toString();
                    let random2 = Math.floor(Math.random() * 10).toString();
                    let random3 = Math.floor(Math.random() * 10).toString();
                    let random4 = Math.floor(Math.random() * 10).toString();
                    let random5 = Math.floor(Math.random() * 10).toString();
                    let random6 = Math.floor(Math.random() * 10).toString();
                    let random7 = Math.floor(Math.random() * 10).toString();
                    let random8 = Math.floor(Math.random() * 10).toString();
                    let random9 = Math.floor(Math.random() * 10).toString();
                    let dizzyNum = '13';
                    let accountNumber =
                        dizzyNum + random1 + random2 + random3 + random4 + random5 + random6 + random7 + random8 + random9;
                    let logic = true;
                    if (logic) {
                        userLogic.findUserByAccountNumber(accountNumber)
                            .then(result => {
                                if (result) {
                                    let random1 = Math.floor(Math.random() * 10).toString();
                                    let random2 = Math.floor(Math.random() * 10).toString();
                                    let random3 = Math.floor(Math.random() * 10).toString();
                                    let random4 = Math.floor(Math.random() * 10).toString();
                                    let random5 = Math.floor(Math.random() * 10).toString();
                                    let random6 = Math.floor(Math.random() * 10).toString();
                                    let random7 = Math.floor(Math.random() * 10).toString();
                                    let random8 = Math.floor(Math.random() * 10).toString();
                                    let random9 = Math.floor(Math.random() * 10).toString();
                                    let dizzyNum = '13';
                                    let newAccountNumber =
                                        dizzyNum + random1 + random2 + random3 + random4 + random5 + random6 + random7 + random8 + random9;
                                    userLogic.findUserByAccountNumber(newAccountNumber);
                                    console.log(newAccountNumber);
                                } else {
                                    logic = false;
                                    userLogic.createUser(req.body, accountNumber)
                                        .then((id) => {
                                            res.send(id);
                                        })
                                }
                            })
                    }

                }
            })

})

router.get('/number/:number', async (req, res, next) => {
    await userLogic.findUserByAccountNumber(req.params.number)
        .then(function (result) {
            if (result) {
                res.send(result)
            } else {
                res.send(false);
            }
        })
});




module.exports = router;