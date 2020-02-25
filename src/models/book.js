const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    book_name: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      required: true,
      trim: true
    },
    desc: {
      type: String,
      required: true,
      trim: true
    },
    category_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    cover: {
      type: String,
      required: true,
      trim: true
    },
    qty: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
