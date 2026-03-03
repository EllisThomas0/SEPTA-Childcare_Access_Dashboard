// set up Express
var express = require('express');
var app = express();

// set up BodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// set up EJS
app.set('view engine', 'ejs');

// import the BusStop class from BusStop.js
var BusStop = require('./BusStop.js');
var ChildcareCenter = require('./ChildcareCenter.js');
// var ObjectId = require('mongodb').ObjectId; 

//endpoint for the homepage
app.get('/', (req, res)=>{
	res.render('homepage');
})

// app.use('/all', (req, res) => {
// })

app.use('/1a_busLines', (req, res) => {
    var filter = {"Mode": {"$ne": "Highspeed"}};
    BusStop.aggregate([
        {$match: filter},
        {$group: {_id: "$LineAbbr", Mode: { $first: "$Mode"}}},
        {$sort: {_id: 1}}
    ])
    .then((busLines) => {
        // res.status(200).json({ busLines });
        res.render('1a_busLines', {'busLines' : busLines})
    })
    .catch((err) => {
        res.type('html').status(200);
        console.log('uh oh: ' + err);
        res.send(err);
    })
    
})

app.use('/1b_allStops', (req, res) => {
    var busLine = req.query.LineAbbr;
    var filter;
    let isNum = /^\d+$/.test(busLine);
    if (isNum){
        filter = {"LineAbbr": parseInt(busLine)};
    } else {
        filter = {"LineAbbr": busLine};
    }

    BusStop.find(filter)
    .sort({DirectionN: 1})
    .sort({Sequence: 1})
	.then((busStops) => {
        // console.log(busStops);
        res.render('1b_allStops', {'busLine': busLine, 'busStops' : busStops});
	})
    .catch((err) => {
        res.type('html').status(200);
        console.log('uh oh: ' + err);
        res.send(err);
    })

})

app.use('/1c_stopQuery', (req, res) => {
    var givenbusStopId = req.query.busStopId;
    var filter = {"StopId": parseInt(givenbusStopId)};

    var givenBusStop;
    var givenLat;
    var givenLon;
    const closeCCCs = [];
    const distances = [];
    const latVals = [];
    const lonVals = [];

    BusStop.findOne(filter)
	.then((foundBusStop) => {
        givenBusStop = foundBusStop;
	})
    .catch((err) => {
        res.type('html').status(200);
        console.log('uh oh: ' + err);
        res.send(err);
    })

    ChildcareCenter.find({})
    .then((cccs) => {
        for (let i = 0; i < cccs.length; i++) {
            const fields = cccs[i]["Facility Latitude & Longitude"].split(/[(,)]/);
            const latAndLon = fields[1].split(' ');
            //the point/object values give longitude, latitude, which is unusual
            givenLat = latAndLon[1];
            givenLon = latAndLon[0];
            const curDist =  calculateDistance(givenBusStop.Lat, givenBusStop.Lon, givenLat, givenLon);

            if (curDist < 0.4){
                latVals.push(givenLat);
                lonVals.push(givenLon);
                distances.push(curDist);
                closeCCCs.push(cccs[i]);
                // closeCCCs.push({"distFromStop": curDist, "childcareCenter": cccs[i]});
            }
        }

        const distancesCopySorted = distances.toSorted();
        // console.log(distancesCopySorted);

        const closeCCCsSorted = [];
        const latValsSorted = [];
        const lonValsSorted = [];

        for (let i = 0; i < distancesCopySorted.length; i++){
            for (let t = 0; t < distances.length; t++){
                if (distancesCopySorted[i] == distances[t]){
                    closeCCCsSorted.push(closeCCCs[t]);
                    latValsSorted.push(latVals[t]);
                    lonValsSorted.push(lonVals[t]);
                }
            }
        }

        const distancesShortened = [];
        for (let i = 0; i < distancesCopySorted.length; i++){
            distancesShortened.push(distancesCopySorted[i].toFixed(2));
        }

        // res.render('stopQuery', {'busStop': givenBusStop, 'distances': distances, 'latVals': latVals, 'lonVals': lonVals, 'childcareCenters' : closeCCCs});
        res.render('1c_stopQuery', {'busStop': givenBusStop, 'distances': distancesShortened, 'latVals': latValsSorted, 'lonVals': lonValsSorted, 'childcareCenters' : closeCCCsSorted});


    })
    .catch((err) => {
        res.type('html').status(200);
        console.log('uh oh: ' + err);
        res.send(err);
    })

})

