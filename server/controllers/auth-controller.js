require('dotenv').config();
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const userLogic = require('../bll/user-logic');



// // Logging In
// router.post('/login', async (req, res, next) => {
//     if (req.body.password && req.body.email) {
//         await userLogic.findAuth(req.body)
//             .then(function (result) {
//                 if (result) {
//                     res.send(result);
//                 } else {
//                     res.send(false);;
//                 }
//             })
//     }
// });


router.get('/login', authenticateToken, (req, res, next) => {

    console.log(req.body);
})

// Logging In
router.post('/authUser', async (req, res, next) => {
    const accessToken = jwt.sign(req.body, process.env.ACCESS_TOKEN_SECRET);
    res.json(accessToken);
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(500);
        }
        if (user.password && user.email) {
            userLogic.findAuth(user)
                .then(function (result) {
                    if (result) {
                        delete result.password;
                        console.log(result);
                        res.send(result);
                    } else {
                        res.send(false);;
                    }
                })
        }
        next()
    })
}

// Logging Out
router.get('/logout', logoutUserViaToken,  (req, res, next) => {

});
function logoutUserViaToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(token);
        console.log(process.env.ACCESS_TOKEN_SECRET);
        if (err) {
            return res.sendStatus(500);
        }
        if (user.password && user.email) {
            userLogic.isLoggedIn(user.email)
            .then(function (result) {
                if (result) {
                    userLogic.authUser(user.email, false);
                } else {
                    res.send("User Not Found");
                }
            })
        }
        next()
    })
}


module.exports = router;