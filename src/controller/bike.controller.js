const fetch = require('node-fetch');
const Bike = require("../model/bike.model")
const Station = require("../model/station.model")
// const Payment = require("../model/payment.model")

const stationController = {
    getAllBike: async (req, res) => {
        try {
            const bike = await Bike.find()
            if (!bike) {
                return res.status(404).json({ message: "Not found any bike" })
            }
            return res.status(200).json(bike)
        }
        catch (error) {
            return res.status(500).json({ message: `Something wrong. Detail... \n ${error}` })
        }
    },
    rentBike: async (req, res) => {
        try {
            const bike = await Bike.findById(req.params.bikeId)
            if (!bike || bike.isRent == true) {
                return res.status(400).json({ message: "Cannot rent this bike" })
            }
            if (!bike.station) {
                return res.status(400).json({ message: "This bike doesn't belong any station" })
            }
            const station = await Station.findById(bike.station)
            if (!station) {
                return res.status(400).json({ message: "This bike doesn't belong any station" })
            }
            //fetch api :stationId const slot = await post(station.ip)
            const response = await fetch(`http://${station.ip}:${process.env.STATION_PORT}/bike/${req.params.bikeId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                redirect: 'follow',
                credentials: 'include'
            })
            const data = await response.json()

            if (!data.status) {
                return res.status(400).json({ message: "This station is empty or cannot serve" })
            }
            return res.redirect(`/api/payments/create/${station._id}/${req.params.bikeId}`, 302)
        }
        catch (error) {
            return res.status(500).json({ message: `Something wrong. Detail... \n ${error}` })
        }
    },

    createBike: async (req, res) => {
        try {
            Bike.create(req.body)
                .then(station => {
                    return res.status(200).json(station)
                })
                .catch(error => {
                    if (error) {
                        return res.status(400).json({
                            message: "Create station fail",
                            detail: error
                        })
                    }
                })
        }
        catch (error) {
            return res.status(500).json({ message: `Something wrong. Detail... \n ${error}` })
        }
    },

    deleteBike: async (req, res) => {
        try {
            const bike = await Bike.findById(req.params.stationId)
            if (!bike) {
                return res.status(400).json({ message: "Not found this station" })
            }
            await bike.remove()
            return res.status(200).json(bike)
        }
        catch (error) {
            return res.status(500).json({ message: `Something wrong. Detail... \n ${error}` })
        }
    },
}

module.exports = stationController