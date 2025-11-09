const mongoose = require('mongoose');

const PolicyDetailsSchema = new mongoose.Schema({
    username: String,
    dob: Number,
    gender: String,
    sum_assured: Number,
    modal_premium: Number,
    premium_frequency: String,
    pt: Number,
    ppt: Number
});

const PolicySchema = new mongoose.model("policy_details", PolicyDetailsSchema)
module.exports = PolicySchema;