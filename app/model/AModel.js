const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    profileImage: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/04/19/08/32/flower-729510_1280.jpg",
    },
    imagePublicId: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
const AModel = mongoose.model("AModel", authSchema);
module.exports = AModel;
