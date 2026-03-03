// Import the MongoDB Node.js driver
const MongoClient = require('mongodb').MongoClient;

// Connection URL
//Used a literal
const uri = uriLiteral;

// Database Name
const dbName = 'ThesisData';

// Collection Name
const collectionName = 'OldSEPTABusStopData';
var BusStop = require('./BusStop.js');

const client = new MongoClient(uri);

async function run() {
    try {
        const database = client.db(dbName);
        const busStops = database.collection(collectionName);

        database.collection(collectionName).find({}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            // db.close();
          });
        
        // console.log(bStop);
    }
    finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

run().catch(console.dir);
// client.close();
