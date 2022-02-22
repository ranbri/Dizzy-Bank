const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://ranbarilan:node123@cluster0.9xaub.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
    
async function addCheck(check) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const result = await client
            .db("dizzyDB")
            .collection("checks")
            .insertOne(check);
        console.log(`New User created with the following id ${result.insertedId} (Add Check)`);
        return result.insertedId;
    } catch (e) {
        console.log(e);
    } finally {
        await client.close();
    }
}

async function findPaychecks(userID) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const cursor = client
            .db("dizzyDB")
            .collection("checks")
            .find({ userID: userID });
        if (cursor) {
            console.log(`Found a listing in the collection with the name : ${cursor} (Find PayCheck)`);

        } else {
            console.log(`No listing found with the name: ${cursor} (Find PayCheck)`);

        }
        const results = await cursor.toArray()
        return results;
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}

async function findPendingPaychecks(userID) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const cursor = client
            .db("dizzyDB")
            .collection("checks")
            .find({ userID: userID, status: "pending" });
        if (cursor) {
            console.log(`Found a pending check collection with the name : ${cursor} (Find PayCheck)`);

        } else {
            console.log(`No listing found with the name: ${cursor} (Find PayCheck)`);

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
    addCheck, findPaychecks, findPendingPaychecks
}