var ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb'),
    uri = `mongodb+srv://ranbarilan:node123@cluster0.9xaub.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


async function fulfillLoan(fulfillLoan) {
    const client = new MongoClient(uri);
    await client.connect();
    let increase = {
        userID: fulfillLoan.userID,
        loanID: fulfillLoan.loanID,
        addedValue: fulfillLoan.addedValue,
        dateApproved: fulfillLoan.dateApproved
    }
    try {
        const result = await client
            .db("dizzyDB")
            .collection("users")
            .updateOne({ "_id": ObjectId(increase.userID) }, { $inc: { balance: increase.addedValue } }, { upsert: true });

        console.log(`${result.matchedCount} document(s) matched the query critera (fulfill loan)`);

        if (result.modifiedCount) {
            console.log(`One document inserted with the id ${result.upsertedId} (fulfill loan)`)
            return true
        } else {
            console.log(`${result.modifiedCount} document(s) was/were updated (fulfill loan)`)
            return false
        }
    } catch {
        console.log("ERROR (fulfill loan)");
    } finally {
        const client2 = new MongoClient(uri);
        try {
            await client2.connect();
            const result = await client2
                .db("dizzyDB")
                .collection("loans")
                .updateOne({ "_id": ObjectId(increase.loanID) }, { $set: { "status": "approved", "fulfilled": true, "dateApproved": increase.dateApproved } }, { upsert: true });
            if (result.modifiedCount) {
                return true
            } else {
                return false
            }
        } catch (err) {
            console.log(err);
        } finally {
            await client2.close();
        }
        await client.close();
    }
}
async function denyLoan(loanID) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const result = await client
            .db("dizzyDB")
            .collection("loans")
            .updateOne({ "_id": ObjectId(loanID) }, { $set: { "status": "denied" } }, { upsert: true });
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}
async function fulfillCheck(fulfillCheck) {
    const client = new MongoClient(uri);
    await client.connect();
    let increase = {
        userID: fulfillCheck.userID,
        checkID: fulfillCheck.checkID,
        addedValue: fulfillCheck.addedValue,
        dateApproved: fulfillCheck.dateApproved
    }
    try {
        const result = await client
            .db("dizzyDB")
            .collection("users")
            .updateOne({ "_id": ObjectId(increase.userID) }, { $inc: { balance: increase.addedValue } }, { upsert: true });

        console.log(`${result.matchedCount} document(s) matched the query critera (fulfill check)`);

        if (result.upsertedCount > 0) {
            console.log(`One document inserted with the id ${result.upsertedId} (fulfill check)`)
        } else {
            console.log(`${result.modifiedCount} document(s) was/were updated (fulfill check)`)
        }
    } catch {
        console.log("ERROR (fulfill check)");
    } finally {
        await client.close();
        const client2 = new MongoClient(uri);
        await client2.connect();
        try {
            const result = await client2
                .db("dizzyDB")
                .collection("checks")
                .updateOne({ "_id": ObjectId(increase.checkID) }, { $set: { "status": "approved", "fulfilled": true, "dateApproved": increase.dateApproved } }, { upsert: true });
            if (result.modifiedCount) {
                return true
            } else {
                return false
            }
        } catch (err) {
            console.log(err);
        } finally {
            await client2.close();
        }


    }
}
async function denyCheck(checkID) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const result = await client
            .db("dizzyDB")
            .collection("checks")
            .updateOne({ "_id": ObjectId(checkID) }, { $set: { "status": "denied" } }, { upsert: true });
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}
async function changeCardStatus(change) {
    const usedCredit = change.status === 'cancelled' ? 0 : change.card.usedCredit;
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const result = await client
            .db("dizzyDB")
            .collection("cards")
            .updateOne({ "_id": ObjectId(change.card._id) }, { $set: { "status": change.status, usedCredit } }, { upsert: true });
        if (result.modifiedCount) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}
async function deleteCard(cardID) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const result = await client
            .db("dizzyDB")
            .collection("cards")
            .updateOne({ "_id": ObjectId(cardID) }, {
                $unset: {
                    'balance': "",
                    'balance': "",
                    'expYear': "",
                    'expMonth': "",
                    'usedCredit': "",
                    'monthlyLimit': "",
                    'userID': ""
                }
            }
            );
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}

changeCardStatus
async function findUsers() {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const cursor = client
            .db("dizzyDB")
            .collection("users")
            .find({ isAdmin: false });
        if (cursor) {
            console.log(`Found a pending check collection with the name : ${cursor} (Find Users)`);

        } else {
            console.log(`No listing found with the name: ${cursor} (Find Users)`);

        }
        const results = await cursor.toArray()
        return results;
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}
async function findAdmins() {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const cursor = client
            .db("dizzyDB")
            .collection("users")
            .find({ isAdmin: true });
        if (cursor) {
            console.log(`Found a pending check collection with the name : ${cursor} (Find Admins)`);

        } else {
            console.log(`No listing found with the name: ${cursor} (Find Admins)`);

        }
        const results = await cursor.toArray()
        return results;
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}

module.exports = {
    findUsers, fulfillLoan, denyLoan, fulfillCheck, denyCheck, findAdmins, changeCardStatus, deleteCard
}