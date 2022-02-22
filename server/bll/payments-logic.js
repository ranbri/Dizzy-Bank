var ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://ranbarilan:node123@cluster0.9xaub.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;





async function getPaymentsByUserID(userID) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const cursor = await client
            .db("dizzyDB")
            .collection("payments")
            .find({ userID: userID })
            .toArray();
        if (cursor.length) {
            return cursor
        } else {
            return false
        }
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
}

async function getPaymentsByCardID(cardID) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const cursor = await client
            .db("dizzyDB")
            .collection("payments")
            .find({ cardID })
            .toArray();
        if (cursor.length) {
            return cursor
        } else {
            return false
        }
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
}

async function addPayment(payment) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const cursor = await client
            .db("dizzyDB")
            .collection("payments")
            .insertOne(payment);
        if (cursor.insertedId) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
}


module.exports = {
    getPaymentsByUserID, addPayment, getPaymentsByCardID
}