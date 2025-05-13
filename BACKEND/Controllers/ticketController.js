import Ticket from "../Model/Ticket.js";

// Create a new ticket (Customer)
export async function createTicket(req, res) {
  try {
    const ticket = new Ticket({
      ...req.body,
      customerId: req.user?._id, // Assuming user ID is available from auth middleware
      status: "Open", // Default status
    });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    // If it's a Mongoose validation error, show all errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors)
        .map((e) => e.message)
        .join("; ");
      return res.status(400).json({ message: messages });
    }
    res.status(400).json({ message: error.message || "Unknown error" });
  }
}

// Get all tickets (Admin) or customer's tickets (Customer)
export async function getTickets(req, res) {
  try {
    const isAdmin = req.user?.role === "admin"; // Assuming role from auth middleware
    const query = isAdmin ? {} : { customerId: req.user?._id };
    const tickets = await Ticket.find(query).populate(
      "customerId",
      "name email"
    );
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get a single ticket by ID
export async function getTicketById(req, res) {
  try {
    const ticket = await Ticket.findById(req.params.id).populate(
      "customerId",
      "name email"
    );
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    // Ensure customer can only view their own ticket, unless admin
    if (
      req.user?.role !== "admin" &&
      ticket.customerId.toString() !== req.user?._id
    ) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Update a ticket (Admin or Customer for comments)
export async function updateTicket(req, res) {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    // Restrict updates based on user role
    if (req.user?.role === "admin") {
      // Only update status if present
      if (typeof req.body.status === "string") ticket.status = req.body.status;
      // Only add a comment if present and non-empty
      if (req.body.comments && req.body.comments.trim()) {
        ticket.comments = ticket.comments || [];
        ticket.comments.push({
          text: req.body.comments,
          userId: req.user?._id,
          createdAt: new Date(),
        });
      }
      // Allow admin to set adminResponse
      if (typeof req.body.adminResponse === 'string') {
        ticket.adminResponse = req.body.adminResponse;
      }
    } else if (ticket.customerId.toString() === req.user?._id?.toString()) {
      // Customer can only add comments
      if (req.body.comments && req.body.comments.trim()) {
        ticket.comments = ticket.comments || [];
        ticket.comments.push({
          text: req.body.comments,
          userId: req.user?._id,
          createdAt: new Date(),
        });
      } else {
        return res
          .status(403)
          .json({ message: "Customers can only add comments" });
      }
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Delete a ticket (Admin only)
export async function deleteTicket(req, res) {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    const ticket = await Ticket.findByIdAndDelete(req.params._id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
