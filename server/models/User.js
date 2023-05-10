const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

function validateEmail(email) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
}

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true, // removes whitespace
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validateEmail, "You must enter a valid email address"],
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  favorites: [
    {
      type: Schema.Types.ObjectId,
      ref: "drink",
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const encrypted_password = await bcrypt.hash(this.password, 10);

    this.password = encrypted_password;
    return next();
  }

  next();
});

userSchema.methods.validatePass = async function (form_password) {
  const is_valid = await bcrypt.compare(form_password, this.password);

  return is_valid;
};

const User = model("user", userSchema);

module.exports = User;