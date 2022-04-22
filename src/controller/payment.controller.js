const Payment = require('../model/payment.model')
const fetch = require('node-fetch')
const Bike = require('../model/bike.model')

const paymentController = {
    createPayment: async (req, res) => {
        try {
            const payment = new Payment({
                user: req.user.id,
                bikeId: req.params.bikeId,
                takeAt: req.params.stationId
            })
            await payment.save()
            console.log(req.user.id)
            return res.status(200).json({
                message: "Create success"
            })
        }
        catch (error) {
            return res.status(500).json({ message: `Something wrong. Detail... \n ${error}` })
        }
    },
    updatePayment: async (req, res) => {
        try {
            const payment = await Payment.findOne({isCompleted: false, user: req.user.id})          

            if (!payment) {
                return res.status(400).json({
                    message: "Cannot found any payment"
                })
            }
            
            const bike = await Bike.findById(payment.bikeId)
            if (!bike || bike.isRent==true) {
                return res.status(400).json({
                    message: "You need to return bike first"
                })
            }

            Object.assign(payment, {
                paidAt: bike.station,
                isCompleted: true
            })

            await payment.save()
            return res.status(200).json(payment)
        }
        catch (error) {
            return res.status(500).json({ message: `Something wrong. Detail... \n ${error}` })
        }
    },
    getUserPayment: async (req, res) => {
        try {
            const payment = await Payment.find({user: req.user.id}).select("_id createdAt updatedAt")
            if (!payment) {
                return res.status(400).json({
                    message: "Cannot found any payment"
                })
            }
            return res.status(200).json(payment)  
        }
        catch (error) {
            return res.status(500).json({ message: `Something wrong. Detail... \n ${error}` })
        }
    },
    getPaymentDetail: async (req, res) => {
        try {
            const payment = await Payment.findById(req.params.paymentId)
            if (!payment) {
                return res.status(400).json({
                    message: "Payment not found"
                })
            }
            return res.status(200).json(payment)
        }
        catch (error) {
            return res.status(500).json({ message: `Something wrong. Detail... \n ${error}` })
        }
    },
    getAllPayment: async (req, res) => {
        try {
            const payment = await Payment.find()
            if (!payment) {
                return res.status(400).json({
                    message: "Payment not found"
                })
            }
            return res.status(200).json(payment)
        }
        catch (error) {
            return res.status(500).json({ message: `Something wrong. Detail... \n ${error}` })
        }
    },

}

module.exports = paymentController