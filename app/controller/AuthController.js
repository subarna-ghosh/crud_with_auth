const Model = require("../model/AModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");
const fs = require("fs").promises;

class AuthController {
  async register(req, res) {
    try {
      const { name, email, phone, password } = req.body;
      if (!name || !email || !phone || !password) {
        return res.status(400).json({
          success: false,
          message: "all fields are needed!",
        });
      }
      const user = await Model.findOne({ email });
      if (user) {
        return res.status(400).json({
          success: false,
          message: "user already registered!",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      let data = new Model({
        name,
        email,
        phone,
        password: hashedPassword,
      });

      //   console.log(req.file)
      if (req.file) {
        // upload image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "products",
        });
        console.log(result);
        //local file delete
        await fs.unlink(req.file.path);
        //save cloudinary URL
        data.profileImage = result.secure_url; // URL
        data.imagePublicId = result.public_id; // public_id
      }
      const productData = await data.save();
      return res.status(201).json({
        success: true,
        message: "user resgistered!",
        productData,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "all fields are needed!",
        });
      }
      const isExist = await Model.findOne({ email });
      if (!isExist) {
        return res.status(400).json({
          success: false,
          message: "user is not registered!",
        });
      }

      const isMatch = await bcrypt.compare(password, isExist.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "password didn't match!",
        });
      }

      const token = jwt.sign(
        {
          id: isExist._id,
          name: isExist.name,
          email: isExist.email,
          phone: isExist.phone,
          role: isExist.role,
          profileImage: isExist.profileImage,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1d" },
      );

      return res.status(201).json({
        success: true,
        message: "token generated successfully!",
        token,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}
module.exports = new AuthController();
