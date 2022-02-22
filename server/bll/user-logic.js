var ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://ranbarilan:node123@cluster0.9xaub.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

async function findUserByEmail(email) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const result = await client
            .db("dizzyDB")
            .collection("users")
            .findOne({ email: email });
        if (result) {
            console.log(`Found a listing in the collection with the name : 
        ${email}`);
            return true;
        } else {
            console.log(`No listing found with the name: ${email} (Find User By Email) `);
            return false;
        }
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}

async function isLoggedIn(email) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const result = await client
            .db("dizzyDB")
            .collection("users")
            .findOne({ email: email });
        if (result.loggedIn) {
            console.log(`User ${result.email} is logged in. (Is Logged In)`);
            return true;
        }
        if (result.loggedIn === false) {
            console.log(`User ${email} is not logged in  (is Logged In)`);
            return false;
        }

    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}

async function createUser(newUser, accountNumber) {
    newUser.accountNumber =accountNumber

    console.log(newUser);
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const result = await client
            .db("dizzyDB")
            .collection("users")
            .insertOne(newUser);
        console.log(`New User created with the following id ${result.insertedId} (Create User)`);
        return result.insertedId;
    } catch (e) {
        console.log(e);
    } finally {
        await client.close();
    }
}

async function findUserByEmail(email) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const result = await client
            .db("dizzyDB")
            .collection("users")
            .findOne({ email });
        if (result) {
            console.log(`Found a listing in the collection with the name : 
        ${email} (Find User By Email)`);
            return result;
        } else {
            console.log(`No Email found with the name: ${email} (Find User By Email)`);
            return false;
        }
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}

async function findUserByAccountNumber(accountNumber) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const result = await client
            .db("dizzyDB")
            .collection("users")
            .findOne({ accountNumber });
        if (result) {
            console.log(`Found a listing in the collection with the name : 
        ${accountNumber} (Find User By accountNumber)`);
            return result;
        } else {
            console.log(`No Account Number found with the name: ${accountNumber} (Find User By accountNumber)`);
            return false;
        }
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}

async function authUser(userEmail, state) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        await client
            .db("dizzyDB")
            .collection("users")
            .updateOne({ email: userEmail }, { $set: { loggedIn: state } }, { upsert: true });
        let status = state ? "is logged in" : "has been logged out (Auth User)";
        console.log(`${userEmail} ${status} Auth User  (Auth User)`);
    } catch {
        console.log("ERROR  (Auth User)");
    } finally {
        await client.close();
    }
}

async function findAuth(user) {
    const client = new MongoClient(uri);
    const client2 = new MongoClient(uri);
    await client.connect();
    try {
        const result = await client
            .db("dizzyDB")
            .collection("users")
            .findOne({ email: user.email });
        if (result.password == user.password) {
            await client2.connect();
            try {
                await client2
                    .db("dizzyDB")
                    .collection("users")
                    .updateOne({ email: user.email }, { $set: { loggedIn: true } }, { upsert: true });
                return result;
            } catch (err) {
                console.log(err);
            } finally {
                await client2.close();
            }
        } else {
            console.log(`(Find Auth) No listing found with the name: ${user.email}  (Find Auth)`);
            return false;
        }

    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }

}

async function upsertUserByEmail(userEmail, updatedEmail) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const result = await client
            .db("dizzyDB")
            .collection("users")
            .updateOne({ email: userEmail }, { $set: updatedEmail }, { upsert: true });

        console.log(`${result.matchedCount} document(s) matched the query critera  (Upsert User By Email)`);

        if (result.upsertedCount > 0) {
            console.log(`One document inserted with the id ${result.upsertedId} (Upsert User By Email)`)
        } else {
            console.log(`${result.modifiedCount} document(s) was/were updated (Upsert User By Email)`)
        }
    } catch {
        console.log("ERROR upsert by email");
    } finally {
        await client.close();
    }
}

async function updateBalanceByUserID(userID, value) {
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const result = await client
            .db("dizzyDB")
            .collection("users")
            .updateOne({ "_id": ObjectId(userID) }, { $inc: { balance: value } }, { upsert: true });
        console.log(result);
        if (result.matchedCount) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
        return false;
    } finally {
        await client.close()
    }

}
module.exports = {
    createUser, findUserByEmail, 
    upsertUserByEmail, isLoggedIn, 
    authUser, findAuth, 
    updateBalanceByUserID, findUserByAccountNumber
}