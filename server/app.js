const server = require('express')();
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:4200',
    credentials: true,
    optionSuccessStatus: 200
};
const loanDeductionLogic = require('./bll/loan-deduction-logic');
const cardDeductionLogic = require('./bll/card-deduction-logic');
authController = require('./controllers/auth-controller');
userController = require('./controllers/user-controller');
checksController = require('./controllers/checks-controller');
stockController = require('./controllers/stocks-controller');
loansController = require('./controllers/loans-controller');
adminController = require('./controllers/admin-controller');
cardsController = require('./controllers/cards-controller');
adminController = require('./controllers/admin-controller');
messagesController = require('./controllers/messages-controller');
paymentsController = require('./controllers/payments-controller');
wireController = require('./controllers/wire-controller');

server.use(require('express').json());

server.use('/api/auth', cors(corsOptions), authController);
server.use('/api/user', cors(corsOptions), userController);
server.use('/api/checks', cors(corsOptions), checksController);
server.use('/stocks', cors(corsOptions), stockController);
server.use('/api/loans', cors(corsOptions), loansController);
server.use('/api/cards', cors(corsOptions), cardsController);
server.use('/api/admin', cors(corsOptions), adminController);
server.use('/api/messages', cors(corsOptions), messagesController);
server.use('/api/payments', cors(corsOptions), paymentsController);
server.use('/api/wire', cors(corsOptions), wireController);

loanDeductionLogic.deductLoan();//All users loans deduciton on the 1st of the month.
cardDeductionLogic.deductCards();//All users cards deduciton on the 1st of the month.
const PORT = 3000 || process.env.PORT;
//Server Setup
server.use(require('express').static(__dirname));
server.listen(PORT, 4200, () => console.log(`Connected to port 3000`));



