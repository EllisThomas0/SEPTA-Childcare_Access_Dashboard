var mongoose = require('mongoose');

// DO NOT CHANGE THE URL FOR THE DATABASE!
// Please speak to the instructor if you need to do so or want to create your own instance
mongoose.connect('mongodb+srv://ethomas2:jKFf8pYKYZerXCVD@etbuscluster.fj6tntd.mongodb.net/ThesisData?retryWrites=true&w=majority');

// mongoose.connect('mongodb+srv://ethomas2:jKFf8pYKYZerXCVD@etbuscluster.fj6tntd.mongodb.net/?retryWrites=true&w=majority').
//   catch(error => handleError(error));

// try {
//     // await
//     mongoose.connect('mongodb+srv://ethomas2:jKFf8pYKYZerXCVD@etbuscluster.fj6tntd.mongodb.net/?retryWrites=true&w=majority');
//   } catch (error) {
//     // handleError(error);
//     console.log("connection error");
//   }

var Schema = mongoose.Schema;

var busStopSchema = new Schema({
    X: {type: Number, required: true},
    Y: {type: Number, required: true},
    FID: {type: Number, required: true, unique: true},
    LineAbbr: {type: Schema.Types.Mixed, required: true},
    DirectionN: {type: String, required: true},
    Sequence: {type: Number, required: true},
    StopId: {type: Number, required: true},
    StopAbbr: {type: String, required: true},
    StopName: {type: String, required: true},
    Lon: {type: Number, required: true},
    Lat: {type: Number, required: true},
    Mode: {type: String, required: true}
    }, {collection: 'OldSEPTABusStopData'});

// export busStopSchema as a class called BusStop
module.exports = mongoose.model('BusStop', busStopSchema);