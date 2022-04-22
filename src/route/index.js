const express = require('express')
const userRoute = require('../route/user.route')
const paymentRoute = require('../route/payment.route')
const stationRoute = require('../route/station.route')
const bikeRoute = require('../route/bike.route')
const router = express.Router()

const defaultRoute = [{
    path: '/users',
    route: userRoute
}, {
    path: '/payments',
    route: paymentRoute
}, {
    path: '/stations',
    route: stationRoute
}, {
    path: '/bikes',
    route: bikeRoute
}]

defaultRoute.forEach((route) => {
    router.use(route.path, route.route)
})

module.exports = router