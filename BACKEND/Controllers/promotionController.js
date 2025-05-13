import Promotion from '../Model/Promotion.js';

// Create a new promotion
export async function createPromotion(req, res) {
    try {
        const promotion = new Promotion(req.body);
        await promotion.save();
        res.status(201).json(promotion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Get all promotions
export async function getPromotions(req, res) {
    try {
        const promotions = await Promotion.find();
        res.json(promotions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update a promotion
export async function updatePromotion(req, res) {
    try {
        const promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!promotion) return res.status(404).json({ message: 'Promotion not found' });
        res.json(promotion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Delete a promotion
export async function deletePromotion(req, res) {
    try {
        const promotion = await Promotion.findByIdAndDelete(req.params.id);
        if (!promotion) return res.status(404).json({ message: 'Promotion not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get a single promotion by ID
export async function getPromotionById(req, res) {
    try {
        const promotion = await Promotion.findById(req.params.id);
        if (!promotion) {
            return res.status(404).json({ message: 'Promotion not found' });
        }
        res.json(promotion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Assign users to a promotion
export async function assignUsersToPromotion(req, res) {
  try {
    const { promotionId, userIds } = req.body;
    if (!promotionId || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'promotionId and userIds[] are required.' });
    }
    const promotion = await Promotion.findByIdAndUpdate(
      promotionId,
      { $addToSet: { assignedTo: { $each: userIds } } },
      { new: true }
    ).populate('assignedTo', 'name email');
    if (!promotion) return res.status(404).json({ message: 'Promotion not found' });
    res.json(promotion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}