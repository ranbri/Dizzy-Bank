var ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://ranbarilan:node123@cluster0.9xaub.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

async function addLoan(loan) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const result = await client
            .db("dizzyDB")
            .collection("loans")
            .insertOne(loan);
        console.log(`New Loan created with the following id ${result.insertedId} (add Loan)`);
        return result.insertedId;
    } catch (e) {
        console.log(e);
    } finally {
        await client.close();
    }
}

async function findLoans(userID) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const cursor = client
            .db("dizzyDB")
            .collection("loans")
            .find({ userID: userID });
        if (cursor) {
            console.log(`Found a listing in the collection with the name : ${cursor} (Find Loans)`);
        } else {
            console.log(`No listing found with the name: ${cursor} (Find Loans)`);
        }
        const results = await cursor.toArray()
        return results;
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}

async function findPendingLoans(userID) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const cursor = client
            .db("dizzyDB")
            .collection("loans")
            .find({ userID: userID, status: "pending" });
        if (cursor) {
            console.log(`Found Pending Loans in the collection with the name : ${cursor} (Find Loans)`);

        } else {
            console.log(`No listing found with the name: ${cursor} (Find Loans)`);

        }
        const results = await cursor.toArray()
        return results;
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}

async function payLoanByID(deduction, loan) {
    const client2 = new MongoClient(uri);
    await client2.connect();
    try {
        const result = await client2
            .db("dizzyDB")
            .collection("users")
            .updateOne({ "_id": ObjectId(loan.userID) }, { $inc: { balance: Number(deduction) } }, { upsert: true });
        if (result.modifiedCount) {
            return true
        } else {
            return false
        }
    } catch (err) {
        console.log(err);
    } finally {
        await client2.close();
        if (deduction < 0) {
            const client = new MongoClient(uri);
            await client.connect();
            try {
                const result = await client
                    .db("dizzyDB")
                    .collection("loans")
                    .updateOne({ "_id": ObjectId(loan._id) }, { $inc: { remainingAmount: Number(deduction) } }, { upsert: true });

                console.log(`${result.matchedCount} document(s) matched the query critera (payLoanByID)`);
                if (result.modifiedCount) {
                    return true
                } else {
                    return false
                }
            } catch (err) {
                console.log(err);
            } finally {
                await client.close();
            }
        }
    }
}
async function deleteLoanByID(loan) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const result = await client
            .db("dizzyDB")
            .collection("loans")
            .deleteOne({ "_id": ObjectId(loan._id) });
        if (result.deletedCount > 0) {
            console.log(`One document inserted with the id ${loan._id} has been deleted! (deleteLoanByID)`)
        } else {
            console.log(`No loans was deleted`)
        }
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}

module.exports = {
    addLoan, findLoans, findPendingLoans, payLoanByID, deleteLoanByID
}