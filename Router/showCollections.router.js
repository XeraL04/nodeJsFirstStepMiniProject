const express = require('express')
const router = express.Router()
const {MongoClient} = require ('mongodb')

//controller:
const collectionController = require('../Controller/showCollections.controller.js')

//router:
router.get("/collection", collectionController.getcollections);
router.get("/collection/:nameCollection", collectionController.getOneCollection);
router.get("/getImei", collectionController.findTheImei);
router.get("/vehicleList", collectionController.findTheVehicleList);




module.exports = router;