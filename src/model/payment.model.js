const mongoose = require('mongoose')

const paymentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bikeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bike',
        required: true
    },
    takeAt: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station'
    },
    paidAt: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station',
        default: null
    },
    isCompleted: {
        type: Boolean,
        default: false  // not yet
    }
}, {
    timestamps: true
})

const Payment = mongoose.model('Payment', paymentSchema)

module.exports = Payment