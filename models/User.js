const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    tokens: [
      {
        token: { type: String, required: true },
        expiration: { type: Date, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Method to remove expired tokens
UserSchema.methods.removeExpiredTokens = async function () {
  const currentTime = Date.now();
  this.tokens = this.tokens.filter((token) => token.expiration > currentTime);
  return await this.save(); // Save the updated user document
};
const User = mongoose.model("users", UserSchema);

module.exports = User;
