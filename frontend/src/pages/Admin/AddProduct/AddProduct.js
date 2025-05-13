import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddProduct.css";

function AddProduct() {
const history = useNavigate();
const [inputs, setInputs] = useState({
name: "", description: "", price: "", quantity: "",
category: "", lowStockThreshold: "5", supplierInfo: "",
});
const [errors, setErrors] = useState({});
const [imageFile, setImageFile] = useState(null);
const [imagePreview, setImagePreview] = useState(null);
const [uploadStatus, setUploadStatus] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);

const handleChange = (e) => {
setInputs((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: null }));
};

const handleImageChange = (e) => {
const file = e.target.files[0];
setImageFile(null); setImagePreview(null);
setErrors(prev => ({ ...prev, image: null }));
if (file) {
if (!file.type.match('image.*')) {
setErrors(prev => ({ ...prev, image: "Please select an image file (jpg, png, gif)." })); return;
}
if (file.size > 5 * 1024 * 1024) {
setErrors(prev => ({ ...prev, image: "Image size should not exceed 5MB." })); return;
}
setImageFile(file); setImagePreview(URL.createObjectURL(file));
}
};

const validateForm = () => {
const newErrors = {};
if (!inputs.name.trim()) newErrors.name = "Name is required";
else if (inputs.name.length < 3) newErrors.name = "Name must be at least 3 characters";
else if (inputs.name.length > 50) newErrors.name = "Name cannot exceed 50 characters";
if (!inputs.description.trim()) newErrors.description = "Description is required";
else if (inputs.description.length < 10) newErrors.description = "Description must be at least 10 characters";
else if (inputs.description.length > 200) newErrors.description = "Description cannot exceed 200 characters";
if (!inputs.price) newErrors.price = "Price is required";
else if (isNaN(inputs.price) || Number(inputs.price) <= 0) newErrors.price = "Price must be a positive number";
if (!inputs.quantity) newErrors.quantity = "Quantity is required";
else if (isNaN(inputs.quantity) || Number(inputs.quantity) < 0 || !Number.isInteger(Number(inputs.quantity))) newErrors.quantity = "Quantity must be a non-negative integer";
if (!inputs.category) newErrors.category = "Category is required";
if (inputs.lowStockThreshold && (isNaN(inputs.lowStockThreshold) || Number(inputs.lowStockThreshold) < 0 || !Number.isInteger(Number(inputs.lowStockThreshold)))) newErrors.lowStockThreshold = "Low stock threshold must be a non-negative integer";
if (inputs.supplierInfo && inputs.supplierInfo.length > 100) newErrors.supplierInfo = "Supplier info cannot exceed 100 characters";
setErrors(newErrors);
return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e) => {
e.preventDefault();
if (isSubmitting || !validateForm()) return;
setIsSubmitting(true); setUploadStatus("");
const formData = new FormData();
formData.append("name", inputs.name);
formData.append("description", inputs.description);
formData.append("price", inputs.price);
formData.append("quantity", inputs.quantity);
formData.append("category", inputs.category);
formData.append("lowStockThreshold", inputs.lowStockThreshold || '0');
formData.append("supplierInfo", inputs.supplierInfo);
if (imageFile) {
formData.append("image", imageFile); setUploadStatus("Uploading image...");
} else setUploadStatus("Submitting data...");
try {
await axios.post("http://localhost:5000/products", formData);
setUploadStatus("Product added successfully!"); alert("Product added successfully!");
history("/productdetails");
} catch (error) {
console.error("Error adding product:", error.response ? error.response.data : error.message);
setUploadStatus("Failed to add product.");
const errorMsg = error.response?.data?.message || "An unexpected error occurred.";
setErrors(prev => ({ ...prev, form: errorMsg }));
} finally { setIsSubmitting(false); }
};

return (
<div> 
<div className="add-product-container"> <h1>Add New Product</h1>
{errors.form && <p className="error form-error">{errors.form}</p>}
<form onSubmit={handleSubmit} noValidate>
<label htmlFor="name">Name</label>
<input id="name" type="text" name="name" onChange={handleChange} value={inputs.name} aria-invalid={!!errors.name} aria-describedby="name-error"/>
{errors.name && <span id="name-error" className="error">{errors.name}</span>}
<label htmlFor="description">Description</label>
<textarea id="description" name="description" onChange={handleChange} value={inputs.description} rows="3" aria-invalid={!!errors.description} aria-describedby="description-error"/>
{errors.description && <span id="description-error" className="error">{errors.description}</span>}
<label htmlFor="price">Price (LKR)</label>
<input id="price" type="number" name="price" step="0.01" min="0.01" onChange={handleChange} value={inputs.price} aria-invalid={!!errors.price} aria-describedby="price-error"/>
{errors.price && <span id="price-error" className="error">{errors.price}</span>}
<label htmlFor="quantity">Quantity</label>
<input id="quantity" type="number" name="quantity" step="1" min="0" onChange={handleChange} value={inputs.quantity} aria-invalid={!!errors.quantity} aria-describedby="quantity-error"/>
{errors.quantity && <span id="quantity-error" className="error">{errors.quantity}</span>}
<label htmlFor="category">Category</label>
<select id="category" name="category" onChange={handleChange} value={inputs.category} aria-invalid={!!errors.category} aria-describedby="category-error">
<option value="">Select a Category</option> <option value="Rings">Rings</option> <option value="Necklaces">Necklaces</option> <option value="Bracelets">Bracelets</option> <option value="Earrings">Earrings</option> <option value="Gemstones">Gemstones</option> <option value="Other">Other</option>
</select>
{errors.category && <span id="category-error" className="error">{errors.category}</span>}
<label htmlFor="lowStockThreshold">Low Stock Threshold</label>
<input id="lowStockThreshold" type="number" name="lowStockThreshold" step="1" min="0" onChange={handleChange} value={inputs.lowStockThreshold} aria-invalid={!!errors.lowStockThreshold} aria-describedby="lowStockThreshold-error"/>
{errors.lowStockThreshold && <span id="lowStockThreshold-error" className="error">{errors.lowStockThreshold}</span>}
<label htmlFor="supplierInfo">Supplier Info (Optional)</label>
<input id="supplierInfo" type="text" name="supplierInfo" onChange={handleChange} value={inputs.supplierInfo} aria-invalid={!!errors.supplierInfo} aria-describedby="supplierInfo-error"/>
{errors.supplierInfo && <span id="supplierInfo-error" className="error">{errors.supplierInfo}</span>}
<label htmlFor="image">Product Image (Optional, Max 5MB)</label>
<input id="image" type="file" accept="image/png, image/jpeg, image/gif" onChange={handleImageChange} className="file-input" aria-invalid={!!errors.image} aria-describedby="image-error"/>
{errors.image && <span id="image-error" className="error">{errors.image}</span>}
{imagePreview && <div className="image-preview"><img src={imagePreview} alt="Selected preview" /></div>}
{uploadStatus && <p className="upload-status">{uploadStatus}</p>}
<button type="submit" disabled={isSubmitting}> {isSubmitting ? "Submitting..." : "Add Product"} </button>
</form>
</div>
</div>
);
}
export default AddProduct;