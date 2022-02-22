var ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://ranbarilan:node123@cluster0.9xaub.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

async function addCard(card) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const result = await client
            .db("dizzyDB")
            .collection("cards")
            .insertOne(card);
        console.log(`New User created with the following id ${result.insertedId} (Add Card)`);
        return result.insertedId;
    } catch {
        console.log(err);
    } finally {
        await client.close();
    }
}

async function findCards(userID) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const cursor = await client
            .db("dizzyDB")
            .collection("cards")
            .find({ userID: userID })
            .toArray();
        if (cursor.length) {
            console.log(`Found Card/s in the collection with the name : ${cursor} (find Card)`);
            return cursor;
        } else {
            console.log(`No listing found with the name: ${cursor} (find Card)`);
            return false;
        }
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
}

async function validateCardNumber(cardNumber) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const cursor = await client
            .db("dizzyDB")
            .collection("cards")
            .find({ cardNumber: cardNumber })
            .toArray();
        if (cursor.length) {
            console.log(true)
            return true
        } else {
            console.log(false)
            return false;
        }
    } catch {
        console.log("Error checkCardNumbar");
    } finally {
        client.close();
    }
}
async function updateCreditValidator(cardID, amount) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const cursor = await client
            .db("dizzyDB")
            .collection("cards")
            .find({ '_id': ObjectId(cardID) })
            .toArray()
        const card = cursor[0];
        console.log("card:");
        console.log(card);
        if (card) {
            let average = card.monthlyLimit - (card.usedCredit + amount) ;
            if (average >= 0) {
                const client2 = new MongoClient(uri);
                await client2.connect();
                try {
                    const update = await client2
                        .db('dizzyDB')
                        .collection('cards')
                        .updateOne({ '_id': ObjectId(cardID) }, { $inc: { 'usedCredit': amount } })
                    if (update.modifiedCount) {
                        return true
                    } else {
                        return false;
                    }
                } catch (err) {
                    console.log(err)
                } finally {
                    await client2.close()
                }
            } else {
                return false
            }

        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
}

async function CancelCardById(_id, status) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const result = await client
            .db("dizzyDB")
            .collection("cards")
            .updateOne({ "_id": ObjectId(_id) }, { $set: { "status": status } }, { upsert: true });

        console.log(`${result.matchedCount} document(s) matched the query critera  (Upsert Cancel Card to ${status})`);

        if (result.upsertedCount > 0) {
            console.log(`One document inserted with the id ${result.upsertedId} (Upsert Cancel Card to ${status})`)
        } else {
            console.log(`${result.modifiedCount} document(s) was/were updated (Upsert Cancel Card to ${status})`)
        }
    } catch (error) {
        console.log(error);
    } finally {
        await client.close();
    }
}

module.exports = {
    addCard, findCards, validateCardNumber, CancelCardById, updateCreditValidator
}