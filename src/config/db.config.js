require('dotenv').config()
const mongoose = require('mongoose')

function connectDB() {
    console.log('Connecting database ... ')
    
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('Database connection successful')
    })
    .catch((err) => {
        console.log(`Database connection failed. Exiting now... \n ${err}`)
        process.exit()
    })
}

module.exports = connectDB
