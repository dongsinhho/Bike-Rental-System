const express = require("express");
const stationController = require("../controller/station.controller");
const auth = require("../middleware/auth");

const router = express.Router();

router.get('/user/', auth(), stationController.getAllStation)
router.get('/user/:stationId', auth(), stationController.getStationDetail)
// router.post('/user/:stationId', auth(), stationController.rentBike)
router.post('/user/:stationId/:bikeId', auth("Station"), stationController.returnBike) // station cho người dùng nhập id xe để trả xe tại trạm
// sau đó gửi về server

// station management

router.post('/', auth("Admin"), stationController.createStation)
router.put('/:stationId', auth("Station"), stationController.updateStationStatus)
router.put('/admin/:stationId', auth("Admin"), stationController.updateStationInfo)
router.delete('/:stationId', auth("Admin"), stationController.deleteStation)

module.exports = router