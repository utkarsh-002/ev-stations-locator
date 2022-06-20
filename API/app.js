const express =  require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const axios = require('axios');
const Station = require('./models/station');
const GoogleMapsService = require('./services/googleMapsServices');
const googleMapsServices = new GoogleMapsService();
require('dotenv').config();

app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin',"*");
    next();
})
mongoose.connect('mongodb+srv://utkarsh:QMdfBjqHtFaBiFiZ@cluster0.dyqfj.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

app.use(express.json({ limit: '50mb'}));

app.get('/api/stations',(req,res)=> {
    const zipCode = req.query.zip_code;
    googleMapsServices.getCoordinates(zipCode).then((coordinates)=>{
            Station.find({
                location: {
                    $near: {
                        $maxDistance: 35000,
                        $geometry: {
                            type: "Point",
                            coordinates: coordinates
                        }
                    }
                }
            }, (err, stations)=>{
                if(err)
                res.status(500).send(err);
            else{
                console.log(coordinates);
                res.status(200).send(stations);
            }
            })
        }).catch((error)=>{
            console.log(error)
        })
})

app.get('/api/currStations',(req,res)=> {
    Station.find({
        location: {
            $near: {
                $maxDistance: 35000,
                 $geometry: {
                    type: "Point",
                    coordinates: [req.query.longitude, req.query.latitude]
                }
            }
        }
     }).find((err, stations)=>{
         if(err)
         res.status(500).send(err);
     else{
        console.log(stations);
         res.status(200).send(stations);
      }
     })
        
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`))

app.post('/api/stations',(req,res)=>{
    var dbstations = [];
    let stations = req.body;
    stations.forEach((station) => {
        dbstations.push({
            stationName: station.stationName,
            phoneNumber: station.phoneNumber,
            address: station.address,
            openStatusText: station.openStatusText,
            addressLines: station.addressLines,
            location: {
                type: 'Point',
                coordinates: [
                    station.coordinates.longitude,
                    station.coordinates.latitude
                ]
            }
        })
    });
    Station.create(dbstations,(err, stations)=>{
        if(err){
            res.status(500).send(err);
        }
        else{
            res.status(200).send(stations);
        }
    })
});

app.delete('/api/stations',(req,res)=>{
    Store.deleteMany({},(err)=>{
        res.status(200).send(err);
    })
})
