const Product = require("../models/Product");

// @desc    Get all products (with optional filtering)
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const { category, search, inStock, sort } = req.query;
    let query = {};

    if (category && category !== "All") {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { subcategory: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (inStock !== undefined) {
      query.inStock = inStock === "true";
    }

    let sortOption = { id: 1 };
    if (sort === "price-low") sortOption = { price: 1 };
    else if (sort === "price-high") sortOption = { price: -1 };
    else if (sort === "rating") sortOption = { rating: -1 };
    else if (sort === "newest") sortOption = { createdAt: -1 };

    const products = await Product.find(query).sort(sortOption);

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching products.",
      error: error.message,
    });
  }
};

// @desc    Get single product by id (numeric id or Mongo _id)
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    let product = null;
    if (!isNaN(id)) {
      product = await Product.findOne({ id: Number(id) });
    }

    if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${id} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error fetching product.",
      error: error.message,
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin)
const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      subcategory,
      brand,
      price,
      oldPrice,
      rating,
      badge,
      image,
      hoverImage,
      description,
      stock,
    } = req.body;

    if (!name || !category || price === undefined || !image) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, category, price, image.",
      });
    }

    // Determine unique numeric ID
    const highestProduct = await Product.findOne({}, { id: 1 }).sort({ id: -1 });
    const nextId = highestProduct && highestProduct.id ? highestProduct.id + 1 : 1;

    const numStock = Number(stock !== undefined ? stock : 15);

    const newProduct = await Product.create({
      id: nextId,
      name: name.trim(),
      category: category.trim(),
      subcategory: subcategory ? subcategory.trim() : "General",
      brand: brand ? brand.trim() : "Geets Beauty",
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : null,
      rating: rating ? Number(rating) : 4.8,
      badge: badge ? badge.trim() : "New",
      image: image.trim(),
      hoverImage: hoverImage ? hoverImage.trim() : "",
      description: description ? description.trim() : "Premium beauty formulation for radiant, healthy glow.",
      stock: numStock,
      inStock: numStock > 0,
      soldCount: 0,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product: newProduct,
    });
  } catch (error) {
    console.error("Create product error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error creating product.",
      error: error.message,
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    let product = null;
    if (!isNaN(id)) {
      product = await Product.findOne({ id: Number(id) });
    }
    if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${id} not found.`,
      });
    }

    const {
      name,
      category,
      subcategory,
      brand,
      price,
      oldPrice,
      rating,
      badge,
      image,
      hoverImage,
      description,
      stock,
      inStock,
    } = req.body;

    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) product.category = category.trim();
    if (subcategory !== undefined) product.subcategory = subcategory.trim();
    if (brand !== undefined) product.brand = brand.trim();
    if (price !== undefined) product.price = Number(price);
    if (oldPrice !== undefined) product.oldPrice = oldPrice ? Number(oldPrice) : null;
    if (rating !== undefined) product.rating = Number(rating);
    if (badge !== undefined) product.badge = badge.trim();
    if (image !== undefined) product.image = image.trim();
    if (hoverImage !== undefined) product.hoverImage = hoverImage.trim();
    if (description !== undefined) product.description = description.trim();
    if (stock !== undefined) {
      product.stock = Number(stock);
      product.inStock = product.stock > 0;
    }
    if (inStock !== undefined && stock === undefined) {
      product.inStock = Boolean(inStock);
      if (!product.inStock) product.stock = 0;
    }

    const updatedProduct = await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating product.",
      error: error.message,
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    let product = null;
    if (!isNaN(id)) {
      product = await Product.findOneAndDelete({ id: Number(id) });
    } else if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findByIdAndDelete(id);
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${id} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Product "${product.name}" deleted successfully.`,
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error deleting product.",
      error: error.message,
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
