const PModel = require("../model/PModel");
const cloudinary = require("../config/cloudinary");
const fs = require("fs").promises;
class ProductController {
  async create(req, res) {
    try {
      const { name, description, price, color = [], size = [] } = req.body;
      const data = new PModel({
        name,
        description,
        price,
        color,
        size,
        userId: req.user.id,
      });
      //   console.log(req.file)
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "collection",
        });
        // console.log(result)

        await fs.unlink(req.file.path);

        data.image = result.secure_url;
        data.imagePublicId = result.public_id;
      }

      const saveProduct = await data.save();
      return res.status(201).json({
        success: true,
        message: "product created successfully!",
        data,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async list(req, res) {
    try {
      const data = await PModel.find({ userId: req.user.id, isDeleted:false });
      return res.status(201).json({
        success: true,
        message: "products fetched successfully!",
        count: data.length,
        data,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async single(req, res) {
    try {
      const id = req.params.id;
      const data = await PModel.findById(id);
      return res.status(201).json({
        success: true,
        message: "product fetched successfully!",
        data,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;

      const product = await PModel.findById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.userId.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }

      let { name, description, price, color, size } = req.body;

      if (typeof color === "string") color = [color];
      if (typeof size === "string") size = [size];

      if (name) product.name = name;
      if (description) product.description = description;
      if (price) product.price = price;
      if (color) product.color = color;
      if (size) product.size = size;

      if (req.file) {
        if (product.imagePublicId) {
          await cloudinary.uploader.destroy(product.imagePublicId);
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "collection",
        });

        await fs.unlink(req.file.path);

        product.image = result.secure_url;
        product.imagePublicId = result.public_id;
      }

      const updated = await product.save();

      return res.status(200).json({
        success: true,
        message: "Product updated successfully!",
        data: updated,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }


  async hard(req, res) {
    try {
      const id = req.params.id;

      const product = await PModel.findById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.userId.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (product.imagePublicId) {
        await cloudinary.uploader.destroy(product.imagePublicId);
      }

      await product.deleteOne();

      return res.status(200).json({
        success: true,
        message: "Product permanently deleted!",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async soft(req, res) {
    try {
      const id = req.params.id;
      const val = await PModel.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true },
      );
      return res.status(200).json({
        success: true,
        message: "Product soft deleted successfully!",
        val,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async restore(req, res) {
    try {
      const id = req.params.id;
      const val = await PModel.findByIdAndUpdate(
        id,
        { isDeleted: false },
        { new: true },
      );
      return res.status(200).json({
        success: true,
        message: "Product restored successfully!",
        val,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}
module.exports = new ProductController();
