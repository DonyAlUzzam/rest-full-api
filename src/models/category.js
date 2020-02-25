const mongoose = require("mongoose");
let Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    category_name: {
      required: true,
      type: String
    },
    created_by: {
        required: true,
        type: mongoose.Types.ObjectId,
        ref: "User"
      },
  },
  {
    timestamps: true
  }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
