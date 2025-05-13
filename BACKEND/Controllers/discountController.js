import Discount from "../Model/Discount.js";

// Create a new discount
export async function createDiscount(req, res) {
  try {
    const discount = new Discount(req.body);
    await discount.save();
    res.status(200).json(discount);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Get all discounts
export async function getDiscounts(req, res) {
  try {
    // Get user from JWT if available (req.user should be set by auth middleware)
    let user = req.user;
    let isAdmin = user && user.role === "admin";
    let discounts;
    if (isAdmin) {
      // Admin sees all discounts
      discounts = await Discount.find();
    } else if (user) {
      // User sees public or assigned discounts
      discounts = await Discount.find({
        $or: [
          { assignedTo: { $exists: false } },
          { assignedTo: { $size: 0 } },
          { assignedTo: user._id },
        ],
      });
    } else {
      // Not logged in: only public discounts
      discounts = await Discount.find({
        $or: [{ assignedTo: { $exists: false } }, { assignedTo: { $size: 0 } }],
      });
    }
    res.json(discounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Update a discount
export async function updateDiscount(req, res) {
  try {
    const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!discount)
      return res.status(404).json({ message: "Discount not found" });
    res.json(discount);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Delete a discount
export async function deleteDiscount(req, res) {
  try {
    const discount = await Discount.findByIdAndDelete(req.params.id);
    if (!discount)
      return res.status(404).json({ message: "Discount not found" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
