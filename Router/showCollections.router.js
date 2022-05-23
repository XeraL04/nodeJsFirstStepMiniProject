const express = require('express')
const router = express.Router()
const {MongoClient} = require ('mongodb')

//controller:
const collectionController = require('../Controller/showCollections.controller.js')
const imeiController = require('../Controller/ShowImei.controller')
const vehicleController = require('../Controller/showVehicle.controller')


//router:
router.get("/collection", collectionController.getcollections);
router.get("/collection/:nameCollection", collectionController.getOneCollection);
router.get("/getImei", imeiController.findTheImei);
router.get("/vehicleList", vehicleController.findTheVehicleList);




module.exports = router;