var mongoose = require('mongoose');
mongoose.connect(mongoCnxnLiteral);
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