app.use('/2a_ccSearch', (req, res) => {
    res.render('2a_ccSearch')
})

app.use('/2b_ccFind', (req, res) => {
    var searchTerms = req.query.ccSearchTerms;
    //{"Facility Name": { "$regex": "(?=.*at)(?=.*ab)", "$options": "i" }}

    const searchTermsArr = searchTerms.split(' ');
    var filterString = '';
    for (let i = 0; i < searchTermsArr.length; i++) {
        var stringToAppend = "(?=.*" + searchTermsArr[i] + ")";
        filterString += stringToAppend;
    }
    var filter = {"Facility Name": { "$regex": filterString, "$options": "i" }};

    ChildcareCenter.find(filter)
	.then((cccs) => {
        res.render('2b_ccFind', {'childcareCenters' : cccs});
	})
    .catch((err) => {
        res.type('html').status(200);
        console.log('uh oh: ' + err);
        res.send(err);
    })
})

app.use('/2c_ccQuery', (req, res) => {//pick a childcare location and query closest bus stop
    var givenCCId = req.query.ccId;
    var filter = {_id: givenCCId};

    var givenCC;
    var givenCCLatLongString;
    var givenCCLat;
    var givenCCLon;
    const closeBusStops = [];
    const distances = [];
    const latVals = [];
    const lonVals = [];
    const ccIds = [];

    ChildcareCenter.findOne(filter)
	.then((foundCC) => {
        givenCC = foundCC;
        givenCCLatLongString = foundCC['Facility Latitude & Longitude'];
        const fields = givenCCLatLongString.split(/[(,)]/);
        const latAndLon = fields[1].split(' ');
        givenCCLat = latAndLon[1];
        givenCCLon = latAndLon[0];
	})
    .catch((err) => {
        res.type('html').status(200);
        console.log('uh oh: ' + err);
        res.send(err);
    })

    BusStop.find({})
    .then((busStops) => {
        for (let i = 0; i < busStops.length; i++) {
            const curDist = calculateDistance(busStops[i].Lat, busStops[i].Lon, givenCCLat, givenCCLon);

            if (curDist < 0.2){
                latVals.push(busStops[i].Lat);
                lonVals.push(busStops[i].Lon);
                distances.push(curDist);
                closeBusStops.push(busStops[i]);

            }
        }

        const distancesCopySorted = distances.toSorted();
        // console.log(distancesCopySorted);

        const closeBusStopsSorted = [];
        const latValsSorted = [];
        const lonValsSorted = [];

        for (let i = 0; i < distancesCopySorted.length; i++){
            for (let t = 0; t < distances.length; t++){
                if (distancesCopySorted[i] == distances[t]){
                    closeBusStopsSorted.push(closeBusStops[t]);
                    latValsSorted.push(latVals[t]);
                    lonValsSorted.push(lonVals[t]);
                }
            }
        }

        // res.render('stopQuery', {'busStop': givenBusStop, 'distances': distances, 'latVals': latVals, 'lonVals': lonVals, 'childcareCenters' : closeCCCs});
        // res.render('1c_stopQuery', {'busStop': givenBusStop, 'distances': distancesCopySorted, 'latVals': latValsSorted, 'lonVals': lonValsSorted, 'childcareCenters' : closeCCCsSorted});
        const distancesShortened = [];
        for (let i = 0; i < distancesCopySorted.length; i++){
            distancesShortened.push(distancesCopySorted[i].toFixed(2));
        }

        res.render('2c_ccQuery', {'childcareCenter': givenCC, 'givenCCLat' : givenCCLat, 'givenCCLon' : givenCCLon, 'distances': distancesShortened, 'latVals': latValsSorted, 'lonVals': lonValsSorted, 'busStops' : closeBusStopsSorted});

    })
    .catch((err) => {
        res.type('html').status(200);
        console.log('uh oh: ' + err);
        res.send(err);
    })

})



function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadiusMiles = 3958.8; // Radius of the Earth in miles
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    const distance = earthRadiusMiles * c;
    
    return distance;
}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

/*************************************************
Do not change anything below here!
*************************************************/

app.use('/public', express.static('public'));

// this redirects any other request to the "all" endpoint
app.use('/', (req, res) => { res.redirect('/all'); } );

// this port number has been assigned to your group
var port = 3006

app.listen(port,  () => {
	console.log('Listening on port ' + port);
    });
