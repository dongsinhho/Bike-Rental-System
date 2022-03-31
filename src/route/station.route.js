const express = require("express");
const stationController = require("../controller/station.controller");
const auth = require("../middleware/auth");

const router = express.Router();

router.get('/user/', auth(), stationController.getAllStation)
router.get('/user/:stationId', auth(), stationController.getStationDetail)
router.post('/user/:stationId', auth(), stationController.rentBike)
router.put('/user/:stationId', auth(), stationController.returnBike)

// station management

router.post('/', auth("Admin"), stationController.createStation)
router.put('/:stationId', auth("Station"), stationController.updateStationStatus)
router.put('/admin/:stationId', auth("Admin"), stationController.updateStationInfo)
router.delete('/:stationId', auth("Admin"), stationController.deleteStation)

module.exports = router