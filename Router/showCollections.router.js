const express = require('express')
const router = express.Router()
const {MongoClient} = require ('mongodb')

//controller:
const collectionController = require('../Controller/showCollections.controller.js')

//router:
router.get("/collection", collectionController.getcollections)
router.get("/countDocuments", collectionController.numberOfDocuments)
router.get("/getImei", collectionController.findTheImei)
router.get("/vehicleList", collectionController.findTheVehicleList)
// router.get("/listImei",c)

module.exports = router;