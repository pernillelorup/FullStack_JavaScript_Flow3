const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  name: {type: String, unique: true},
  location: {
    type: {type: String, enum: ['Point'], required: true },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

playerSchema.index({ location: "2dsphere" },{ "background": true });
Player = mongoose.model("Player",playerSchema);

module.exports = Player;