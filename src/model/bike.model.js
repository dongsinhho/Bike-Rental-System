const mongoose = require('mongoose')
const bikeStatus = require('../util/bikeStatus')

const bikeSchema = mongoose.Schema({
    status: {
        type: String,
        enum: bikeStatus,
        default: 'new'
    },
    isRent: {
        type: Boolean,
        default: false
    },
    station: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station',
        default: null
    }
})

const Bike = mongoose.model('Bike', bikeSchema)

module.exports = Bike