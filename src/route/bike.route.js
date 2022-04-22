const express = require("express");
const bikeController = require("../controller/bike.controller");
const auth = require("../middleware/auth");

const router = express.Router();

router.get('/user/:bikeId', auth(), bikeController.rentBike)
// router.put('/user/:stationId', auth(), bikeController.returnBike)

// bike management

router.get('/', auth("Admin"), bikeController.getAllBike)
router.post('/', auth("Admin"), bikeController.createBike)
router.delete('/:bikeId', auth("Admin"), bikeController.deleteBike)

module.exports = router