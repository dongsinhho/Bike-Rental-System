const express = require("express");
const userController = require("../controller/user.controller");
const auth = require("../middleware/auth");
const router = express.Router();

router.get('/', auth("Admin"), userController.getAllUser)
router.post('/', userController.createUser)
router.get('/info', auth(), userController.getUserDetail)
router.put('/update', auth(), userController.updateUser)
router.delete('/:userId', auth("Admin"), userController.deleteUser)


router.post('/login', userController.login)
router.post('/logout', auth(), userController.logout)

router.post('/stationLogin', userController.getStationToken)

module.exports = router