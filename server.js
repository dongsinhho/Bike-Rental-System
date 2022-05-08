const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT

const route = require("./src/route/index")
const connectDB = require("./src/config/db.config")

connectDB();
app.use(morgan('tiny'))
app.use(cors())
app.use(cookieParser())
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api', route)
app.get('/', (req, res) => {
    res.json({message: 'Hello API server'})
})
app.get('*', (req, res) => {
    res.json({message: 'Nothing here'})
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})