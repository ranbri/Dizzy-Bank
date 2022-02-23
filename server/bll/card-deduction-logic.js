var ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://ranbarilan:node123@cluster0.9xaub.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

async function deductCards() {
    let today = new Date().toDateString().slice(8, 10);
    if (+today === 1) {
        console.log("Reductions - cards")
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
                    findAllUserCards(user)
                });

            } else {
                console.log(`No listing found with the name: ${cursor} (Find Cards)`);

            }
            return results;
        } catch (err) {
            console.log(err);
        } finally {
            await client.close();
        }
    }

    async function findAllUserCards(user) {
        const client2 = new MongoClient(uri);
        await client2.connect();
        try {
            const cursor = client2
                .db("dizzyDB")
                .collection("cards")
                .find({ "userID": user._id.toString() });
            const results = await cursor.toArray()
            if (results.length) {
                results.forEach(card => {
                    let usedCredit = card.usedCredit;
                    deductCardUserBalance(user, -usedCredit, card._id);
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
async function deductCardUserBalance(user, amount, cardID) {
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
            deductCardAmount(cardID, amount)
        } else {
            console.log("No Reduction ")
        }
    } catch (err) {
        console.log(err)
    } finally {
        await client3.close();
    }
}
async function deductCardAmount(cardID, amount) {
    const client3 = new MongoClient(uri);
    await client3.connect();
    try {
        const cursor = await client3
            .db("dizzyDB")
            .collection("cards")
            .updateOne({ "_id": cardID }, { $inc: { usedCredit: amount } }, { upsert: true });
        if (cursor.modifiedCount) {
            console.log('Deduction - card')
        } else {
            console.log(amount);
            console.log(cursor)
        }
    } catch (err) {
        console.log(err)
    } finally {
        console.log('Cards deduction success')
        await client3.close();
    }
}



module.exports = {
    deductCards
}