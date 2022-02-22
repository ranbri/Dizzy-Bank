var ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://ranbarilan:node123@cluster0.9xaub.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

async function findAdmins() {
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

async function getMessagesByUserID(userID) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const cursor = await client
            .db("dizzyDB")
            .collection("messages")
            .find({ userID: userID })
            .toArray();
        if (cursor.length) {
            console.log(`Found a pending check collection with the name : ${cursor.length} (Get Messages By User ID)`);

        } else {
            console.log(`No listing found with the name: ${cursor} (Get Messages By User ID)`);
        }
        return cursor;
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}

async function getMessagesByAdminID(adminID) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const cursor = await client
            .db("dizzyDB")
            .collection("messages")
            .find({ adminID: adminID })
            .toArray();
        if (cursor.length) {
            console.log(`Found a pending check collection with the name : ${cursor.length} (Get Messages By Admin ID)`);

        } else {
            console.log(`No listing found with the name: ${cursor} (Get Messages By Admin ID)`);
        }
        return cursor;
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}

async function sendMessage(message) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const result = await client
            .db("dizzyDB")
            .collection("messages")
            .insertOne(message);
        console.log(`New Message created with the following id ${result.insertedId} (Send Message)`);
        return result.insertedId;
    } catch (e) {
        console.log(e);
    } finally {
        await client.close();
    }
}

async function sendRead(_id) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const result = await client
            .db("dizzyDB")
            .collection("messages")
            .updateOne({ "_id": ObjectId(_id) }, { $set: { "status": "read" } }, { upsert: true });
        console.log(` Message created with the following id ${result.insertedId} (Send Message)`);
        return true;
    } catch (e) {
        console.log(e);
    } finally {
        await client.close();
    }
}
module.exports = {
    findAdmins, sendMessage, getMessagesByUserID, getMessagesByAdminID, sendRead
}