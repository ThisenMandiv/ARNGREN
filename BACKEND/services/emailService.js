// utils/emailService.js
import nodemailer from "nodemailer";

// Configure the transporter (ensure GMAIL_USER and GMAIL_APP_PASS are in .env)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
    },
});

// --- Existing function for order status (keep this) ---
export const sendStatusUpdateEmail = async (order) => {
    // ... (your existing code for sendStatusUpdateEmail) ...
     if (!order || !order.userName || !order.product || !order.status) {
        console.error("Invalid order data provided for email."); return;
    }
     const recipientEmail = process.env.GMAIL_USER; // Or order.userEmail
    const mailOptions = {
        from: `"JewelShop Orders" <${process.env.GMAIL_USER}>`,
        to: recipientEmail,
        subject: `Order Status Updated - Your JewelShop Order #${order._id}`,
        html: `... (your existing order email html) ...`
    };
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Status update email sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending status update email:", error);
    }
};

// --- NEW function for Contact Form ---
export const sendContactFormEmail = async (formData) => {
    const { fromName, fromEmail, subject, messageContent } = formData;

    // Define the recipient email address (where you want to receive contact messages)
    const recipientEmail = process.env.CONTACT_FORM_RECIPIENT || process.env.GMAIL_USER; // Use a specific env var or default to your user

    if (!recipientEmail) {
         console.error("Recipient email for contact form is not configured.");
         throw new Error("Server configuration error."); // Prevent sending without recipient
    }

    const mailOptions = {
        from: `"JewelShop Contact Form" <${process.env.GMAIL_USER}>`, // Your server's email
        to: recipientEmail, // Where the contact messages go
        replyTo: fromEmail, // Set the reply-to field to the sender's email
        subject: subject || `Contact Form Submission from ${fromName}`, // Email subject
        html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${fromName}</p>
            <p><strong>Email:</strong> ${fromEmail}</p>
            <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
            <hr>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${messageContent}</p>
            <hr>
            <p><small>This message was sent from the contact form on your website.</small></p>
        ` // HTML body
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Contact form email sent: %s", info.messageId);
        // No need to return anything specific here unless needed
    } catch (error) {
        console.error("Error sending contact form email:", error);
        // Re-throw the error so the controller knows sending failed
        throw new Error("Failed to send contact email via transporter.");
    }
};
