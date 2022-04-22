const express = require("express");
const paymentController = require("../controller/payment.controller")
const auth = require("../middleware/auth")

const router = express.Router();

router.get('/create/:stationId/:bikeId', auth(), paymentController.createPayment)
router.get('/update/:stationId', auth(), paymentController.updatePayment)
router.get('/info', auth(), paymentController.getUserPayment)
router.get('/:paymentId', auth(), paymentController.getPaymentDetail)
router.get('/', auth("Admin"), paymentController.getAllPayment)

module.exports = router