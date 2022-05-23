const Station = require("../model/station.model")
const fetch = require('node-fetch');
const Payment = require("../model/payment.model")
const { createStationValidation, updateStationValidation, changeStatusValidation } = require("../util/validation");
const Bike = require("../model/bike.model");

const stationController = {
    getAllStation: async (req, res) => {
        try {
            const station = await Station.find()
            if (!station) {
                return res.status(404).json({message: "Not found any station"})
            }
            return res.status(200).json(station)
        }
        catch (error) {
            return res.status(500).json({ message: `Something wrong. Detail... \n ${error}` })
        }
    },
    getStationDetail: async (req, res) => {
        try {
            const bike = await Bike.find({station: req.params.stationId})
            if (!bike) {
                return res.status(404).json({message: "This station don't have any bike"})
            }
            return res.status(200).json(bike) 
        }
        catch (error) {
            return res.status(500).json({ message: `Something wrong. Detail... \n ${error}` })
        }
    },
    rentBike: async (req, res) => {
        try {
            // check any bike is rented by this user 
            // call api edge server ==> send slot, --> if true: redirect tao payment
            // check
            // const payment = await Payment.find({isCompleted: false}).populate({
            //     model: 'User',
            //     path: '../model/user.model',
            //     match: {
            //         _id: req.user.id
            //     },
            //     select: '_id name'             
            // })
            const payment = await Payment.find({isCompleted: false, user: req.user.id})
            if (payment.length != 0) {
                return res.status(400).json({message: "This user need to return bike"})
            }

            const station = await Station.findById(req.params.stationId)
            if (!station) {
                return res.status(400).json({message: "Not found this station"})
            }
            //fetch api :stationId const slot = await postSTATION_(station.ip)
            const response = await fetch(`http://localhost:${process.env.PORT}/getCloseSlot`, {
                method: 'GET'
            })
            const data = await response.json()

            if (!data.status) {
                return res.status(400).json({message: "This station is empty or cannot serve"})
            } 
            return res.redirect(`/api/payments/create/${station._id}/${data.slot}`,302)
        }
        catch (error) {
            return res.status(500).json({ message: `Something wrong. Detail... \n ${error}` })
        }
    },
    returnBike: async (req, res) => {
        try {
            const bike = await Bike.findById(req.params.bikeId)
            if (!bike || bike.isRent == false) {
                return res.status(400).json({message: "This bike or this id invalid"})
            }

            Object.assign(bike, {isRent: false, station: req.params.stationId})
            await bike.save()
            return res.status(200).json({message: "return bike successfully"})
            // const payment = await Payment.findOne({bikeId: req.params.bikeId, isCompleted: false})
            // if (!payment) {
            //     return res.status(400).json({message: "Can't pay"})
            // }
            // return res.redirect(`/api/payments/update/${station._id}/${data.slot}`,302)
        }
        catch (error) {
            return res.status(500).json({ message: `Something wrong. Detail... \n ${error}` })
        }
    },


    createStation: async (req, res) => {
        try {
            const validation = await createStationValidation.validate(req.body)
            if (validation.error) {
                return res.status(400).json({ message: validation.error.details[0].message })
            }
            Station.create(req.body)
                .then(station => {
                    return res.status(200).json(station)
                })
                .catch(error => {
                    if(error) {
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
    updateStationInfo: async (req, res) => {
        try {
            const validation = await updateStationValidation.validate(req.body)
            if (validation.error) {
                return res.status(400).json({ message: validation.error.details[0].message })
            }
            const station = await Station.findById(req.params.stationId)
            if(!station) {
                return res.status(400).json({message: "Not found this station"})
            }
            Object.assign(station, req.body)
            await station.save()
            return res.status(200).json(station)
        }
        catch (error) {
            return res.status(500).json({ message: `Something wrong. Detail... \n ${error}` })
        }
    },
    updateStationStatus: async (req, res) => {
        try {
            const validation = await changeStatusValidation.validate(req.body)
            if (validation.error) {
                return res.status(400).json({ message: validation.error.details[0].message })
            }
            let station = await Station.findById(req.params.stationId)
            if(!station) {
                return res.status(400).json({message: "Not found this station"})
            }
            Object.assign(station, req.body)
            return res.status(200).json(station)
        }
        catch (error) {
            return res.status(500).json({ message: `Something wrong. Detail... \n ${error}` })
        }
    },
    deleteStation: async (req, res) => {
        try {
            const station = await Station.findById(req.params.stationId)
            if(!station) {
                return res.status(400).json({message: "Not found this station"})
            }
            await station.remove()
            return res.status(200).json(station)
        }
        catch (error) {
            return res.status(500).json({ message: `Something wrong. Detail... \n ${error}` })
        }
    },
}

module.exports = stationController