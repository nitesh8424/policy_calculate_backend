const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    name: { type: String, required: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true },
    mobile: {
        type: Number, required: true, validate: {
            validator: v => v.toString().length === 10,
            message: props => `${props.value} is not a valid 10-digit mobile number`
        }
    },
    password: { type: String, required: true }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

const mongooseFieldEncryption = require('mongoose-field-encryption').fieldEncryption;

userSchema.plugin(mongooseFieldEncryption, {
    fields: ['name', 'dob', 'mobile'],
    secret: process.env.ENCRYPTION_SECRET
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (err) {
        throw new Error('Password comparison failed');
    }
};

const Users = mongoose.model("userdetails", userSchema)
module.exports = Users;