// models/BlogPostModel.js
import mongoose from "mongoose";
import slugify from 'slugify'; // Ensure slugify is installed (`npm install slugify`)

const { Schema } = mongoose;

const blogPostSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Blog post title is required'],
        trim: true,
        unique: true,
        maxlength: [150, 'Title cannot exceed 150 characters']
    },
    slug: {
        type: String,
        // Removed 'required: true' here - we will ensure it's set by the hook
        // required: true,
        unique: true,
        lowercase: true,
        trim: true,
        // Add index for faster lookups by slug
        index: true,
    },
    content: {
        type: String,
        required: [true, 'Blog post content is required'],
    },
    excerpt: {
        type: String,
        trim: true,
        maxlength: [300, 'Excerpt cannot exceed 300 characters']
    },
    author: {
        type: String,
        trim: true,
        default: 'Admin',
        maxlength: [50, 'Author name cannot exceed 50 characters']
    },
    // imageUrl field removed/commented out if not used
    status: {
        type: String,
        enum: ['Draft', 'Published'],
        default: 'Draft'
    },
}, { timestamps: true });

// Middleware to generate slug from title BEFORE validation/saving
// Using 'validate' hook might be more reliable than 'save' in some cases
blogPostSchema.pre('validate', function(next) {
    // Only generate slug if title is present and slug is not already set or title changed
    if (this.title && (this.isNew || this.isModified('title'))) {
        console.log(`[Pre-Validate Hook] Generating slug for title: ${this.title}`);
        try {
            this.slug = slugify(this.title, {
                lower: true,
                strict: true,
                remove: /[*+~.()'"!:@]/g
            });
            // Handle potential empty slugs after removing characters
            if (!this.slug) {
                 // Create a fallback slug if needed (e.g., using timestamp or random string)
                 this.slug = `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
                 console.log(`[Pre-Validate Hook] Generated fallback slug: ${this.slug}`);
            } else {
                console.log(`[Pre-Validate Hook] Generated slug: ${this.slug}`);
            }
        } catch (error) {
             console.error("Error during slug generation:", error);
             // Pass the error to Mongoose to stop the process
             return next(new Error("Failed to generate slug"));
        }

    }
    // Ensure slug is present before proceeding (important!)
     if (!this.slug) {
          console.error("[Pre-Validate Hook] Slug is still missing after hook execution!");
          // Optionally generate a fallback here too, or return an error
          // For now, let Mongoose validation catch it if it's still required.
          // If 'required' is removed from slug schema, this check isn't strictly needed
          // but it's good for debugging.
     }

    next(); // Continue with validation and then save
});

const BlogPost = mongoose.model("BlogPost", blogPostSchema);
export default BlogPost;
