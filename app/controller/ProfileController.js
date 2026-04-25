const Model = require("../model/AModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");
const fs=require('fs')
class ProfileController {
  async user(req, res) {
    try {
      const user = await Model.findById(req.user.id).select("-password");
      return res.status(200).json({
        success: true,
        message: "User profile fetched!",
        data: user,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const { name, email, phone } = req.body;
      const updatedUser = await Model.findByIdAndUpdate(
        userId,
        { name, email, phone },
        { new: true },
      ).select("-password");

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully!",
        data: updatedUser,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async updateProfileImage(req, res) {
    try {
      const id = req.user.id;
      const user = await Model.findById(id);
      //   console.log(req.file)
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      if (user.imagePublicId) {
        await cloudinary.uploader.destroy(user.imagePublicId);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      });

      // delete local file
      await fs.promises.unlink(req.file.path);

      //   console.log(result)
      user.profileImage = result.secure_url;
      user.imagePublicId = result.public_id;

      await user.save();
      return res.status(201).json({
        success: true,
        message: "user profile image updated!",
        user,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}
module.exports = new ProfileController();
