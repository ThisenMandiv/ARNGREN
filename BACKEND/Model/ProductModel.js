import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema({
name: {
type: String,
required: [true, 'Product name is required'],
trim: true,
minlength: [3, 'Name must be at least 3 characters long'],
maxlength: [50, 'Name cannot exceed 50 characters']
},
description: {
type: String,
required: [true, 'Description is required'],
trim: true,
minlength: [10, 'Description must be at least 10 characters long'],
maxlength: [200, 'Description cannot exceed 200 characters']
},
price: {
type: Number,
required: [true, 'Price is required'],
min: [0.01, 'Price must be greater than zero'],
},
quantity: {
type: Number,
required: [true, 'Quantity is required'],
min: [0, 'Quantity must be a non-negative number'],
validate: {
validator: Number.isInteger,
message: '{VALUE} is not an integer value for quantity'
}
},
category: {
type: String,
required: [true, 'Category is required'],
trim: true,
enum: ['Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Gemstones', 'Other']
},
imageUrl: {
type: String,
default: "/default-product-image.jpg" // Relative path for server
},
lowStockThreshold: {
type: Number,
required: false,
default: 5,
min: [0, 'Low stock threshold must be non-negative']
},
supplierInfo: {
type: String,
required: false,
trim: true,
default: '',
maxlength: [100, 'Supplier info cannot exceed 100 characters']
}
}, { timestamps: true });

export default mongoose.model("Product", productSchema);