const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    }
}, {
    timestamps: true
});

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;