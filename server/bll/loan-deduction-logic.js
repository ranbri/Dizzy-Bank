var ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://ranbarilan:node123@cluster0.9xaub.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

async function deductLoan() {
    let today = new Date().toDateString().slice(8, 10);
    if (+today === 1) {
        console.log("Reductions")
        const client = new MongoClient(uri);
        await client.connect();
        try {
            const cursor = client
                .db("dizzyDB")
                .collection("users")
                .find();
            const results = await cursor.toArray();
            if (results.length) {
                console.log(results.length);
                results.forEach(user => {
                    findAllUserLoan(user)
                });

            } else {
                console.log(`No listing found with the name: ${cursor} (Find Loans)`);

            }
            return results;
        } catch (err) {
            console.log(err);
        } finally {
            await client.close();
        }
    }

    async function findAllUserLoan(user) {
        const client2 = new MongoClient(uri);
        await client2.connect();
        try {
            const cursor = client2
                .db("dizzyDB")
                .collection("loans")
                .find({ "userID": user._id.toString() });
            const results = await cursor.toArray()
            if (results.length) {
                results.forEach(loan => {
                    let amount = loan.interestRate.slice(0, 3) * loan.payPerMonth;
                    deductLoanUserBalance(user, -amount, loan._id);
                });

                console.log(results.length)
            } else {
                console.log(results.length)
            }
        } catch (err) {
            console.log(err)
        } finally {
            await client2.close();
        }
    }
}
async function deductLoanUserBalance(user, amount, loanID) {
    const client3 = new MongoClient(uri);
    await client3.connect();
    try {
        const cursor = await client3
            .db("dizzyDB")
            .collection("users")
            .updateOne({ "_id": user._id }, { $inc: { balance: amount } }, { upsert: true });
        if (cursor.modifiedCount) {
            console.log(user.firstName + " " + user.lastName + "Deduct:");
            console.log(amount);
            deductLoanAmount(loanID, amount)
        } else {
            console.log("No Reduction ")
        }
    } catch (err) {
        console.log(err)
    } finally {
        await client3.close();
    }
}
async function deductLoanAmount(loanID, amount) {
    const client3 = new MongoClient(uri);
    await client3.connect();
    try {
        const cursor = await client3
            .db("dizzyDB")
            .collection("loans")
            .updateOne({ "_id": loanID }, { $inc: { remainingAmount: amount } }, { upsert: true });
        if (cursor.modifiedCount) {
            console.log('Deduction')
        } else {
            console.log(amount);
            console.log(results.length)
        }
    } catch (err) {
        console.log(err)
    } finally {
        await client3.close();
    }
}



module.exports = {
    deductLoan
}