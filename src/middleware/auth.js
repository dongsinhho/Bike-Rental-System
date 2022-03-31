const jwt = require('jsonwebtoken');

const auth = (...role) => {
    return (req, res, next) => {
        try {
            let token = req.cookies.accessToken || req.header('Authorization') 
            if (!token) {
                return res.status(401).json({ message: "Invalid Authentication" })
            }
            if (token.indexOf(" ") != -1) {
                token = token.split(" ")[1]
            }
            
            jwt.verify(token, process.env.JWT_SECRET_KEY, (error, user) => {
                if (error)
                    return res.status(400).json({ message: 'Invalid Authentication' });
                if (req.params.userId && user.id != req.params.userId) {
                    return res.status(403).json({ message: "Unauthorized" })
                }
                console.log(user.role)
                if (role.length==1 && role[0] != user.role) {
                    return res.status(400).json({ msg: `${role[0]} resource access denied` });
                }
                req.user = user
                next()
            })

        }
        catch (error) {
            return res.status(500).json({ message: `Something wrong. Detail ${error}` })
        }
    }
}

module.exports = auth