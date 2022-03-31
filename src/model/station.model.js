const mongoose = require('mongoose')

const stationSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        require: true
    },
    status: {
        type: Boolean,
        default: true 
        // true: serve - false: full slot
    },
    description: {
        type: String,
        default: "Stable"
    },
    latitude: {
        type: mongoose.SchemaTypes.Decimal128,
        require: true
    },
    longitude: {
        type: mongoose.SchemaTypes.Decimal128,
        require: true
    },
    ip: {
        type: String,
        unique: true,
        require: true
    }
}, {
    timeStamp: true
})

const Station = mongoose.model('Station', stationSchema)

module.exports = Station