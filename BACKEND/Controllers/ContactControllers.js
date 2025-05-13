// Controllers/ContactControllers.js
import { sendContactFormEmail } from '../services/emailService.js'; // We'll add this function to emailService

// Function to handle incoming contact form submissions
export const submitContactForm = async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Basic Server-side Validation
    if (!name || !email || !message) {
        console.error("Contact form validation failed: Missing name, email, or message.");
        return res.status(400).json({ message: "Please provide your name, email, and message." });
    }
    // Optional: More robust email validation if needed

    console.log("Received contact form submission:", { name, email, subject });

    try {
        // Prepare data for the email function
        const emailData = {
            fromName: name, // Name of the person submitting the form
            fromEmail: email, // Email of the person submitting
            subject: subject || 'New Contact Form Submission', // Default subject
            messageContent: message,
        };

        // Call the email sending function (we'll create this next)
        await sendContactFormEmail(emailData);

        console.log("Contact form email sent successfully.");
        res.status(200).json({ message: "Message sent successfully! We will get back to you soon." });

    } catch (error) {
        console.error("Error processing contact form:", error);
        res.status(500).json({ message: "Failed to send message due to a server error. Please try again later." });
    }
};
