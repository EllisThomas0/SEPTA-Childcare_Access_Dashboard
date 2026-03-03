// Import the MongoDB Node.js driver
const MongoClient = require('mongodb').MongoClient;

// Connection URL
const uri = 'mongodb+srv://ethomas2:jKFf8pYKYZerXCVD@etbuscluster.fj6tntd.mongodb.net/ThesisData?retryWrites=true&w=majority';

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

        // // var filter = { 'FID' : 1 };
        // // BusStop.findOne(filter)
	    // // .then((b) => {
        // //     console.log(b);
        // //     res.json({'busStop' : b})
	    // // 	// then show the form from the EJS template
	    // // 	// res.render('eventform', {'person' : p})
	    // // })
        // // .catch((err) => {
        // //     // res.type('html').status(200);
        // //     // console.log('uh oh: ' + err);
        // //     // res.send(err);
        // //     console.log(err);
        // // })
        

        // // Query for a movie that has the title 'Back to the Future'
        // // const query = { title: 'Back to the Future' };
        // var filter = { 'FID' : 1 };
        // // const movie = await movies.findOne(query);
        // const bStop = await busStops.findOne(filter);


        // busStops.find({}).toArray((err, docs) => {
        //     // if (err) {
        //     //     console.error('Error occurred while fetching documents:', err);
        //     //     client.close();
        //     //     return;
        //     // }
            
        //     // Loop through each document and print the value of the field named "Longitude"
        //     // docs.forEach(doc => {
        //     //     console.log('Longitude:', doc.Lon);
                
        //     // });
        // });
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