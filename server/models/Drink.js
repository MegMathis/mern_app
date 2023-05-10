const { Schema, model } = require("mongoose");

const drinkSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  ingredients: {
    type: Array,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

const Drink = model("drink", drinkSchema);

module.exports = Drink;
