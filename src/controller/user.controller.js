const User = require('../model/user.model')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const {registerValidation, loginValidation, updateUserValidation} = require('../util/validation')

const userController = {
    createUser: async (req, res) => {
        try {
            const {error} = await registerValidation.validate(req.body)
            if (error) {
                console.log(error)
                return res.status(400).json({ message: error.details[0].message })
            }
            if (!validator.isEmail(req.body.email)) {
                return res.status(400).json({ message: "Email invalid" })
            }
            if (await User.isEmailTaken(req.body.email)) {
                return res.status(400).json({ message: "Registered email" })
            }
            const user = await User.create(req.body)
            return res.status(201).json({message: "created"});
        }
        catch (error) {
            return res.status(500).json({ message: `Something wrong. Detail ${error}` })
        }
    },

    getAllUser: async (req, res) => {
        try {
            const user = await User.find({ role: { $ne: 'Admin' } })
            if (!user) {
                res.status(400).json({ message: "User not found" })
            }
            return res.status(200).json(user);
        }
        catch (error) {
            return res.status(500).json({ message: `Something wrong. Detail ${error}` })
        }
    },

    getUserDetail: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select("-password")
            if (!user) {
                res.status(400).json({ message: "User not found" })
            }
            return res.status(200).json(user);
        }
        catch (error) {
            return res.status(500).json({ message: `Something wrong. Detail ${error}` })
        }
    },

    updateUser: async (req, res) => { 
        try {
            if (req.body.email && !validator.isEmail(req.body.email)) {
                return res.status(400).json({ message: "Email invalid" })
            }
    
            const { error } = await updateUserValidation.validate(req.body)
            if (error) {
                console.log(error)
                return res.status(400).json({ message: error.details[0].message })
            }
            console.log(req.body.email, req.user.id)
            if (req.body.email && (await User.isEmailTaken(req.body.email, req.user.id))) {
                return res.status(400).json({ message: "Registered email" })
            }
    
            let user = await User.findById(req.user.id);
            console.log(user)
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }
            if (!(await user.isPasswordMatch(req.body.password))) {
                return res.status(404).json({ message: 'Wrong password' })
            }
            Object.assign(user, req.body)
            await user.save()
            return res.status(200).json({
                message: "Update successful"
            })
        }
        catch (error) {
            return res.status(500).json({ message: `Something wrong. Detail ${error}` })
        }
    },
    deleteUser: async (req, res) => {
        try { 
            const user = await User.findById(req.params.userId)
            if (!user) {
                return res.status(404).json({ message: 'User not found' }) 
            }
            await user.remove()
            return res.status(200).json(user)
        }
        catch (error) {
            return res.status(500).json({ message: `Something wrong. Detail ${error}` })
        }
    },

    login: async (req, res) => {
        try {
            const {error} = await loginValidation.validate(req.body)
            if (error) {
                console.log(error)
                return res.status(400).json({ message: error.details[0].message })
            }
            if (req.body.email && !validator.isEmail(req.body.email)) {
                return res.status(400).json({ message: "Email invalid" })
            }
            const {email, password} = req.body
            const user = await User.findOne({email});
     
            if (!user || !(await user.isPasswordMatch(password))) {
                return res.status(400).json({ message: "Email or password invalid"})
            } else {
                const accessToken = jwt.sign({
                    id: user._id,
                    role: user.role
                },process.env.JWT_SECRET_KEY, {expiresIn: process.env.EXPIRES_IN})
                //res.cookie(name,value,[options])
                res.cookie('accessToken',accessToken,{
                    maxAge: 2 * 24 * 60 * 60 * 1000,
                    path: '/'
                })
                return res.status(200).json({
                    name: user.name,
                    role: user.role,
                    email: user.email,
                    token: accessToken
                })
            }
        }
        catch (error) {
            return res.status(500).json({ message: `Something wrong. Detail ${error}` })
        }
    },

    logout: async (req, res) => {
        try {
            res.clearCookie('accessToken', {path:'/'})
            return res.status(200).json({ message: 'Logged Out' });
        }
        catch (error) {
            return res.status(500).json({ message: `Something wrong. Detail ${error}` })
        }
    },

    getStationToken: async (req, res) => {
        try {
            if (req.body.email && !validator.isEmail(req.body.email)) {
                return res.status(400).json({ message: "Email invalid" })
            }
            const {error} = await loginValidation.validate(req.body)
            if (error) {
                console.log(error)
                return res.status(400).json({ message: error.details[0].message })
            }
            const {email, password} = req.body
            const user = await User.findOne({email});
     
            if (!user || !(await user.isPasswordMatch(password))) {
                return res.status(400).json({ message: "Email or password invalid"})
            } else {
                if (user.role != "Station") {
                    return res.status(403).json({
                        message: "For Station only"
                    })
                }
                const accessToken = jwt.sign({
                    id: user._id,
                    role: user.role
                },process.env.JWT_SECRET_KEY, {expiresIn: process.env.STATION_EXPIRES_IN})
                //res.cookie(name,value,[options])
                res.cookie('accessToken',accessToken,{
                    maxAge: 100 * 24 * 60 * 60 * 1000, //100 days
                    path: '/'
                })
                return res.status(200).json({
                    name: user.name,
                    role: user.role,
                    email: user.email,
                    token: accessToken
                })
            }
        }
        catch (error) {
            return res.status(500).json({ message: `Something wrong. Detail ${error}` })
        }
    }
}

module.exports = userController;