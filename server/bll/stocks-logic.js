var ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb'),
    uri = `mongodb+srv://ranbarilan:node123@cluster0.9xaub.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

async function addStock(stock) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const result = await client
            .db("dizzyDB")
            .collection("stocks")
            .insertOne(stock);
        console.log(`New User created with the following id ${result.insertedId} (Add Stock)`);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    } finally {
        await client.close();
    }
}
async function getStocksByUserID(userID) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const result = await client
        .db("dizzyDB")
        .collection("stocks")
            .find({ userID })
            .toArray()
        console.log('get stocks:' + result.length);
        if (result.length) {
            return result;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
        return false;
    } finally {
        await client.close();
    }
}


async function sellStock(sellStock) {
    let newTotal = sellStock.sellSize * sellStock.sellPrice;
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const result = await client
            .db("dizzyDB")
            .collection("stocks")
            .updateOne(
                { '_id': ObjectId(sellStock.stock._id) },
                { $inc: { 'total': -newTotal, 'size': -sellStock.sellSize } },
                { 'ask': sellStock.sellPrice },
                { upsert: true });
        if (result.modifiedCount) {
            console.log(result)
            return true
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
        return false;
    } finally {
        await client.close();
    }
}
async function deleteStock(_id) {
    let newTotal = sellStock.sellSize * sellStock.sellPrice;
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const result = await client
            .db("dizzyDB")
            .collection("stocks")
            .deleteOne(
                { '_id': ObjectId(_id) });
        if (result.deletedCount) {

            console.log(_id)
            console.log(result)
            return true
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
        return false;
    } finally {
        await client.close();
    }
}


module.exports = {
    addStock, getStocksByUserID, sellStock, deleteStock
}