const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        maxlength: [20, 'Username can not have more than 20 characters']
    },
    email: {
        type: String,
        requierd: [true, 'Email is required'],
        trim: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['LIBRARIAN', 'MEMBER'],
        default: 'MEMBER'
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must have atleast 8 characters'],
        maxlength: [40, 'Password can not have more than 40 characters'],
        trim: true
    },
    passwordConfirm: {
        type: String,
        requierd: [true, 'Please confirm the password'],
        trim: true,
        validate: {
            validator: function(el) {
                return el === this.password
            },
            message: 'Passwords do not match'
        }
    }
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;

    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model('User', userSchema);

module.exports = User;