var mongoose = require('mongoose');

mongoose.connect(mongoCnxnLiteral);

var Schema = mongoose.Schema;

var childcareCenterSchema = new Schema({
    "Master Provider ID": {type: Number, required: true},
    "Master Provider Location ID": {type: Number, required: true},
    "Provider Type": {type: String, required: true},
    "Facility Name": {type: String, required: true},
    "Facility Address": {type: String, required: true},
    "Facility Address (Continued)": {type: String},
    "Facility City": {type: String, required: true},
    "Facility State": {type: String, required: true},
    "Facility State FIPS Code": {type: Number, required: true},
    "Facility Zip Code": {type: Number, required: true},
    "Facility County": {type: String, required: true},
    "Facility County FIPS Code": {type: String, required: true},
    "Facility Phone": {type: String, required: true},
    "Facility Email": {type: String, required: true},
    "Facility Latitude & Longitude" : {type: String, required: true},
    "Legal Entity Latitude & Longitude": {type: String, required: true}
    }, {collection: 'ChildcareLocationData'});

// export childcareCenterSchema as a class called ChildcareCenter
module.exports = mongoose.model('ChildcareCenter', childcareCenterSchema);
