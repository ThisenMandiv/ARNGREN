// src/pages/Admin/UpdateProduct/UpdateProduct.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./UpdateProduct.css"; // Adjust path if needed
import { Link } from "react-router-dom"; // Import Link for navigation
// import Nav from "../Nav/Nav"; // Ensure Nav is NOT imported/used here

const API_BASE_URL = "http://localhost:5000"; // Use a base URL

function UpdateProduct() {
    const [inputs, setInputs] = useState({ /* initial state */ });
    const [errors, setErrors] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [isLoading, setIsLoading] = useState(true); // Loading state for fetch
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams(); // Get the product ID from the URL

    useEffect(() => {
        const fetchHandler = async () => {
            setIsLoading(true);
            setErrors({}); // Clear previous errors
            console.log(`Attempting to fetch product with ID: ${id}`); // Debug log

            // --- THIS IS THE CRITICAL PART ---
            try {
                // Ensure the URL is correct: BASE_URL + /products/ + id
                const res = await axios.get(`${API_BASE_URL}/products/${id}`);
                const productData = res.data.product;

                if (!productData) {
                     // Handle case where backend returns success but no product data
                     throw new Error("Product data not found in response.");
                }

                console.log("Fetched product data:", productData);
                // Set state based on fetched data
                setInputs({
                    name: productData.name || "",
                    description: productData.description || "",
                    price: productData.price != null ? String(productData.price) : "",
                    quantity: productData.quantity != null ? String(productData.quantity) : "",
                    category: productData.category || "",
                    lowStockThreshold: productData.lowStockThreshold != null ? String(productData.lowStockThreshold) : "5",
                    supplierInfo: productData.supplierInfo || "",
                    imageUrl: productData.imageUrl || "" // Store original image URL
                });
                // Set image preview if exists
                if (productData.imageUrl && productData.imageUrl !== "/default-product-image.jpg") {
                    // Construct full URL if needed, based on how backend serves images
                    setImagePreview(`${API_BASE_URL}${productData.imageUrl}`);
                } else {
                    setImagePreview(null); // No image or default image
                }
            } catch (error) {
                console.error("Error fetching product:", error.response || error.message || error);
                // Set a user-friendly error message
                setErrors({ form: "Failed to load product data. Please try again." });
                setImagePreview(null); // Clear preview on error
            } finally {
                setIsLoading(false); // Stop loading indicator
            }
            // --- END OF CRITICAL PART ---
        };

        if (id) { // Only fetch if ID exists
             fetchHandler();
        } else {
            console.error("No product ID found in URL parameters.");
            setErrors({ form: "Invalid request: No product ID specified." });
            setIsLoading(false);
        }

    }, [id]); // Re-run effect if the ID changes

    // ... (handleChange, handleImageChange, validateForm, handleSubmit functions remain) ...
     const handleChange = (e) => {
        setInputs((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
        if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: null }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(null); setErrors(prev => ({ ...prev, image: null }));
        if (file) {
            if (!file.type.match('image.*')) {
                setErrors(prev => ({ ...prev, image: "Please select an image file (jpg, png, gif)." }));
                // Keep existing preview if selection is invalid
                setImagePreview(inputs.imageUrl && inputs.imageUrl !== "/default-product-image.jpg" ? `${API_BASE_URL}${inputs.imageUrl}` : null);
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setErrors(prev => ({ ...prev, image: "Image size should not exceed 5MB." }));
                 setImagePreview(inputs.imageUrl && inputs.imageUrl !== "/default-product-image.jpg" ? `${API_BASE_URL}${inputs.imageUrl}` : null);
                return;
            }
            setImageFile(file); // Store the file object
            setImagePreview(URL.createObjectURL(file)); // Show preview of the NEW file
        } else {
             // If user cancels file selection, revert to original image preview
             setImagePreview(inputs.imageUrl && inputs.imageUrl !== "/default-product-image.jpg" ? `${API_BASE_URL}${inputs.imageUrl}` : null);
        }
    };

     const validateForm = () => {
        const newErrors = {};
        // (Validation logic remains the same)
        if (!inputs.name.trim()) newErrors.name = "Name is required";
        else if (inputs.name.length < 3) newErrors.name = "Name must be at least 3 characters";
        else if (inputs.name.length > 50) newErrors.name = "Name cannot exceed 50 characters";
        if (!inputs.description.trim()) newErrors.description = "Description is required";
        else if (inputs.description.length < 10) newErrors.description = "Description must be at least 10 characters";
        else if (inputs.description.length > 200) newErrors.description = "Description cannot exceed 200 characters";
        if (!inputs.price) newErrors.price = "Price is required";
        else if (isNaN(inputs.price) || Number(inputs.price) <= 0) newErrors.price = "Price must be a positive number";
        if (inputs.quantity === '' || inputs.quantity === null) newErrors.quantity = "Quantity is required"; // Check for empty string/null
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

        setIsSubmitting(true);
        setUploadStatus("");
        setErrors(prev => ({ ...prev, form: null })); // Clear previous form error

        const formData = new FormData(); // Use FormData for file uploads
        formData.append("name", inputs.name);
        formData.append("description", inputs.description);
        formData.append("price", inputs.price);
        formData.append("quantity", inputs.quantity);
        formData.append("category", inputs.category);
        formData.append("lowStockThreshold", inputs.lowStockThreshold || '0'); // Default if empty
        formData.append("supplierInfo", inputs.supplierInfo);

        if (imageFile) { // Only append image if a new one was selected
            formData.append("image", imageFile);
            setUploadStatus("Uploading new image...");
        } else {
            setUploadStatus("Submitting data...");
        }

        try {
            // Use PUT request for updating
            await axios.put(`${API_BASE_URL}/products/${id}`, formData, {
                 headers: {
                    // Important for FormData with files
                    'Content-Type': 'multipart/form-data'
                 }
            });
            setUploadStatus("Product updated successfully!");
            alert("Product updated successfully!");
            navigate("/admin/products"); // Navigate back to the admin product list
        } catch (error) {
            console.error("Error updating product:", error.response || error.message || error);
            setUploadStatus("Failed to update product.");
            const errorMsg = error.response?.data?.message || "An unexpected error occurred during update.";
            setErrors(prev => ({ ...prev, form: errorMsg }));
        } finally {
            setIsSubmitting(false);
        }
    };


    // --- Render Logic ---
    if (isLoading) {
        return <div className="add-product-container loading"><h1>Loading Product Details...</h1></div>;
    }

    // Display error if fetching failed
    if (errors.form && !inputs.name) { // Check if fetch error occurred (inputs wouldn't be set)
        return (
             <div className="add-product-container error-container">
                 <h1>Error Loading Product</h1>
                 <p className="error form-error">{errors.form}</p>
                <Link to="/admin/products" className="back-link-error">Back to Product List</Link>
             </div>
        );
    }

    // Main form render
    return (
        // No <Nav /> here
        <div className="add-product-container"> {/* Reuse AddProduct styles */}
            <h1>Update Product</h1>
            {/* Display form submission errors */}
            {errors.form && <p className="error form-error">{errors.form}</p>}

            <form onSubmit={handleSubmit} noValidate>
                {/* Name */}
                <label htmlFor="name">Name</label>
                <input id="name" type="text" name="name" onChange={handleChange} value={inputs.name} aria-invalid={!!errors.name} aria-describedby="name-error"/>
                {errors.name && <span id="name-error" className="error">{errors.name}</span>}

                {/* Description */}
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" onChange={handleChange} value={inputs.description} rows="3" aria-invalid={!!errors.description} aria-describedby="description-error"/>
                {errors.description && <span id="description-error" className="error">{errors.description}</span>}

                {/* Price */}
                <label htmlFor="price">Price (LKR)</label>
                <input id="price" type="number" name="price" step="0.01" min="0.01" onChange={handleChange} value={inputs.price} aria-invalid={!!errors.price} aria-describedby="price-error"/>
                {errors.price && <span id="price-error" className="error">{errors.price}</span>}

                {/* Quantity */}
                <label htmlFor="quantity">Quantity</label>
                <input id="quantity" type="number" name="quantity" step="1" min="0" onChange={handleChange} value={inputs.quantity} aria-invalid={!!errors.quantity} aria-describedby="quantity-error"/>
                {errors.quantity && <span id="quantity-error" className="error">{errors.quantity}</span>}

                {/* Category */}
                <label htmlFor="category">Category</label>
                <select id="category" name="category" onChange={handleChange} value={inputs.category} aria-invalid={!!errors.category} aria-describedby="category-error">
                    <option value="">Select a Category</option>
                    <option value="Rings">Rings</option>
                    <option value="Necklaces">Necklaces</option>
                    <option value="Bracelets">Bracelets</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Gemstones">Gemstones</option>
                    <option value="Other">Other</option>
                </select>
                {errors.category && <span id="category-error" className="error">{errors.category}</span>}

                {/* Low Stock Threshold */}
                <label htmlFor="lowStockThreshold">Low Stock Threshold</label>
                <input id="lowStockThreshold" type="number" name="lowStockThreshold" step="1" min="0" onChange={handleChange} value={inputs.lowStockThreshold} aria-invalid={!!errors.lowStockThreshold} aria-describedby="lowStockThreshold-error"/>
                {errors.lowStockThreshold && <span id="lowStockThreshold-error" className="error">{errors.lowStockThreshold}</span>}

                {/* Supplier Info */}
                <label htmlFor="supplierInfo">Supplier Info</label>
                <input id="supplierInfo" type="text" name="supplierInfo" onChange={handleChange} value={inputs.supplierInfo} aria-invalid={!!errors.supplierInfo} aria-describedby="supplierInfo-error"/>
                {errors.supplierInfo && <span id="supplierInfo-error" className="error">{errors.supplierInfo}</span>}

                {/* Image Upload */}
                <label htmlFor="image">Product Image (Optional, Max 5MB)</label>
                <input id="image" type="file" accept="image/png, image/jpeg, image/gif" onChange={handleImageChange} className="file-input" aria-invalid={!!errors.image} aria-describedby="image-error"/>
                {errors.image && <span id="image-error" className="error">{errors.image}</span>}

                {/* Image Preview */}
                {imagePreview && (
                    <div className="image-preview">
                        <p>Image Preview:</p>
                        <img src={imagePreview} alt="Product preview" />
                        {imageFile && <p className="new-image-notice"><i>New image selected. This will replace the current image upon saving.</i></p>}
                    </div>
                )}
                {!imagePreview && !imageFile && <p>No image uploaded.</p>}

                {/* Status Messages */}
                {uploadStatus && <p className="upload-status">{uploadStatus}</p>}

                {/* Submit Button */}
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update Product"}
                </button>
            </form>
        </div>
    );
}

export default UpdateProduct; // Corrected export name
