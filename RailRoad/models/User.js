//RailRoad/models/TrainStation.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    pseudo: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user', 'employee'], default: 'user' },
    username: { type: String, unique: true, sparse: true }, // 'sparse' permet d'accepter des valeurs null
}, { timestamps: true });

userSchema.pre('remove', async function(next) {
    try {
      await mongoose.model('Ticket').deleteMany({ user: this._id });
      next();
    } catch (error) {
      next(error);
    }
  });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
``