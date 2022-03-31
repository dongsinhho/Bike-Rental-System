const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const validator = require('validator')
const role = require('../util/role')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        minlength: 6,
        maxlength: 30,
        trim: true,
        required: true
    },
    password: {
        type: String,
        minlength: 8,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(mail) {
            if (!validator.isEmail(mail)) {
                throw new Error('Invalid email')
            }
        }
    },
    phone: {
        type: String,
        minlength: 0,
        maxlength: 11,
        required: true
    },
    role: {
        type: String,
        enum: role,
        default: 'Client',
    }
}, {
    timestamps: true
})

// statics là custom tìm kiếm (findbyName, findOne...)
// methods là một function nào đó trong model
// pre là việc làm trước khi lưu

userSchema.statics.isEmailTaken = async function(email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });  
    return !!user;
}  // chọn những trường có id không bằng $ne == not equals excludeUserId

userSchema.methods.isPasswordMatch = async function(password) {
    const user = this
    return bcrypt.compare(password, user.password)
}

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User